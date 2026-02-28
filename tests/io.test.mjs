import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBackup } from '../build/core/io.js';

test('backup parse validates schema', () => {
  const raw = JSON.stringify({
    schemaVersion: '1.0', exportedAt: new Date().toISOString(),
    settings: { dailySize: 10, wrongFirst: false, dueFirst: true },
    progress: [], customQuestions: [], daily: [], studyLogs: [], wrongNotes: []
  });
  const out = parseBackup(raw);
  assert.equal(out.schemaVersion, '1.0');
});
