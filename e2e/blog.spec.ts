import { expect, test } from '@playwright/test';

const php2ShellSlug = 'php2shell-two-critical-rce-flaws';
const php2ShellTitle = 'PHP2Shell: How Two Critical PHP RCE Bugs Crossed the Request Boundary';

test('blog archive search and article navigation publish the latest note', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/blog');
  await expect(page.getByRole('heading', { name: 'Latest notes' })).toBeVisible();

  await page.getByRole('searchbox', { name: 'Search posts' }).fill('PHP2Shell');
  const articleLink = page.locator(`a[href="/blog/${php2ShellSlug}"]`).first();
  await expect(articleLink).toBeVisible();
  await articleLink.click();

  await expect(page).toHaveURL(new RegExp(`/blog/${php2ShellSlug}$`));
  await expect(page.getByRole('heading', { level: 1, name: php2ShellTitle })).toBeVisible();
  await expect(page.getByText('CVE-2026-109618', { exact: false }).first()).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('direct articles, unknown-slug routing, and the prerendered 404 render correctly', async ({ page }) => {
  await page.goto(`/blog/${php2ShellSlug}`);
  await expect(page.getByRole('heading', { level: 1, name: php2ShellTitle })).toBeVisible();

  await page.goto('/blog');
  await page.evaluate(() => {
    window.history.pushState(null, '', '/blog/this-article-does-not-exist');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();

  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await expect(page.getByText('This address isn’t part of the site.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to the homepage' })).toBeVisible();
});

test('mobile navigation exposes and follows the blog link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('link', { name: 'Notes' }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole('heading', { name: 'Latest notes' })).toBeVisible();
});
