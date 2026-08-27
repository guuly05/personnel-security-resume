import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownRenderer } from '../src/pages/Blog.tsx';

function renderMarkdown(content: string) {
  return renderToStaticMarkup(React.createElement(MarkdownRenderer, { content }));
}

test('renders Markdown inline formatting and sanitizes raw HTML', () => {
  const html = renderMarkdown('**bold** *italic* `code` [docs](https://example.com)');
  const unsafeHtml = renderMarkdown('<script>alert(1)</script>');

  assert.equal(unsafeHtml, '');
  assert.doesNotMatch(html, /<script>|alert\(1\)/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /<em>italic<\/em>/);
  assert.match(html, /<code[^>]*>code<\/code>/);
  assert.match(html, /<a href="https:\/\/example\.com" target="_blank" rel="noreferrer noopener">docs<\/a>/);
});

test('parses headings, lists, quotes, tables, and code blocks into markup', () => {
  const markdown = [
    '## Heading',
    '',
    'A **bold** paragraph.',
    '',
    '> A useful quote',
    '',
    '- First',
    '- Second',
    '',
    '| Name | Value |',
    '| --- | --- |',
    '| One | 1 |',
    '',
    '```ts',
    'const answer = 42;',
    '```',
  ].join('\n');

  const html = renderMarkdown(markdown);

  assert.match(html, /<h2[^>]*>Heading<\/h2>/);
  assert.match(html, /<p[^>]*>A <strong>bold<\/strong> paragraph\.<\/p>/);
  assert.match(html, /<blockquote[^>]*>\s*<p[^>]*>A useful quote<\/p>\s*<\/blockquote>/);
  assert.match(html, /<ul[^>]*>\s*<li[^>]*>First<\/li>\s*<li[^>]*>Second<\/li>\s*<\/ul>/);
  assert.match(html, /<th[^>]*>Name<\/th>/);
  assert.match(html, /<td[^>]*>1<\/td>/);
  assert.match(html, /<pre class="blog-code-block"><code class="language-ts"[^>]*>const answer = 42;\n<\/code><\/pre>/);
});

test('rejects unsafe link protocols', () => {
  const html = renderMarkdown('[unsafe](javascript:alert(1)) [safe](/about)');

  assert.doesNotMatch(html, /href="javascript:/);
  assert.match(html, /<span>unsafe<\/span>/);
  assert.match(html, /<a href="\/about">safe<\/a>/);
});
