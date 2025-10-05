// app.js — Cashflow Rush v2.8.2 Strategy Dual Mode (Mobile Readability)
(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const GRID = 12, CELL = Math.floor(W / GRID);

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

  // Mode handling
  function computeAutoMode(){ const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints>0; return (isTouch || window.innerWidth < 900) ? 'mobile' : 'desktop'; }
  function applyMode(mode){
    document.body.classList.remove('mode-mobile','mode-desktop');
    document.body.classList.add(mode==='mobile'?'mode-mobile':'mode-desktop');
    $modeSeg.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    const btn = $modeSeg.querySelector(`[data-mode="${modePref}"]`) || $modeSeg.querySelector('[data-mode="auto"]');
    if(btn) btn.classList.add('active');
  }
  let modePref = localStorage.getItem('cashflow.mode') || 'auto';
  function resolveMode(){ return modePref==='auto' ? computeAutoMode() : modePref; }
  function refreshMode(){ applyMode(resolveMode()); }
  window.addEventListener('resize', ()=>{ if(modePref==='auto') refreshMode(); });
  $modeSeg.addEventListener('click', (e)=>{
    const b = e.target.closest('button'); if(!b) return;
    modePref = b.dataset.mode; localStorage.setItem('cashflow.mode', modePref);
    $modeSeg.querySelectorAll('button').forEach(x=>x.classList.toggle('active', x===b));
    refreshMode();
  });

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

  let levelIndex = parseInt(localStorage.getItem('cashflow.level')||'0'); if(levelIndex>=levels.length) levelIndex=0;
  let state=null, history=[], lastDividendMove=-999, leverageCountEarly=0;
  let lastDir = {dx:0, dy:0}, backtrackStreak = 0;

  // Economy (anti-grind + assets fuel + rata)
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function tile(x,y){ return state.grid[y][x]; }
  function isWall(x,y){ return tile(x,y)==='#'; }
  function inBounds(x,y){ return x>=0 && y>=0 && x<GRID && y<GRID; }
  function assetAt(x,y){ return state.assets.find(a=>a.x===x && a.y===y); }
  function goalAt(x,y){ return state.goals.some(g=>g.x===x && g.y===y); }
  function recalcAssets(){ for(const a of state.assets){ const was = a.active; a.active=goalAt(a.x,a.y); if(a.active && !was) a.fuel = 5; } }

  function applyTileEffect(x,y){
    const t=tile(x,y);
    if(t==='$'){ state.net+=500; state.grid[y][x]='.'; }
    if(t==='D'){ state.flow+=200; state.grid[y][x]='.'; if(state.moves - lastDividendMove <= 4){ state.net+=1000; } lastDividendMove = state.moves; }
    if(t==='T'){ state.net=Math.max(0,state.net-800); state.grid[y][x]='.'; }
    if(t==='L'){ state.flow+=600; state.net=Math.max(0,state.net-400); state.grid[y][x]='.'; if(state.moves<=10){ leverageCountEarly++; if(leverageCountEarly>=2){ state.flow+=1500; state.badgeBoostTurns=3; } } }
    if(t==='I'){ state.grid[y][x]='.'; state.flow=Math.max(0,state.flow-200); }
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

  function saveProgress(){ localStorage.setItem('cashflow.state', JSON.stringify(state)); localStorage.setItem('cashflow.level', String(levelIndex)); }
  function tryLoadProgress(){ const raw=localStorage.getItem('cashflow.state'); if(!raw) return false; try{ state=JSON.parse(raw); return true; }catch{ return false; } }

  function loadLevel(idx){
    const L=levels[idx]; const grid=L.grid.map(r=>r.split(''));
    let player={x:0,y:0}; const assets=[], goals=[];
    for(let y=0;y<GRID;y++) for(let x=0;x<GRID;x++){ const t=grid[y][x];
      if(t==='P'){ player={x,y}; grid[y][x]='.'; }
      if(t==='A'){ assets.push({x,y,active:false,fuel:0}); grid[y][x]='.'; }
      if(t==='G'){ goals.push({x,y}); grid[y][x]='G'; }
    }
    state={name:L.name,target:L.target,grid,player,assets,goals,net:0,flow:0,moves:0,badgeBoostTurns:0};
    history=[]; lastDividendMove=-999; leverageCountEarly=0; lastDir={dx:0,dy:0}; backtrackStreak=0;
    syncHUD(); render(); saveProgress();
  }

  function undo(){ if(history.length<=1) return; history.pop(); state=clone(history[history.length-1]); syncHUD(); render(); }

  function move(dx,dy){
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
    syncHUD(); render(); saveProgress();
    checkWin();
  }

  function checkWin(){
    if(state.net >= state.target){
      const score = Math.round(state.net / Math.max(1,state.moves));
      alert(`Livello completato! ${state.name}\nMosse: ${state.moves}\nScore efficienza: ${score}`);
      levelIndex=(levelIndex+1)%levels.length; localStorage.setItem('cashflow.level', String(levelIndex)); loadLevel(levelIndex);
    }
  }

  function fmt(n){ return n.toLocaleString('it-IT',{maximumFractionDigits:0}) + "€"; }
  function syncHUD(){
    // Desktop panel
    if($net) $net.textContent=fmt(state.net);
    if($flow) $flow.textContent=fmt(state.flow)+"/mossa";
    if($moves) $moves.textContent=state.moves;
    if($target) $target.textContent=fmt(state.target);
    // Mobile KPI cards
    if(mNet2) mNet2.textContent=fmt(state.net);
    if(mFlow2) mFlow2.textContent=fmt(state.flow)+"/mossa";
    if(mMoves2) mMoves2.textContent=state.moves;
    if(mTarget2) mTarget2.textContent=fmt(state.target);
  }

  function drawCell(x,y,color){ const px=x*CELL, py=y*CELL; ctx.fillStyle=color; ctx.fillRect(px,py,CELL,CELL); }
  function rect(x,y,color){ const pad=Math.floor(CELL*0.18); ctx.fillStyle=color; ctx.fillRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); }
  function box(x,y,color){ const pad=Math.floor(CELL*0.12); ctx.fillStyle=color; ctx.fillRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); ctx.strokeStyle='#0a1228'; ctx.lineWidth=2; ctx.strokeRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); }
  function dot(x,y,color){ const r=Math.floor(CELL*0.12); const cx=x*CELL + CELL/2, cy=y*CELL + CELL/2; ctx.beginPath(); ctx.fillStyle=color; ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); }

  function render(){
    ctx.fillStyle="#081028"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#1a2655";
    for(let i=0;i<=GRID;i++){ ctx.beginPath(); ctx.moveTo(i*CELL,0); ctx.lineTo(i*CELL,H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i*CELL); ctx.lineTo(W,i*CELL); ctx.stroke(); }
    for(let y=0;y<GRID;y++) for(let x=0;x<GRID;x++){ const t=state.grid[y][x];
      if(t==='#') drawCell(x,y,'#0c1533');
      if(t==='G') drawCell(x,y,'#003b2a');
      if(t==='$') drawCell(x,y,'#2d2300');
      if(t==='D') drawCell(x,y,'#001d2a');
      if(t==='T') drawCell(x,y,'#2a0000');
      if(t==='L') drawCell(x,y,'#14002a');
      if(t==='I') drawCell(x,y,'#2a1a00');
    }
    for(let y=0;y<GRID;y++) for(let x=0;x<GRID;x++){ const t=state.grid[y][x];
      if(t==='$') dot(x,y,'#ffd700'); if(t==='D') dot(x,y,'#3dc2ff'); if(t==='T') dot(x,y,'#ff4d4d'); if(t==='L') dot(x,y,'#8a56ff'); if(t==='I') dot(x,y,'#ffaa00');
    }
    for(const a of state.assets){ box(a.x,a.y, a.active ? '#2dd36f' : '#748ffc'); }
    rect(state.player.x, state.player.y, '#e9f1ff');
  }

  // Input
  let touchStart=null;
  canvas.addEventListener('touchstart', e=>{ const t=e.changedTouches[0]; touchStart={x:t.clientX,y:t.clientY}; }, {passive:true});
  canvas.addEventListener('touchend', e=>{
    const t=e.changedTouches[0]; if(!touchStart) return;
    const dx=t.clientX-touchStart.x, dy=t.clientY-touchStart.y;
    if(Math.max(Math.abs(dx),Math.abs(dy))<24){ touchStart=null; return; }
    if(Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1,0); else move(0,dy>0?1:-1);
    touchStart=null;
  }, {passive:true});
  canvas.addEventListener('click', e=>{
    if(resolveMode()!=='mobile') return;
    const rectC = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rectC.left) / (rectC.width) * GRID);
    const y = Math.floor((e.clientY - rectC.top) / (rectC.height) * GRID);
    const px = state.player.x, py = state.player.y;
    const dx = x - px, dy = y - py;
    if(Math.abs(dx)+Math.abs(dy) !== 1) return;
    move(Math.sign(dx), Math.sign(dy));
  });
  window.addEventListener('keydown', e=>{
    if(resolveMode()!=='desktop') return;
    const k=e.key; if(k==='ArrowLeft') move(-1,0); if(k==='ArrowRight') move(1,0); if(k==='ArrowUp') move(0,-1); if(k==='ArrowDown') move(0,1); if(k==='z'&&(e.ctrlKey||e.metaKey)) undo(); if(k==='r') loadLevel(levelIndex);
  });
  document.querySelectorAll('.touchpad button').forEach(b=>{
    b.addEventListener('click', ()=>{ if(resolveMode()==='mobile') move(parseInt(b.dataset.dx), parseInt(b.dataset.dy)); });
  });

  // Level picker (simple prompt for now)
  $levelsBtn.addEventListener('click', ()=>{
    const list = levels.map((L,i)=>`${i+1}. ${L.name}`).join('\\n');
    const choice = prompt(`Vai a livello (1-${levels.length}):\\n${list}`, String(levelIndex+1));
    const idx = Math.max(1, Math.min(levels.length, parseInt(choice||'1'))) - 1;
    levelIndex = idx; loadLevel(levelIndex);
  });

  // Sound
  let muted = localStorage.getItem('cashflow.muted') === '1';
  $mute.textContent = muted ? '🔇' : '🔊';
  $mute.addEventListener('click', ()=>{ muted = !muted; localStorage.setItem('cashflow.muted', muted ? '1':'0'); $mute.textContent = muted ? '🔇' : '🔊'; });

  function computeAutoMode(){ const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints>0; return (isTouch || window.innerWidth < 900) ? 'mobile' : 'desktop'; }
  function resolveMode(){ return modePref==='auto' ? computeAutoMode() : modePref; }

  // Start
  refreshMode();
  if(!tryLoadProgress()){ loadLevel(levelIndex); } else { syncHUD(); render(); }
})();