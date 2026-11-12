//! Full-text search engine used by the portfolio's browser UI.
//!
//! The engine builds an in-memory inverted index, scores field-aware matches,
//! supports prefix and phrase matching, and produces contextual snippets.
//! It intentionally has no network or filesystem access.

use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;

const TITLE_WEIGHT: f64 = 8.0;
const TAG_WEIGHT: f64 = 5.0;
const SUMMARY_WEIGHT: f64 = 3.0;
const BODY_WEIGHT: f64 = 1.0;
const PREFIX_FACTOR: f64 = 0.72;
const PHRASE_BONUS: f64 = 6.0;
const MAX_RESULTS: usize = 30;
const SNIPPET_RADIUS: usize = 96;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub kind: String,
    pub url: String,
    #[serde(default)]
    pub summary: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub body: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct SearchResult {
    pub id: String,
    pub title: String,
    pub kind: String,
    pub url: String,
    pub excerpt: String,
    pub score: f64,
}

#[derive(Default)]
struct Posting {
    title: u16,
    tags: u16,
    summary: u16,
    body: u16,
}

pub struct SearchIndex {
    documents: Vec<Document>,
    postings: HashMap<String, HashMap<usize, Posting>>,
    average_length: f64,
}

impl SearchIndex {
    pub fn new(documents: Vec<Document>) -> Self {
        let mut postings: HashMap<String, HashMap<usize, Posting>> = HashMap::new();
        let mut total_length = 0usize;
        for (doc_id, document) in documents.iter().enumerate() {
            add_field(&mut postings, doc_id, &document.title, Field::Title);
            for tag in &document.tags { add_field(&mut postings, doc_id, tag, Field::Tag); }
            add_field(&mut postings, doc_id, &document.summary, Field::Summary);
            add_field(&mut postings, doc_id, &document.body, Field::Body);
            total_length += tokenize(&document.body).len();
        }
        let average_length = (total_length as f64 / documents.len().max(1) as f64).max(1.0);
        Self { documents, postings, average_length }
    }

    pub fn search(&self, query: &str, limit: usize) -> Vec<SearchResult> {
        let terms = tokenize(query);
        if terms.is_empty() { return Vec::new(); }
        let phrase = normalize(query);
        let mut scores: HashMap<usize, f64> = HashMap::new();
        for term in &terms {
            let mut matched = HashSet::new();
            if let Some(exact) = self.postings.get(term) {
                for (&doc_id, posting) in exact {
                    *scores.entry(doc_id).or_default() += self.term_score(posting, doc_id, term);
                    matched.insert(doc_id);
                }
            }
            if term.chars().count() >= 3 {
                for (word, docs) in &self.postings {
                    if word != term && word.starts_with(term) {
                        for (&doc_id, posting) in docs {
                            if matched.insert(doc_id) {
                                *scores.entry(doc_id).or_default() += self.term_score(posting, doc_id, word) * PREFIX_FACTOR;
                            }
                        }
                    }
                }
            }
        }
        for (&doc_id, score) in scores.iter_mut() {
            let doc = &self.documents[doc_id];
            let title = normalize(&doc.title);
            let tags = normalize(&doc.tags.join(" "));
            let searchable = format!("{} {} {}", title, tags, normalize(&doc.summary));
            if searchable.contains(&phrase) { *score += PHRASE_BONUS; }
            // Prefer records whose metadata agrees with the whole query.
            if terms.iter().all(|term| searchable.split_whitespace().any(|word| word.starts_with(term))) { *score *= 1.18; }
        }
        let mut ranked: Vec<_> = scores.into_iter().collect();
        ranked.sort_by(|(a_id, a), (b_id, b)| b.total_cmp(a).then_with(|| self.documents[*a_id].title.cmp(&self.documents[*b_id].title)));
        ranked.into_iter().take(limit.min(MAX_RESULTS)).map(|(doc_id, score)| {
            let doc = &self.documents[doc_id];
            SearchResult { id: doc.id.clone(), title: doc.title.clone(), kind: doc.kind.clone(), url: doc.url.clone(), excerpt: make_excerpt(&doc.body, &terms, &doc.summary), score }
        }).collect()
    }

    fn term_score(&self, posting: &Posting, doc_id: usize, term: &str) -> f64 {
        let frequency = posting.title as f64 * TITLE_WEIGHT + posting.tags as f64 * TAG_WEIGHT
            + posting.summary as f64 * SUMMARY_WEIGHT + posting.body as f64 * BODY_WEIGHT;
        let doc_len = tokenize(&self.documents[doc_id].body).len() as f64;
        let idf = ((self.documents.len() as f64 + 1.0) / (self.postings.get(term).map_or(1, HashMap::len) as f64 + 0.5)).ln() + 1.0;
        let norm = 1.0 + 0.35 * (doc_len / self.average_length - 1.0);
        idf * frequency.max(0.0) / norm.max(0.25)
    }
}

#[derive(Clone, Copy)]
enum Field { Title, Tag, Summary, Body }

fn add_field(index: &mut HashMap<String, HashMap<usize, Posting>>, doc_id: usize, text: &str, field: Field) {
    for word in tokenize(text) {
        let posting = index.entry(word).or_default().entry(doc_id).or_default();
        let slot = match field { Field::Title => &mut posting.title, Field::Tag => &mut posting.tags, Field::Summary => &mut posting.summary, Field::Body => &mut posting.body };
        *slot = slot.saturating_add(1);
    }
}

fn tokenize(text: &str) -> Vec<String> {
    normalize(text).split_whitespace().map(str::to_owned).filter(|word| word.chars().count() > 1).collect()
}

fn normalize(text: &str) -> String {
    text.chars().flat_map(char::to_lowercase).map(|ch| if ch.is_alphanumeric() { ch } else { ' ' }).collect::<String>()
        .split_whitespace().collect::<Vec<_>>().join(" ")
}

fn make_excerpt(body: &str, terms: &[String], fallback: &str) -> String {
    let normalized = body.split_whitespace().collect::<Vec<_>>();
    if normalized.is_empty() { return truncate(fallback, SNIPPET_RADIUS * 2); }
    let hit = normalized.iter().position(|word| {
        let clean = normalize(word);
        terms.iter().any(|term| clean.contains(term))
    }).unwrap_or(0);
    let start = hit.saturating_sub(12);
    let end = (hit + 18).min(normalized.len());
    let mut excerpt = normalized[start..end].join(" ");
    if start > 0 { excerpt.insert_str(0, "…"); }
    if end < normalized.len() { excerpt.push('…'); }
    truncate(&excerpt, SNIPPET_RADIUS * 2)
}

fn truncate(text: &str, max: usize) -> String {
    if text.chars().count() <= max { return text.to_owned(); }
    format!("{}…", text.chars().take(max.saturating_sub(1)).collect::<String>())
}

#[wasm_bindgen]
pub struct WasmSearch { index: SearchIndex }

#[wasm_bindgen]
impl WasmSearch {
    #[wasm_bindgen(constructor)]
    pub fn new(json: &str) -> Result<WasmSearch, JsValue> {
        let documents: Vec<Document> = serde_json::from_str(json).map_err(|error| JsValue::from_str(&error.to_string()))?;
        Ok(Self { index: SearchIndex::new(documents) })
    }

    pub fn search(&self, query: &str, limit: usize) -> Result<String, JsValue> {
        serde_json::to_string(&self.index.search(query, limit)).map_err(|error| JsValue::from_str(&error.to_string()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn docs() -> Vec<Document> {
        vec![
            Document { id: "booking".into(), title: "Secure booking workflow".into(), kind: "Project".into(), url: "/portfolio/booking".into(), summary: "Calendar booking with authorization and idempotency".into(), tags: vec!["security".into(), "calendar".into()], body: "A secure workflow for booking calls with authorization controls.".into() },
            Document { id: "article".into(), title: "React performance notes".into(), kind: "Article".into(), url: "/blog/react-performance".into(), summary: "Frontend optimization".into(), tags: vec!["react".into()], body: "Rendering and bundle optimization techniques.".into() },
        ]
    }
    #[test] fn title_and_tag_matches_rank_first() { let results = SearchIndex::new(docs()).search("secure booking", 10); assert_eq!(results[0].id, "booking"); }
    #[test] fn prefix_search_finds_words() { assert_eq!(SearchIndex::new(docs()).search("authoriz", 10)[0].id, "booking"); }
    #[test] fn empty_search_has_no_results() { assert!(SearchIndex::new(docs()).search(" !!! ", 10).is_empty()); }
    #[test] fn result_count_is_bounded() { assert!(SearchIndex::new(docs()).search("secure", 500).len() <= MAX_RESULTS); }
}
