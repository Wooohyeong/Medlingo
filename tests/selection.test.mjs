import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDailyQuiz } from '../build/core/selection.js';
import { todayStr } from '../build/core/date.js';

const mkQ = (id, tags = []) => ({
  id,
  type: 'single',
  subject: '내과',
  system: '심장',
  topic: `t${id}`,
  difficulty: 1,
  tags,
  stem: 's',
  choices: [{ key: 'A', text: 'a' }],
  answer: 'A',
  explanation: 'e',
  createdBy: 'bundled',
  createdAt: '2026-01-01'
});

test('daily quiz는 선택된 세트 후보군에서만 문제를 뽑는다', () => {
  const qs = [mkQ('q1', ['setA']), mkQ('q2', ['setB']), mkQ('q3', ['setA'])];
  const out = buildDailyQuiz(qs, new Map(), 3, ['setA'], () => 0).map((x) => x.question.id);
  assert.deepEqual(new Set(out), new Set(['q1', 'q3']));
});

test('daily quiz는 due를 우선 포함하고 결과는 셔플된다', () => {
  const qs = [mkQ('q1'), mkQ('q2'), mkQ('q3')];
  const m = new Map();
  m.set('q1', { questionId: 'q1', seenCount: 2, correctCount: 0, lastResult: 'wrong', lastSeenAt: null, ease: 2, intervalDays: 1, dueDate: todayStr(), lapseCount: 1 });
  const out = buildDailyQuiz(qs, m, 3, undefined, () => 0.8).map((x) => x.question.id);
  assert.equal(out.length, 3);
  assert.ok(out.includes('q1'));
});

test('daily quiz는 due 이후 신규/저정확도 문제로 보충한다', () => {
  const qs = [mkQ('due'), mkQ('new'), mkQ('low'), mkQ('high')];
  const m = new Map();
  m.set('due', { questionId: 'due', seenCount: 2, correctCount: 1, lastResult: 'wrong', lastSeenAt: null, ease: 2, intervalDays: 1, dueDate: todayStr(), lapseCount: 1 });
  m.set('low', { questionId: 'low', seenCount: 5, correctCount: 1, lastResult: 'wrong', lastSeenAt: null, ease: 2, intervalDays: 1, dueDate: '2999-01-01', lapseCount: 1 });
  m.set('high', { questionId: 'high', seenCount: 5, correctCount: 5, lastResult: 'correct', lastSeenAt: null, ease: 2, intervalDays: 1, dueDate: '2999-01-01', lapseCount: 0 });

  const out = buildDailyQuiz(qs, m, 3, undefined, () => 0).map((x) => x.question.id);
  assert.ok(out.includes('due'));
  assert.ok(out.includes('new'));
  assert.ok(out.includes('low'));
  assert.ok(!out.includes('high'));
});
