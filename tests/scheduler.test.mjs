import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultProgress, updateProgress } from '../build/core/scheduler.js';

test('정답 시 interval/ease 증가', () => {
  const p0 = { ...defaultProgress('q1'), questionId: 'q1' };
  const p1 = updateProgress(p0, true);
  assert.equal(p1.intervalDays, 1);
  const p2 = updateProgress(p1, true);
  assert.equal(p2.intervalDays, 3);
  assert.ok(p2.ease > p1.ease);
});

test('오답 시 lapse 증가', () => {
  const p0 = { ...defaultProgress('q2'), questionId: 'q2' };
  const p1 = updateProgress(p0, false);
  assert.equal(p1.intervalDays, 1);
  assert.equal(p1.lapseCount, 1);
});
