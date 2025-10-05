// app.js — v2.8.4 Mobile Layout Fit
(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const GRID = 12;

  // dynamic sizing: keep canvas square, fit inside frame between KPI and D-pad
  function fitCanvas(){
    const frame = canvas.parentElement; // .frame
    const stage = document.querySelector('.stage');
    const pad = document.querySelector('.touchpad');
    const legend = document.querySelector('.legendRail');

    const vw = Math.min(window.innerWidth, stage.clientWidth);
    // available vertical space inside .frame -> viewport height minus header, KPI, legend, pad and footer
    const headerH = document.querySelector('header').offsetHeight;
    const kpiH = document.querySelector('.mobileKPI').offsetHeight;
    const footerH = document.querySelector('footer').offsetHeight;
    const legendH = legend.offsetHeight || 0;
    const padH = pad.offsetHeight || 160;

    const margins = 24 + 12; // frame padding + stage paddings
    const availH = window.innerHeight - headerH - kpiH - legendH - padH - footerH - 24; // safe
    const size = Math.max(240, Math.min(vw - 24, availH - margins));

    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
  }
  window.addEventListener('resize', fitCanvas);
  window.addEventListener('orientationchange', fitCanvas);
  setTimeout(fitCanvas, 50);

  // ======== Core game (same rules 2.8) ========
  const W = 720, H = 720;
  canvas.width = W; canvas.height = H;
  const CELL = Math.floor(W / GRID);

  const $net = document.getElementById('netWorth');
  const $flow = document.getElementById('cashflow');
  const $moves = document.getElementById('moves');
  const $target = document.getElementById('target');
  const mNet2 = document.getElementById('mNet2');
  const mFlow2 = document.getElementById('mFlow2');
  const mMoves2 = document.getElementById('mMoves2');
  const mTarget2 = document.getElementById('mTarget2');

  const $reset = document.getElementById('resetBtn');
  const $undo = document.getElementById('undoBtn');
  const $mute = document.getElementById('muteBtn');
  const $modeSeg = document.getElementById('modeSeg');
  const $levelsBtn = document.getElementById('levelsBtn');

  function computeAutoMode(){ const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints>0; return (isTouch || window.innerWidth < 900) ? 'mobile' : 'desktop'; }
  let modePref = localStorage.getItem('cashflow.mode') || 'auto';
  function resolveMode(){ return modePref==='auto' ? computeAutoMode() : modePref; }
  function applyMode(mode){ document.body.classList.toggle('mode-mobile', mode==='mobile'); document.body.classList.toggle('mode-desktop', mode!=='mobile'); document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('active', b.dataset.mode===modePref)); fitCanvas(); }
  function refreshMode(){ applyMode(resolveMode()); }
  window.addEventListener('resize', ()=>{ if(modePref==='auto') refreshMode(); });
  document.getElementById('modeSeg').addEventListener('click', (e)=>{ const b=e.target.closest('button'); if(!b)return; modePref=b.dataset.mode; localStorage.setItem('cashflow.mode', modePref); refreshMode(); });

  // Audio fix for iOS: resume after first gesture
  let muted = localStorage.getItem('cashflow.muted') === '1';
  $mute.textContent = muted ? '🔇' : '🔊';
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const actx = AudioCtx ? new AudioCtx() : null;
  function ensureAudio(){ if(actx && actx.state==='suspended'){ actx.resume().catch(()=>{}); } }
  function beep(freq=440, dur=0.07, type='sine', vol=0.05){
    if(!actx || muted) return;
    try{
      const o = actx.createOscillator(); const g = actx.createGain();
      o.type=type; o.frequency.value=freq; g.gain.value=vol;
      o.connect(g); g.connect(actx.destination);
      o.start(); setTimeout(()=>{ try{o.stop()}catch{} }, dur*1000);
    }catch{}
  }
  ['touchstart','mousedown','keydown'].forEach(ev=>window.addEventListener(ev, ensureAudio, {passive:true}));
  $mute.addEventListener('click', ()=>{ muted=!muted; localStorage.setItem('cashflow.muted', muted?'1':'0'); $mute.textContent = muted ? '🔇' : '🔊'; });

  // Levels
  const levels = [
    {name:"Tutorial del Valore", target:5000, grid:[
      "############","#..$..D..G.#","#..##....#.#","#..A..P..#.#","#..##....#.#","#..$..L..#.#","#..##....#.#","#..A.....#.#","#..##..T.#.#","#..$.....#.#","#..##..I.#.#","############"]},
    {name:"Leva & Tasse", target:15000, grid:[
      "############","#P..A..#..G#","#.##.#.#.#.#","#.$..L..D..#","#.##.#.#.#.#","#..A..#..G.#","#.#.#.#.#..#","#..T..I..$.#","#.#.#.#.#..#","#..A..#..G.#","#..$..D..$.#","############"]},
    {name:"Scalata di Capitale", target:50000, grid:[
      "############","#P..$..L..G#","#.#.#.#.#..#","#..A..D..$.#","#.#.#.#.#..#","#..G..#..A.#","#..#..I..#.#","#.$..L..D..#","#.#.#.#.#..#","#..A..#..G.#","#..$..T..$.#","############"]},
    {name:"Rendita a Cascata", target:120000, grid:[
      "############","#G..A..$..P#","#.#.#.#.#..#","#..D..A..G.#","#.#.#.#.#..#","#..$..L..$.#","#..#..I..#.#","#..A..D..G.#","#.#.#.#.#..#","#.$..T..$..#","#..G..A..$.#","############"]},
    {name:"Debito Creativo", target:200000, grid:[
      "############","#P..L..A..G#","#.#.#.#.#..#","#..T..$..D.#","#.#.#.#.#..#","#..A..G..A.#","#..#..I..#.#","#.$..L..$..#","#.#.#.#.#..#","#..G..A..G.#","#..$..D..$.#","############"]},
    {name:"Inflazione Cattiva", target:250000, grid:[
      "############","#P..I..$..G#","#.#.#.#.#..#","#..A..I..D.#","#.#.#.#.#..#","#..G..I..A.#","#..#..I..#.#","#.$..I..$..#","#.#.#.#.#..#","#..A..I..G.#","#..$..I..$.#","############"]},
    {name:"Tycoon Finale", target:500000, grid:[
      "############","#P..A..L..G#","#.#.#.#.#..#","#..D..$..D.#","#.#.#.#.#..#","#..A..G..A.#","#..#..I..#.#","#.$..L..$..#","#.#.#.#.#..#","#..G..A..G.#","#..$..T..$.#","############"]},
  ];

  // State
  let levelIndex = parseInt(localStorage.getItem('cashflow.level')||'0'); if(levelIndex>=levels.length) levelIndex=0;
  let state=null, history=[], lastDividendMove=-999, leverageCountEarly=0;
  let lastDir = {dx:0, dy:0}, backtrackStreak = 0;

  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function tile(x,y){ return state.grid[y][x]; }
  function isWall(x,y){ return tile(x,y)==='#'; }
  function inBounds(x,y){ return x>=0 && y>=0 && x<12 && y<12; }
  function assetAt(x,y){ return state.assets.find(a=>a.x===x && a.y===y); }
  function goalAt(x,y){ return state.goals.some(g=>g.x===x && g.y===y); }

  function recalcAssets(){ for(const a of state.assets){ const was=a.active; a.active=goalAt(a.x,a.y); if(a.active && !was) a.fuel=5; } }

  function applyTileEffect(x,y){
    const t=tile(x,y);
    if(t==='$'){ state.net+=500; state.grid[y][x]='.'; beep(660); }
    if(t==='D'){ state.flow+=200; state.grid[y][x]='.'; beep(880);
      if(state.moves - lastDividendMove <= 4){ state.net+=1000; }
      lastDividendMove = state.moves;
    }
    if(t==='T'){ state.net=Math.max(0,state.net-800); state.grid[y][x]='.'; beep(220,0.08,'square'); }
    if(t==='L'){ state.flow+=600; state.net=Math.max(0,state.net-400); state.grid[y][x]='.'; beep(520,0.06,'sawtooth');
      if(state.moves<=10){ leverageCountEarly++; if(leverageCountEarly>=2){ state.flow+=1500; state.badgeBoostTurns=3; } }
    }
    if(t==='I'){ state.grid[y][x]='.'; state.flow=Math.max(0,state.flow-200); beep(300,0.05); }
  }

  function tickIncome(suppress=false){
    if(suppress) return;
    if(state.badgeBoostTurns && state.badgeBoostTurns>0){ state.net+=1500; state.badgeBoostTurns--; }
    state.net += state.flow;
    for(const a of state.assets){
      if(a.active && a.fuel && a.fuel>0){ state.net += 100; a.fuel--; if(a.fuel<=0){ a.active=false; } }
    }
    if(state.moves % 10 === 0){
      const actives = state.assets.filter(a=>a.active).length;
      if(actives === 0){ state.net = Math.max(0, state.net - 500); } else { state.net += actives * 200; }
    }
    if(state.moves % 7 === 0){ state.flow = Math.max(0, state.flow - 100); }
  }

  function save(){ localStorage.setItem('cashflow.state', JSON.stringify(state)); localStorage.setItem('cashflow.level', String(levelIndex)); }
  function restore(){ const raw=localStorage.getItem('cashflow.state'); if(!raw) return false; try{ state=JSON.parse(raw); return true; }catch{ return false; } }

  function loadLevel(idx){
    const L=levels[idx]; const grid=L.grid.map(r=>r.split(''));
    let player={x:0,y:0}; const assets=[], goals=[];
    for(let y=0;y<12;y++) for(let x=0;x<12;x++){ const t=grid[y][x];
      if(t==='P'){ player={x,y}; grid[y][x]='.'; }
      if(t==='A'){ assets.push({x,y,active:false,fuel:0}); grid[y][x]='.'; }
      if(t==='G'){ goals.push({x,y}); grid[y][x]='G'; }
    }
    state={name:L.name,target:L.target,grid,player,assets,goals,net:0,flow:0,moves:0,badgeBoostTurns:0};
    history=[]; lastDividendMove=-999; leverageCountEarly=0; lastDir={dx:0,dy:0}; backtrackStreak=0;
    sync(); render(); save(); fitCanvas();
  }

  function undo(){ if(history.length<=1) return; history.pop(); state=clone(history[history.length-1]); sync(); render(); }

  function move(dx,dy){
    ensureAudio();
    const nx=state.player.x+dx, ny=state.player.y+dy;
    if(!inBounds(nx,ny)||isWall(nx,ny)) return;
    const box=assetAt(nx,ny);
    if(box){
      const bx=nx+dx, by=ny+dy;
      if(!inBounds(bx,by)||isWall(bx,by)||assetAt(bx,by)) return;
      box.x=bx; box.y=by; recalcAssets();
    }
    const isBacktrack = (dx === -lastDir.dx && dy === -lastDir.dy);
    if(isBacktrack) backtrackStreak++; else backtrackStreak = 0;
    lastDir = {dx, dy};

    history.push(clone(state)); if(history.length>160) history.shift();
    state.player.x=nx; state.player.y=ny;
    applyTileEffect(nx,ny);
    state.moves++;
    tickIncome(backtrackStreak >= 1);
    sync(); render(); save();
    if(state.net >= state.target){
      const score = Math.round(state.net / Math.max(1,state.moves));
      alert(`Livello completato! ${state.name}\nMosse: ${state.moves}\nScore efficienza: ${score}`);
      levelIndex=(levelIndex+1)%levels.length; loadLevel(levelIndex);
    }
  }

  function fmt(n){ return n.toLocaleString('it-IT',{maximumFractionDigits:0}) + "€"; }
  function sync(){
    const $net=document.getElementById('netWorth'), $flow=document.getElementById('cashflow'), $moves=document.getElementById('moves'), $target=document.getElementById('target');
    if($net) $net.textContent=fmt(state.net);
    if($flow) $flow.textContent=fmt(state.flow)+"/mossa";
    if($moves) $moves.textContent=state.moves;
    if($target) $target.textContent=fmt(state.target);
    // mobile KPIs
    const mNet2=document.getElementById('mNet2'), mFlow2=document.getElementById('mFlow2'), mMoves2=document.getElementById('mMoves2'), mTarget2=document.getElementById('mTarget2');
    if(mNet2) mNet2.textContent=fmt(state.net);
    if(mFlow2) mFlow2.textContent=fmt(state.flow)+"/mossa";
    if(mMoves2) mMoves2.textContent=state.moves;
    if(mTarget2) mTarget2.textContent=fmt(state.target);
  }

  function drawCell(x,y,color){ const CELL=60; const scale = canvas.clientWidth/720; const cell=60*scale; const px=x*cell, py=y*cell; const c=canvas.getContext('2d'); c.fillStyle=color; c.fillRect(px,py,cell,cell); }
  function render(){
    // we render using fixed internal resolution; size is controlled by CSS
    const ctx = canvas.getContext('2d');
    const W=canvas.width, H=canvas.height, CELL=60;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#081028"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#1a2655";
    for(let i=0;i<=12;i++){ ctx.beginPath(); ctx.moveTo(i*CELL,0); ctx.lineTo(i*CELL,H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i*CELL); ctx.lineTo(W,i*CELL); ctx.stroke(); }
    for(let y=0;y<12;y++) for(let x=0;x<12;x++){ const t=state.grid[y][x];
      if(t==='#') ctx.fillStyle='#0c1533';
      else if(t==='G') ctx.fillStyle='#003b2a';
      else if(t==='$') ctx.fillStyle='#2d2300';
      else if(t==='D') ctx.fillStyle='#001d2a';
      else if(t==='T') ctx.fillStyle='#2a0000';
      else if(t==='L') ctx.fillStyle='#14002a';
      else if(t==='I') ctx.fillStyle='#2a1a00';
      else ctx.fillStyle='transparent';
      if(ctx.fillStyle!=='transparent') ctx.fillRect(x*CELL,y*CELL,CELL,CELL);
    }
    function dot(x,y,color){ const r=7; const cx=x*CELL + CELL/2, cy=y*CELL + CELL/2; ctx.beginPath(); ctx.fillStyle=color; ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); }
    for(let y=0;y<12;y++) for(let x=0;x<12;x++){ const t=state.grid[y][x];
      if(t==='$') dot(x,y,'#ffd700'); if(t==='D') dot(x,y,'#3dc2ff'); if(t==='T') dot(x,y,'#ff4d4d'); if(t==='L') dot(x,y,'#8a56ff'); if(t==='I') dot(x,y,'#ffaa00');
    }
    function box(x,y,color){ const pad=10; ctx.fillStyle=color; ctx.fillRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); ctx.strokeStyle='#0a1228'; ctx.lineWidth=2; ctx.strokeRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); }
    for(const a of state.assets){ box(a.x,a.y, a.active ? '#2dd36f' : '#748ffc'); }
    function rect(x,y,color){ const pad=14; ctx.fillStyle=color; ctx.fillRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); }
    rect(state.player.x, state.player.y, '#e9f1ff');
  }

  // Inputs
  document.querySelectorAll('.touchpad button').forEach(b=>b.addEventListener('click', ()=>{ if(resolveMode()==='mobile') move(parseInt(b.dataset.dx), parseInt(b.dataset.dy)); }));
  let ts=null;
  canvas.addEventListener('touchstart', e=>{ ts=e.changedTouches[0]; }, {passive:true});
  canvas.addEventListener('touchend', e=>{
    if(!ts) return; const t=e.changedTouches[0]; const dx=t.clientX-ts.clientX, dy=t.clientY-ts.clientY;
    if(Math.max(Math.abs(dx),Math.abs(dy))<24) return;
    if(Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1,0); else move(0,dy>0?1:-1);
    ts=null;
  }, {passive:true});
  window.addEventListener('keydown', e=>{ if(resolveMode()!=='desktop') return; const k=e.key; if(k==='ArrowLeft') move(-1,0); if(k==='ArrowRight') move(1,0); if(k==='ArrowUp') move(0,-1); if(k==='ArrowDown') move(0,1); if(k==='z'&&(e.ctrlKey||e.metaKey)) undo(); if(k==='r') loadLevel(levelIndex); });

  // Level Reset & Picker
  document.getElementById('resetBtn').addEventListener('click', ()=>loadLevel(levelIndex));
  document.getElementById('undoBtn').addEventListener('click', ()=>undo());
  document.getElementById('levelsBtn').addEventListener('click', ()=>{
    const list = levels.map((L,i)=>`${i+1}. ${L.name}`).join('\\n');
    const choice = prompt(`Vai a livello (1-${levels.length})\\n${list}`, String(levelIndex+1));
    const idx = Math.max(1, Math.min(levels.length, parseInt(choice||'1'))) - 1;
    levelIndex = idx; loadLevel(levelIndex);
  });

  // Start
  refreshMode();
  if(!restore()){ loadLevel(levelIndex); } else { sync(); render(); fitCanvas(); }
})();