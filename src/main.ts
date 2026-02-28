import { db } from './core/db.js';
import { parseImport, dedupe } from './core/io.js';
import { buildDailyQuiz, getDue } from './core/selection.js';
import { defaultProgress, updateProgress } from './core/scheduler.js';
import { todayStr } from './core/date.js';
import type { Progress, Question, Settings } from './core/types.js';

type Route = 'home'|'daily'|'review'|'manager'|'stats'|'settings';
const app = document.getElementById('app')!;
let questions: Question[] = [];
let progressMap = new Map<string, Progress>();
let settings: Settings = { dailySize: 10, wrongFirst: false, dueFirst: true, selectedSetIds: [] };

const load = async () => {
  const bundled = await (await fetch('/public/data/questions.sample.json')).json();
  const custom = await db.getCustomQuestions();
  questions = [...bundled.questions, ...custom];
  progressMap = new Map((await db.getAllProgress()).map((p) => [p.questionId, p]));
  settings = await db.getSettings();
};

const nav = (r: Route) => { location.hash = r; render(); };
const stat = () => ({ due: getDue(questions, progressMap).length, newCount: questions.filter((q) => !progressMap.has(q.id)).length, totalSolved: [...progressMap.values()].reduce((a,b)=>a+b.seenCount,0) });

const shell = (content: string) => `
  <h1>MedDaily</h1>
  <p class='muted'>${navigator.onLine ? '🟢 온라인' : '🔴 오프라인'}</p>
  <div class='card'>${content}</div>
`;

const renderHome = async () => {
  const s = stat();
  const daily = await db.getDaily(todayStr());
  app.innerHTML = shell(`
    <h2>오늘 요약</h2>
    <div class='grid'><div>Due: <b>${s.due}</b></div><div>New: <b>${s.newCount}</b></div><div>연속: <b>${daily.solved>0?1:0}</b></div><div>총 풀이: <b>${s.totalSolved}</b></div></div>
    <div class='grid' style='margin-top:12px'>
      <button aria-label='오늘의 퀴즈 시작' class='btn' id='goDaily'>오늘의 퀴즈 시작</button>
      <button class='btn' id='goReview'>오늘 복습</button>
      <button class='btn secondary' id='goManager'>문항 관리</button>
      <button class='btn secondary' id='goStats'>통계</button>
      <button class='btn secondary' id='goSettings'>설정</button>
    </div>`);
  (document.getElementById('goDaily') as HTMLButtonElement).onclick = () => nav('daily');
  (document.getElementById('goReview') as HTMLButtonElement).onclick = () => nav('review');
  (document.getElementById('goManager') as HTMLButtonElement).onclick = () => nav('manager');
  (document.getElementById('goStats') as HTMLButtonElement).onclick = () => nav('stats');
  (document.getElementById('goSettings') as HTMLButtonElement).onclick = () => nav('settings');
};

const renderQuiz = async (mode:'daily'|'review') => {
  const queue = mode === 'daily' ? buildDailyQuiz(questions, progressMap, settings.dailySize, settings.selectedSetIds).map((x)=>x.question) : getDue(questions, progressMap);
  let i = 0, correct = 0; const wrong: string[] = [];
  const show = () => {
    if (i >= queue.length) {
      app.innerHTML = shell(`<h2>세션 완료</h2><p>점수: ${correct}/${queue.length}</p><p>오답: ${wrong.join(', ') || '없음'}</p><button class='btn' id='home'>홈으로</button>`);
      (document.getElementById('home') as HTMLButtonElement).onclick = () => nav('home'); return;
    }
    const q = queue[i];
    app.innerHTML = shell(`<h2>${mode==='daily'?'오늘의 퀴즈':'복습'} (${i+1}/${queue.length})</h2><p><b>${q.stem}</b></p>
      <div>${q.choices.map((c)=>`<button class='btn secondary choice' data-k='${c.key}'>${c.key}. ${c.text}</button>`).join(' ')}</div><div id='fb'></div><div class='row'><button class='btn' id='next' style='display:none'>다음</button><button class='btn secondary' id='stop'>중단</button></div>`);
    document.querySelectorAll('.choice').forEach((el) => (el as HTMLButtonElement).onclick = async () => {
      const picked = (el as HTMLElement).dataset.k!; const ok = picked === q.answer;
      const p = updateProgress({ ...(progressMap.get(q.id) || defaultProgress(q.id)), questionId: q.id }, ok);
      progressMap.set(q.id, p); await db.putProgress(p); await db.addDaily(ok);
      if (ok) correct++; else wrong.push(q.id);
      (document.getElementById('fb') as HTMLDivElement).innerHTML = `<p class='${ok?'good':'bad'}'>${ok?'정답':'오답'} (정답: ${q.answer})</p><p>${q.explanation}</p>`;
      (document.getElementById('next') as HTMLButtonElement).style.display = 'inline-block';
    });
    (document.getElementById('next') as HTMLButtonElement).onclick = () => { i++; show(); };
    (document.getElementById('stop') as HTMLButtonElement).onclick = () => nav('home');
  };
  show();
};

const renderManager = () => {
  app.innerHTML = shell(`<h2>문항 관리</h2><input aria-label='검색' id='q' placeholder='검색' /><button class='btn secondary' id='search'>검색</button>
  <div class='row'><input type='file' id='file' /><button class='btn' id='import'>가져오기</button><button class='btn secondary' id='export'>백업 내보내기</button><button class='btn secondary' id='reset'>진도 초기화</button></div><div id='list'></div><button class='btn secondary' id='home'>홈</button>`);
  const draw = (term='') => {
    const filtered = questions.filter((q) => [q.subject,q.topic,q.tags.join(' '),q.stem,q.createdBy].join(' ').includes(term));
    (document.getElementById('list') as HTMLDivElement).innerHTML = `<table><tr><th>ID</th><th>과목</th><th>토픽</th><th>출처</th></tr>${filtered.slice(0,200).map((q)=>`<tr><td>${q.id}</td><td>${q.subject}</td><td>${q.topic}</td><td>${q.createdBy}</td></tr>`).join('')}</table>`;
  }; draw();
  (document.getElementById('search') as HTMLButtonElement).onclick = () => draw((document.getElementById('q') as HTMLInputElement).value);
  (document.getElementById('import') as HTMLButtonElement).onclick = async () => {
    const f = (document.getElementById('file') as HTMLInputElement).files?.[0]; if (!f) return alert('파일을 선택하세요.');
    try {
      const imported = parseImport(f.name, await f.text());
      const merged = dedupe(imported, new Set(questions.map((q) => q.id)));
      await db.putCustomQuestions(merged); await load(); draw(); alert(`${merged.length}개 문항을 가져왔습니다.`);
    } catch (e) { alert((e as Error).message); }
  };
  (document.getElementById('export') as HTMLButtonElement).onclick = async () => {
    const payload = { exportedAt: new Date().toISOString(), settings: await db.getSettings(), progress: await db.getAllProgress(), customQuestions: await db.getCustomQuestions(), daily: await db.getAllDaily() };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' })); a.download = `meddaily-backup-${todayStr()}.json`; a.click();
  };
  (document.getElementById('reset') as HTMLButtonElement).onclick = async () => { if (confirm('진도를 초기화할까요?')) { await db.resetProgress(); await load(); alert('초기화 완료'); } };
  (document.getElementById('home') as HTMLButtonElement).onclick = () => nav('home');
};

const renderStats = async () => {
  const all = [...progressMap.values()];
  const solved = all.reduce((a,b)=>a+b.seenCount,0), correct = all.reduce((a,b)=>a+b.correctCount,0);
  const subjects = new Map<string,{s:number;c:number}>();
  questions.forEach((q) => {
    const p = progressMap.get(q.id); if (!p) return; const x = subjects.get(q.subject) || {s:0,c:0}; x.s += p.seenCount; x.c += p.correctCount; subjects.set(q.subject,x);
  });
  const trend = (await db.getAllDaily()).sort((a,b)=>a.date.localeCompare(b.date)).slice(-7);
  app.innerHTML = shell(`<h2>통계</h2><p>전체 정확도: <b>${solved?Math.round(correct/solved*100):0}%</b></p>
  <h3>과목별</h3><ul>${[...subjects].map(([k,v])=>`<li>${k}: ${v.s?Math.round(v.c/v.s*100):0}%</li>`).join('') || '<li>데이터 없음</li>'}</ul>
  <h3>최근 7일 추이</h3><ul>${trend.map((d)=>`<li>${d.date}: ${d.correct}/${d.solved}</li>`).join('') || '<li>데이터 없음</li>'}</ul><button class='btn secondary' id='home'>홈</button>`);
  (document.getElementById('home') as HTMLButtonElement).onclick = () => nav('home');
};

const renderSettings = () => {
  app.innerHTML = shell(`<h2>설정</h2><label>일일 문항 수 <input id='size' type='number' min='1' max='100' value='${settings.dailySize}' /></label>
  <label><input id='wrong' type='checkbox' ${settings.wrongFirst?'checked':''}/> 오답 우선</label><div><button class='btn' id='save'>저장</button><button class='btn secondary' id='home'>홈</button></div>`);
  (document.getElementById('save') as HTMLButtonElement).onclick = async () => {
    settings.dailySize = Number((document.getElementById('size') as HTMLInputElement).value) || 10;
    settings.wrongFirst = (document.getElementById('wrong') as HTMLInputElement).checked;
    await db.putSettings(settings); alert('저장됨');
  };
  (document.getElementById('home') as HTMLButtonElement).onclick = () => nav('home');
};

const render = async () => {
  const route = (location.hash.replace('#','') as Route) || 'home';
  if (route === 'daily') return renderQuiz('daily');
  if (route === 'review') return renderQuiz('review');
  if (route === 'manager') return renderManager();
  if (route === 'stats') return renderStats();
  if (route === 'settings') return renderSettings();
  return renderHome();
};

const boot = async () => {
  await load();
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('/sw.js');
  window.addEventListener('hashchange', render);
  window.addEventListener('online', render);
  window.addEventListener('offline', render);
  render();
};

boot();
