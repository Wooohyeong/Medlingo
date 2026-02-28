import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDailyQuiz } from '../build/core/selection.js';
import { todayStr } from '../build/core/date.js';

const qs = [1,2,3,4,5].map((i)=>({id:`q${i}`,type:'single',subject:'내과',system:'심장',topic:`t${i%2}`,difficulty:1,tags:[],stem:'s',choices:[{key:'A',text:'a'}],answer:'A',explanation:'e',createdBy:'bundled',createdAt:'2026-01-01'}));

test('daily quiz는 due 우선', () => {
  const m = new Map();
  m.set('q1',{questionId:'q1',seenCount:2,correctCount:0,lastResult:'wrong',lastSeenAt:null,ease:2,intervalDays:1,dueDate:todayStr(),lapseCount:1});
  const out = buildDailyQuiz(qs,m,3).map((x)=>x.question.id);
  assert.equal(out[0], 'q1');
  assert.equal(out.length, 3);
});
