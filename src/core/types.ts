export type Choice = { key: string; text: string };
export type Question = {
  id: string; type: 'single'; subject: string; system: string; topic: string; difficulty: number;
  grade: 1 | 2 | 3 | 4; setId: string; setName: string;
  tags: string[]; stem: string; choices: Choice[]; answer: string; explanation: string;
  createdBy: 'bundled' | 'custom'; createdAt: string;
};
export type Progress = {
  questionId: string; seenCount: number; correctCount: number; lastResult: 'correct' | 'wrong' | null;
  lastSeenAt: string | null; ease: number; intervalDays: number; dueDate: string; lapseCount: number;
};
export type Settings = {
  dailySize: number;
  wrongFirst: boolean;
  dueFirst: boolean;
  selectedSetIds: string[];
  includeAllSets: boolean;
};
export type DailyStats = { date: string; solved: number; correct: number };
export type QuizItem = { question: Question; progress?: Progress };
export type FullBackup = {
  schemaVersion: '1.0'; exportedAt: string; settings: Settings; progress: Progress[];
  customQuestions: Question[]; daily: DailyStats[]; studyLogs: StudyLog[]; wrongNotes: WrongNote[];
};
