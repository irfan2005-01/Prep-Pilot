import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_VIEW,
  navigationTransition,
  postAuthenticationView,
  resumeAnalysisTransition,
} from '../src/appNavigation.ts';

test('the public first page is the resume analyzer', () => {
  assert.equal(INITIAL_VIEW, 'analyzer');
});

test('an anonymous analysis attempt opens sign-in and returns to the analyzer', () => {
  const transition = resumeAnalysisTransition(false);
  assert.equal(transition.view, 'login');
  assert.equal(transition.returnTo, 'analyzer');
  assert.equal(transition.requiresAuth, true);
  assert.equal(postAuthenticationView(transition.returnTo), 'analyzer');
});

test('signup and login return to the pending analyzer action', () => {
  assert.equal(postAuthenticationView('analyzer'), 'analyzer');
});

test('private history, roadmaps, and interviews redirect anonymous visitors', () => {
  for (const view of ['dashboard', 'roadmap', 'interview'] as const) {
    const transition = navigationTransition(view, false);
    assert.equal(transition.view, 'login');
    assert.equal(transition.returnTo, view);
  }
});

test('sample results remain public while a real saved result requires a session', () => {
  assert.equal(navigationTransition('results', false, true).view, 'results');
  assert.equal(navigationTransition('results', false, false).view, 'login');
});
