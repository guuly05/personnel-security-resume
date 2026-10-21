# Blog publishing

Add one `.md` file to `src/blog/posts/`. Each post starts with a JSON-compatible YAML frontmatter block:

```yaml
---
title: "A post title"
subtitle: "A short description for cards, SEO, and feeds."
date: "2026-08-27"
lastUpdated: "2026-08-27"
readTime: "6 min read"
mood: "Analytical"
image: "/images/example.png"
tags: ["Security", "Research"]
relatedTopics: ["Threat modeling", "Detection engineering"]
citations: [{"title":"Source name","url":"https://example.com","publisher":"Publisher"}]
---
```

The build indexes the files, validates the required fields, updates the sitemap, and generates `/rss.xml` and `/atom.xml`. CI checks post metadata, slug uniqueness, homepage featured-note consistency, prerendered article headings, and coverage in all three publishing outputs.

Run `npm test` for metadata and routing checks. Run `npm run test:e2e` after `npm run build` for browser checks of archive search, article navigation, direct article URLs, and the mobile menu. Install the local browser first with `npx playwright install chromium`.
