import { todayStr } from './date.js';
import type { Progress, Question, QuizItem } from './types.js';

const accuracy = (p?: Progress) => p && p.seenCount ? p.correctCount / p.seenCount : 0;

export const getDue = (questions: Question[], progressMap: Map<string, Progress>) => {
  const today = todayStr();
  return questions
    .filter((q) => { const p = progressMap.get(q.id); return !!p && p.dueDate <= today; })
    .sort((a, b) => (progressMap.get(a.id)?.dueDate || '').localeCompare(progressMap.get(b.id)?.dueDate || '') || accuracy(progressMap.get(a.id)) - accuracy(progressMap.get(b.id)));
};

export const buildDailyQuiz = (questions: Question[], progressMap: Map<string, Progress>, size: number): QuizItem[] => {
  const due = getDue(questions, progressMap);
  const selected: Question[] = [...due.slice(0, size)];
  const used = new Set(selected.map((q) => q.id));
  const newQs = questions.filter((q) => !progressMap.has(q.id) && !used.has(q.id));
  const byTopic = new Map<string, Question[]>();
  for (const q of newQs) {
    const key = `${q.subject}:${q.topic}`;
    byTopic.set(key, [...(byTopic.get(key) || []), q]);
  }
  while (selected.length < size && byTopic.size) {
    for (const [k, arr] of byTopic) {
      const q = arr.shift();
      if (q) { selected.push(q); used.add(q.id); }
      if (!arr.length) byTopic.delete(k);
      if (selected.length >= size) break;
    }
  }
  if (selected.length < size) {
    const fallback = questions.filter((q) => !used.has(q.id)).sort((a, b) => accuracy(progressMap.get(a.id)) - accuracy(progressMap.get(b.id)));
    selected.push(...fallback.slice(0, size - selected.length));
  }
  return selected.map((question) => ({ question, progress: progressMap.get(question.id) }));
};
