import { normalizeSettings } from './settings.js';
import type { DailyStats, Progress, Question, Settings } from './types.js';

const norm = (q: Question): Question => ({ ...q, createdBy: 'custom' });

export const parseImportQuestions = (name: string, text: string): Question[] => {
  if (name.endsWith('.json')) {
    const parsed = JSON.parse(text);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions;
    if (!Array.isArray(questions)) throw new Error('JSON 형식이 올바르지 않습니다.');
    return questions.map(norm);
  }
  if (name.endsWith('.csv')) {
    const [header, ...rows] = text.trim().split(/\r?\n/);
    const cols = header.split(',').map((v) => v.trim());
    const idx = (k: string) => cols.indexOf(k);
    return rows.filter(Boolean).map((r, i) => {
      const c = r.split(',');
      return norm({
        id: c[idx('id')] || `custom-${Date.now()}-${i}`,
        type: 'single', subject: c[idx('subject')] || '기타', system: c[idx('system')] || '일반', topic: c[idx('topic')] || '기본',
        difficulty: Number(c[idx('difficulty')] || 1), tags: (c[idx('tags')] || '').split('|').filter(Boolean), stem: c[idx('stem')] || '',
        choices: ['A', 'B', 'C', 'D'].map((k) => ({ key: k, text: c[idx(`choice${k}`)] || '' })).filter((x) => x.text),
        answer: c[idx('answer')] || 'A', explanation: c[idx('explanation')] || '', createdBy: 'custom', createdAt: new Date().toISOString().slice(0, 10)
      });
    });
  }
  throw new Error('JSON 또는 CSV 파일만 가져올 수 있습니다.');
};

export const parseBackup = (text: string): FullBackup => {
  const data = JSON.parse(text);
  if (data?.schemaVersion !== '1.0') throw new Error('지원하지 않는 백업 버전입니다.');
  for (const key of ['settings', 'progress', 'customQuestions', 'daily', 'studyLogs', 'wrongNotes']) {
    if (!(key in data)) throw new Error(`백업 파일에 ${key}가 없습니다.`);
  }
  return data as FullBackup;
};

export const dedupe = (incoming: Question[], existingIds: Set<string>) => incoming.map((q) => {
  let id = q.id; let n = 1;
  while (existingIds.has(id)) id = `${q.id}-${n++}`;
  existingIds.add(id);
  return { ...q, id };
});

export type BackupData = {
  exportedAt?: string;
  settings: Settings;
  progress: Progress[];
  customQuestions: Question[];
  daily: DailyStats[];
};

export const parseBackup = (text: string): BackupData => {
  const parsed = JSON.parse(text) as Partial<BackupData>;
  if (!parsed || typeof parsed !== 'object') throw new Error('백업 형식이 올바르지 않습니다.');

  return {
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : undefined,
    settings: normalizeSettings(parsed.settings),
    progress: Array.isArray(parsed.progress) ? parsed.progress : [],
    customQuestions: Array.isArray(parsed.customQuestions) ? parsed.customQuestions.map(norm) : [],
    daily: Array.isArray(parsed.daily) ? parsed.daily : []
  };
};
