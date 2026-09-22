import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCommand } from '../src/commands/commandEngine.ts';
import { NAVIGABLE_SECTIONS, sectionToPath } from '../src/routing.ts';

test('lists every route that the terminal can safely open', () => {
  const result = executeCommand('ls');
  const output = result.lines.map((entry) => entry.text).join('\n');

  for (const section of NAVIGABLE_SECTIONS) {
    assert.match(output, new RegExp(`\\${sectionToPath(section)}(?:\\n|$)`));
  }
});

test('supports navigation aliases and rejects unsafe or unknown targets', () => {
  assert.equal(executeCommand('OPEN /book').navigate, 'book');
  assert.equal(executeCommand('cd terms-of-service').navigate, 'terms-of-service');
  assert.equal(executeCommand('goto portfolio/project').navigate, undefined);
  assert.match(executeCommand('goto nowhere').lines[0].text, /unknown section/);
});

test('preserves echo text while normalizing command names', () => {
  assert.equal(executeCommand('EcHo Hello, Guuleed!').lines[0].text, 'Hello, Guuleed!');
  assert.equal(executeCommand('PWD').lines[0].text, '/portfolio');
});

test('returns safe read-only status and contact commands', () => {
  assert.equal(executeCommand('status').lines[0].type, 'success');
  assert.equal(executeCommand('cat contact').lines.some((entry) => entry.text.includes('Email')), true);
});

test('exposes terminal side effects as explicit result flags', () => {
  assert.equal(executeCommand('theme LIGHT').theme, 'light');
  assert.equal(executeCommand('clear').clear, true);
  assert.equal(executeCommand('quit').exit, true);
});

test('supports blog discovery commands and safe note navigation', () => {
  const latest = executeCommand('latest');
  assert.match(latest.lines[0].text, /latest note/i);
  assert.match(latest.navigate ?? '', /^\/blog\//);

  const posts = executeCommand('posts');
  assert.match(posts.lines[0].text, /latest-notes/i);

  const invalid = executeCommand('read does-not-exist');
  assert.equal(invalid.navigate, undefined);
  assert.match(invalid.lines[0].text, /not found/i);
});

test('supports filtered stack and project searches', () => {
  const stack = executeCommand('stack react');
  assert.match(stack.lines.map((entry) => entry.text).join('\n'), /React/i);

  const search = executeCommand('find security');
  assert.match(search.lines.map((entry) => entry.text).join('\n'), /PROJECTS|NOTES/);
});
