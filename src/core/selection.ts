import { todayStr } from './date.js';
import type { Progress, Question, QuizItem } from './types.js';

const accuracy = (p?: Progress) => p && p.seenCount ? p.correctCount / p.seenCount : 0;

export type RandomFn = () => number;

const shuffle = <T>(items: T[], random: RandomFn): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const filterBySelectedSets = (questions: Question[], selectedSetIds?: string[]) => {
  if (!selectedSetIds?.length) return questions;
  const selected = new Set(selectedSetIds);
  return questions.filter((q) => q.tags.some((tag) => selected.has(tag)));
};

export const getDue = (questions: Question[], progressMap: Map<string, Progress>) => {
  const today = todayStr();
  return questions
    .filter((q) => { const p = progressMap.get(q.id); return !!p && p.dueDate <= today; })
    .sort((a, b) => (progressMap.get(a.id)?.dueDate || '').localeCompare(progressMap.get(b.id)?.dueDate || '') || accuracy(progressMap.get(a.id)) - accuracy(progressMap.get(b.id)));
};

export const buildDailyQuiz = (
  questions: Question[],
  progressMap: Map<string, Progress>,
  size: number,
  selectedSetIds?: string[],
  random: RandomFn = Math.random
): QuizItem[] => {
  const candidates = filterBySelectedSets(questions, selectedSetIds);
  const due = getDue(candidates, progressMap);
  const selected: Question[] = [...due.slice(0, size)];
  const used = new Set(selected.map((q) => q.id));

  if (selected.length < size) {
    const remainder = candidates
      .filter((q) => !used.has(q.id) && (!progressMap.has(q.id) || accuracy(progressMap.get(q.id)) < 0.6))
      .sort((a, b) => {
        const aProg = progressMap.get(a.id);
        const bProg = progressMap.get(b.id);
        const aNew = aProg ? 1 : 0;
        const bNew = bProg ? 1 : 0;
        if (aNew !== bNew) return aNew - bNew;
        return accuracy(aProg) - accuracy(bProg);
      });
    const needed = size - selected.length;
    const picked = remainder.slice(0, needed);
    selected.push(...picked);
    picked.forEach((q) => used.add(q.id));
  }

  if (selected.length < size) {
    const fallback = candidates
      .filter((q) => !used.has(q.id))
      .sort((a, b) => accuracy(progressMap.get(a.id)) - accuracy(progressMap.get(b.id)));
    selected.push(...fallback.slice(0, size - selected.length));
  }

  return shuffle(selected, random).map((question) => ({ question, progress: progressMap.get(question.id) }));
};
