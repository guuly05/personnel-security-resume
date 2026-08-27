import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOG_POSTS } from '../src/blog/posts.ts';
import { hashToSection, pathToSection, sectionToPath } from '../src/routing.ts';

test('routes known paths and blog slugs to their sections', () => {
  assert.equal(pathToSection('/'), 'home');
  assert.equal(pathToSection('/about'), 'about');
  assert.equal(pathToSection('/blog'), 'blog');
  assert.equal(pathToSection(`/blog/${BLOG_POSTS[0].slug}`), 'blog');
});

test('routes aliases, nested paths, and unknown paths correctly', () => {
  assert.equal(pathToSection('/reflection'), 'recap');
  assert.equal(pathToSection('//surprise/details'), 'recap');
  assert.equal(pathToSection('/blog/not-a-real-post'), 'not-found');
  assert.equal(pathToSection('/does-not-exist'), 'not-found');
  assert.equal(hashToSection('#contact'), 'contact');
  assert.equal(hashToSection('#vault/extra'), 'recap');
  assert.equal(hashToSection('#unknown'), null);
});

test('converts sections back to canonical paths', () => {
  assert.equal(sectionToPath('home'), '/');
  assert.equal(sectionToPath('book'), '/book');
  assert.equal(sectionToPath('not-found'), '/404');
});
