import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOG_POSTS } from '../src/blog/posts.ts';
import { LATEST_POST } from '../src/blog/latestPost.ts';

function assertIsoDate(value: string, field: string, slug: string) {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/, `${slug}: ${field} must use YYYY-MM-DD`);
  assert.equal(
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10),
    value,
    `${slug}: ${field} must be a real calendar date`,
  );
}

test('blog posts have publishable, unique metadata', () => {
  assert.ok(BLOG_POSTS.length > 0, 'at least one blog post must be published');
  const slugs = BLOG_POSTS.map((post) => post.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'post slugs must be unique');

  for (const [index, post] of BLOG_POSTS.entries()) {
    if (index > 0) {
      assert.ok(BLOG_POSTS[index - 1].date >= post.date, 'posts must be sorted newest first');
    }

    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${post.slug}: invalid URL slug`);
    assert.ok(post.title.trim(), `${post.slug}: title is required`);
    assert.ok(post.subtitle.trim(), `${post.slug}: subtitle is required`);
    assert.ok(post.content.trim(), `${post.slug}: article body is required`);
    assert.ok(post.tags.length > 0, `${post.slug}: at least one tag is required`);
    assert.ok(post.relatedTopics.length > 0, `${post.slug}: at least one related topic is required`);

    assertIsoDate(post.date, 'date', post.slug);
    assertIsoDate(post.lastUpdated, 'lastUpdated', post.slug);
    assert.ok(post.lastUpdated >= post.date, `${post.slug}: lastUpdated cannot precede date`);

    for (const citation of post.citations) {
      assert.ok(citation.title.trim(), `${post.slug}: citations need titles`);
      const url = new URL(citation.url);
      assert.equal(url.protocol, 'https:', `${post.slug}: citation must use HTTPS: ${citation.url}`);
    }
  }
});

test('featured note matches the newest published post', () => {
  const newestPost = BLOG_POSTS[0];
  assert.ok(newestPost, 'the blog catalog must contain a newest post');
  assert.deepEqual(
    { slug: LATEST_POST.slug, title: LATEST_POST.title, date: LATEST_POST.date },
    { slug: newestPost.slug, title: newestPost.title, date: newestPost.date },
    'homepage featured-note data must stay in sync with the blog catalog',
  );
});
