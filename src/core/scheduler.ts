import { addDays, todayStr } from './date.js';
import type { Progress } from './types.js';

export const defaultProgress = (questionId: string): Progress => ({
  questionId, seenCount: 0, correctCount: 0, lastResult: null, lastSeenAt: null,
  ease: 2.3, intervalDays: 0, dueDate: todayStr(), lapseCount: 0
});

export const updateProgress = (current: Progress | undefined, isCorrect: boolean): Progress => {
  const p = current ? { ...current } : defaultProgress('');
  const today = todayStr();
  p.seenCount += 1;
  p.lastSeenAt = new Date().toISOString();
  if (isCorrect) {
    p.correctCount += 1;
    p.lastResult = 'correct';
    p.intervalDays = p.intervalDays === 0 ? 1 : p.intervalDays === 1 ? 3 : Math.round(p.intervalDays * p.ease);
    p.ease = Math.min(2.8, p.ease + 0.05);
    p.dueDate = addDays(today, p.intervalDays);
  } else {
    p.lastResult = 'wrong';
    p.lapseCount += 1;
    p.ease = Math.max(1.3, p.ease - 0.2);
    p.intervalDays = 1;
    p.dueDate = addDays(today, 1);
  }
  return p;
};
