import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApiBaseUrl } from '../src/services/normalizeApiBaseUrl.ts';

test('bare Railway hostname is normalized to an HTTPS API origin', () => {
  assert.equal(
    normalizeApiBaseUrl('prep-pilot-production.up.railway.app'),
    'https://prep-pilot-production.up.railway.app',
  );
});

test('explicit origins keep their scheme and have trailing slashes removed', () => {
  assert.equal(normalizeApiBaseUrl(' https://api.example.com/ '), 'https://api.example.com');
  assert.equal(normalizeApiBaseUrl('http://localhost:8080/'), 'http://localhost:8080');
});

test('same-origin proxy paths and empty configuration are preserved', () => {
  assert.equal(normalizeApiBaseUrl('/api/'), '/api');
  assert.equal(normalizeApiBaseUrl(undefined), undefined);
  assert.equal(normalizeApiBaseUrl('   '), undefined);
});
