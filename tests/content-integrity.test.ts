import assert from 'node:assert/strict';
import test from 'node:test';
import { CASE_STUDIES } from '../src/pages/Portfolio.tsx';
import { PROJECT_DETAILS } from '../src/data/projectDetails.ts';

test('every public case study has a matching detailed case study', () => {
  const ids = CASE_STUDIES.map((study) => study.id);
  assert.equal(new Set(ids).size, ids.length, 'case study IDs must be unique');
  for (const study of CASE_STUDIES) {
    assert.ok(PROJECT_DETAILS[study.id], `missing project detail for ${study.id}`);
    assert.ok(study.title.trim(), `missing title for ${study.id}`);
    assert.ok(study.imageUrl.trim(), `missing image for ${study.id}`);
  }
});

test('case study links use secure external URLs when present', () => {
  for (const study of CASE_STUDIES) {
    for (const link of [study.githubUrl, study.liveUrl].filter(Boolean)) {
      assert.match(link!, /^https:\/\//, `${study.id} contains a non-HTTPS external link`);
    }
  }
});
