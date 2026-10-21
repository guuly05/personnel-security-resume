/// <reference types="vite/client" />

// Keep article route validation cheap: this glob records paths but does not
// eagerly load Markdown content into the app's initial JavaScript bundle.
const postFiles = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' });

export const BLOG_POST_SLUGS = Object.keys(postFiles).map((path) => {
  const filename = path.split('/').pop() ?? '';
  return filename.replace(/\.md$/, '');
});
