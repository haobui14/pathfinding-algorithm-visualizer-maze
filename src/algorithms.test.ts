// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';
import { bfs, dfs } from './algorithms.js';

const mazeWithPath = [
  ['start', 'path', 'end'],
  ['wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall'],
];

const mazeWithoutPath = [
  ['start', 'wall', 'end'],
  ['wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall'],
];

const start: [number, number] = [0, 0];

test('bfs finds path when one exists', () => {
  assert.equal(bfs(mazeWithPath, start), true);
});

test('dfs finds path when one exists', () => {
  assert.equal(dfs(mazeWithPath, start), true);
});

test('bfs returns false when no path exists', () => {
  assert.equal(bfs(mazeWithoutPath, start), false);
});

test('dfs returns false when no path exists', () => {
  assert.equal(dfs(mazeWithoutPath, start), false);
});
