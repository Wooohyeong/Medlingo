import { todayStr } from './date.js';
import { normalizeSettings } from './settings.js';
import type { DailyStats, Progress, Question, Settings } from './types.js';

const DB_NAME = 'meddaily';
const VERSION = 1;

const reqToPromise = <T>(req: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
});

const openDb = () => new Promise<IDBDatabase>((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, VERSION);
  req.onupgradeneeded = () => {
    const db = req.result;
    db.createObjectStore('progress', { keyPath: 'questionId' });
    db.createObjectStore('daily', { keyPath: 'date' });
    db.createObjectStore('settings', { keyPath: 'id' });
    db.createObjectStore('customQuestions', { keyPath: 'id' });
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

const txDone = (tx: IDBTransaction) => new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });

export const db = {
  async getAllProgress() { const d = await openDb(); return reqToPromise(d.transaction('progress').objectStore('progress').getAll()) as Promise<Progress[]>; },
  async putProgress(p: Progress) { const d = await openDb(); const tx = d.transaction('progress', 'readwrite'); tx.objectStore('progress').put(p); await txDone(tx); },
  async getSettings(): Promise<Settings> {
    const d = await openDb();
    const item = await reqToPromise<any>(d.transaction('settings').objectStore('settings').get('settings'));
    return normalizeSettings(item?.value);
  },
  async putSettings(value: Settings) {
    const d = await openDb();
    const tx = d.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ id: 'settings', value: normalizeSettings(value) });
    await txDone(tx);
  },
  async getCustomQuestions() { const d = await openDb(); return reqToPromise<Question[]>(d.transaction('customQuestions').objectStore('customQuestions').getAll()); },
  async putCustomQuestions(questions: Question[]) { const d = await openDb(); const tx = d.transaction('customQuestions', 'readwrite'); questions.forEach((q) => tx.objectStore('customQuestions').put(q)); await txDone(tx); },
  async getDaily(date = todayStr()): Promise<DailyStats> { const d = await openDb(); return (await reqToPromise<any>(d.transaction('daily').objectStore('daily').get(date))) || { date, solved: 0, correct: 0 }; },
  async addDaily(isCorrect: boolean) { const date = todayStr(); const current = await this.getDaily(date); current.solved += 1; if (isCorrect) current.correct += 1; const d = await openDb(); const tx = d.transaction('daily', 'readwrite'); tx.objectStore('daily').put(current); await txDone(tx); },
  async getAllDaily() { const d = await openDb(); return reqToPromise<DailyStats[]>(d.transaction('daily').objectStore('daily').getAll()); },
  async resetProgress() { const d = await openDb(); const tx = d.transaction(['progress', 'daily'], 'readwrite'); tx.objectStore('progress').clear(); tx.objectStore('daily').clear(); await txDone(tx); }
};
