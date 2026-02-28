import { todayStr } from './date.js';
import type { DailyStats, FullBackup, Progress, Question, Settings, StudyLog, WrongNote } from './types.js';

const DB_NAME = 'meddaily';
const VERSION = 2;

const reqToPromise = <T>(req: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
});

const openDb = () => new Promise<IDBDatabase>((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, VERSION);
  req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress', { keyPath: 'questionId' });
    if (!db.objectStoreNames.contains('daily')) db.createObjectStore('daily', { keyPath: 'date' });
    if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
    if (!db.objectStoreNames.contains('customQuestions')) db.createObjectStore('customQuestions', { keyPath: 'id' });
    if (!db.objectStoreNames.contains('studyLogs')) db.createObjectStore('studyLogs', { keyPath: 'id' });
    if (!db.objectStoreNames.contains('wrongNotes')) db.createObjectStore('wrongNotes', { keyPath: 'questionId' });
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
    return item?.value || { dailySize: 10, wrongFirst: false, dueFirst: true };
  },
  async putSettings(value: Settings) { const d = await openDb(); const tx = d.transaction('settings', 'readwrite'); tx.objectStore('settings').put({ id: 'settings', value }); await txDone(tx); },
  async getCustomQuestions() { const d = await openDb(); return reqToPromise<Question[]>(d.transaction('customQuestions').objectStore('customQuestions').getAll()); },
  async putCustomQuestions(questions: Question[]) { const d = await openDb(); const tx = d.transaction('customQuestions', 'readwrite'); questions.forEach((q) => tx.objectStore('customQuestions').put(q)); await txDone(tx); },
  async getDaily(date = todayStr()): Promise<DailyStats> { const d = await openDb(); return (await reqToPromise<any>(d.transaction('daily').objectStore('daily').get(date))) || { date, solved: 0, correct: 0 }; },
  async addDaily(isCorrect: boolean) { const date = todayStr(); const current = await this.getDaily(date); current.solved += 1; if (isCorrect) current.correct += 1; const d = await openDb(); const tx = d.transaction('daily', 'readwrite'); tx.objectStore('daily').put(current); await txDone(tx); },
  async getAllDaily() { const d = await openDb(); return reqToPromise<DailyStats[]>(d.transaction('daily').objectStore('daily').getAll()); },
  async addStudyLog(log: StudyLog) { const d = await openDb(); const tx = d.transaction('studyLogs', 'readwrite'); tx.objectStore('studyLogs').put(log); await txDone(tx); },
  async getAllStudyLogs() { const d = await openDb(); return reqToPromise<StudyLog[]>(d.transaction('studyLogs').objectStore('studyLogs').getAll()); },
  async addWrongNote(questionId: string, record: WrongNote['records'][number]) {
    const d = await openDb();
    const tx = d.transaction('wrongNotes', 'readwrite');
    const store = tx.objectStore('wrongNotes');
    const current = (await reqToPromise<any>(store.get(questionId))) || { questionId, records: [], updatedAt: new Date().toISOString() };
    current.records.push(record);
    current.updatedAt = new Date().toISOString();
    store.put(current);
    await txDone(tx);
  },
  async getAllWrongNotes() { const d = await openDb(); return reqToPromise<WrongNote[]>(d.transaction('wrongNotes').objectStore('wrongNotes').getAll()); },
  async exportAll(): Promise<FullBackup> {
    return {
      schemaVersion: '1.0',
      exportedAt: new Date().toISOString(),
      settings: await this.getSettings(),
      progress: await this.getAllProgress(),
      customQuestions: await this.getCustomQuestions(),
      daily: await this.getAllDaily(),
      studyLogs: await this.getAllStudyLogs(),
      wrongNotes: await this.getAllWrongNotes()
    };
  },
  async importAll(data: FullBackup) {
    const d = await openDb();
    const tx = d.transaction(['settings', 'progress', 'customQuestions', 'daily', 'studyLogs', 'wrongNotes'], 'readwrite');
    tx.objectStore('settings').put({ id: 'settings', value: data.settings });
    for (const s of ['progress', 'customQuestions', 'daily', 'studyLogs', 'wrongNotes'] as const) {
      const store = tx.objectStore(s);
      store.clear();
    }
    data.progress.forEach((x) => tx.objectStore('progress').put(x));
    data.customQuestions.forEach((x) => tx.objectStore('customQuestions').put(x));
    data.daily.forEach((x) => tx.objectStore('daily').put(x));
    data.studyLogs.forEach((x) => tx.objectStore('studyLogs').put(x));
    data.wrongNotes.forEach((x) => tx.objectStore('wrongNotes').put(x));
    await txDone(tx);
  },
  async resetProgress() {
    const d = await openDb();
    const tx = d.transaction(['progress', 'daily', 'studyLogs', 'wrongNotes'], 'readwrite');
    tx.objectStore('progress').clear(); tx.objectStore('daily').clear(); tx.objectStore('studyLogs').clear(); tx.objectStore('wrongNotes').clear();
    await txDone(tx);
  }
};
