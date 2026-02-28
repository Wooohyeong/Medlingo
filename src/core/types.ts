export type Choice = { key: string; text: string };
export type Question = {
  id: string; type: 'single'; subject: string; system: string; topic: string; difficulty: number;
  tags: string[]; stem: string; choices: Choice[]; answer: string; explanation: string;
  createdBy: 'bundled' | 'custom'; createdAt: string;
};
export type Progress = {
  questionId: string; seenCount: number; correctCount: number; lastResult: 'correct' | 'wrong' | null;
  lastSeenAt: string | null; ease: number; intervalDays: number; dueDate: string; lapseCount: number;
};
export type StudyLog = {
  id: string; questionId: string; mode: 'daily' | 'review'; result: 'correct' | 'wrong';
  selectedAnswer: string; correctAnswer: string; answeredAt: string;
};
export type WrongNoteItem = { answeredAt: string; selectedAnswer: string; correctAnswer: string; stem: string; explanation: string };
export type WrongNote = { questionId: string; records: WrongNoteItem[]; updatedAt: string };
export type Settings = { dailySize: number; wrongFirst: boolean; dueFirst: boolean };
export type DailyStats = { date: string; solved: number; correct: number };
export type QuizItem = { question: Question; progress?: Progress };
export type FullBackup = {
  schemaVersion: '1.0'; exportedAt: string; settings: Settings; progress: Progress[];
  customQuestions: Question[]; daily: DailyStats[]; studyLogs: StudyLog[]; wrongNotes: WrongNote[];
};
