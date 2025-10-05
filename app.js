// app.js — v2.8.10 Anti‑grind definitivo + PLAY fix + mobile layout
(()=>{
  const gridSize = 12, baseRes = 720;
  function getCanvas(){ return document.body.classList.contains('mode-mobile') ? document.getElementById('gameMob') : document.getElementById('game'); }
  let canvas = getCanvas(); let ctx = canvas.getContext('2d'); canvas.width=baseRes; canvas.height=baseRes;

  function computeAutoMode(){ const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints>0; return (isTouch || window.innerWidth < 900) ? 'mobile' : 'desktop'; }
  let modePref = localStorage.getItem('cashflow.mode') || 'auto';
  function resolveMode(){ return modePref==='auto' ? computeAutoMode() : modePref; }
  function applyMode(){
    const mode = resolveMode();
    document.body.classList.toggle('mode-mobile', mode==='mobile');
    document.body.classList.toggle('mode-desktop', mode!=='mobile');
    document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('active', b.dataset.mode===modePref));
    canvas = getCanvas(); ctx = canvas.getContext('2d'); canvas.width=baseRes; canvas.height=baseRes; fitCanvas(); render(); updatePlayOverlay();
  }
  function fitCanvas(){
    if(document.body.classList.contains('mode-mobile')){
      const w = Math.min(window.innerWidth*0.94, 720);
      canvas.style.width = w+'px'; canvas.style.height = 'auto';
    }else{
      const stage = document.querySelector('.stageDesk');
      const maxW = stage.clientWidth - 24;
      const maxH = Math.min(window.innerHeight - 300, stage.clientHeight - 24);
      const size = Math.max(520, Math.min(maxW, maxH, 720));
      canvas.style.width = size+'px'; canvas.style.height = size+'px';
    }
  }
  window.addEventListener('resize', ()=>{ if(modePref==='auto') applyMode(); else fitCanvas(); });
  window.addEventListener('orientationchange', fitCanvas);
  document.getElementById('modeSeg').addEventListener('click', (e)=>{ const b=e.target.closest('button'); if(!b) return; modePref=b.dataset.mode; localStorage.setItem('cashflow.mode', modePref); applyMode(); });

  const el = {
    net: document.getElementById('netWorth'), flow: document.getElementById('cashflow'),
    moves: document.getElementById('moves'), target: document.getElementById('target'),
    mNet2: document.getElementById('mNet2'), mFlow2: document.getElementById('mFlow2'),
    mMoves2: document.getElementById('mMoves2'), mTarget2: document.getElementById('mTarget2'),
  };
  function fmt(n){ return n.toLocaleString('it-IT',{maximumFractionDigits:0}) + "€"; }
  function syncHUD(){ if(el.net) el.net.textContent=fmt(state.net); if(el.flow) el.flow.textContent=fmt(state.flow)+"/mossa"; if(el.moves) el.moves.textContent=state.moves; if(el.target) el.target.textContent=fmt(state.target); if(el.mNet2) el.mNet2.textContent=fmt(state.net); if(el.mFlow2) el.mFlow2.textContent=fmt(state.flow)+"/mossa"; if(el.mMoves2) el.mMoves2.textContent=state.moves; if(el.mTarget2) el.mTarget2.textContent=fmt(state.target); }

  // Audio + Haptics
  let muted = localStorage.getItem('cashflow.muted') === '1';
  const $mute = document.getElementById('muteBtn'); $mute.textContent = muted ? '🔇' : '🔊';
  const AudioCtx = window.AudioContext || window.webkitAudioContext; const actx = AudioCtx ? new AudioCtx() : null;
  function ensureAudio(){ if(actx && actx.state==='suspended'){ actx.resume().catch(()=>{}); } }
  ['touchstart','mousedown','keydown'].forEach(ev=>window.addEventListener(ev, ensureAudio, {passive:true}));
  function tone(freq=440, dur=0.06, type='sine', vol=0.05){ if(!actx || muted) return; try{ const o=actx.createOscillator(), g=actx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=v; o.connect(g); g.connect(actx.destination); o.start(); setTimeout(()=>{ try{o.stop()}catch{} }, dur*1000);}catch{} }
  function haptic(ms=10){ if(navigator.vibrate){ navigator.vibrate(ms); } }
  $mute.addEventListener('click', ()=>{ muted=!muted; localStorage.setItem('cashflow.muted', muted?'1':'0'); $mute.textContent = muted ? '🔇' : '🔊'; });

  // Levels (stabili)
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
  let lastDir = {dx:0, dy:0};
  let started = false;

  // New: last positions to prevent A↔B oscillation farming
  const lastPos = []; // array of {x,y}, keep last 2

  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function tile(x,y){ return state.grid[y][x]; }
  function isWall(x,y){ return tile(x,y)==='#'; }
  function inBounds(x,y){ return x>=0 && y>=0 && x<gridSize && y<gridSize; }
  function assetAt(x,y){ return state.assets.find(a=>a.x===x && a.y===y); }
  function goalAt(x,y){ return state.goals.some(g=>g.x===x && g.y===y); }
  function recalcAssets(){ for(const a of state.assets){ const was=a.active; a.active=goalAt(a.x,a.y); if(a.active && !was) a.fuel=5; } }

  function applyTileEffect(x,y){
    let economicEvent = false;
    const t=tile(x,y);
    if(t==='$'){ state.net+=500; state.grid[y][x]='.'; tone(660); haptic(12); economicEvent=true; }
    if(t==='D'){ state.flow+=200; state.grid[y][x]='.'; tone(880); haptic([10,30,10]); economicEvent=true;
      if(state.moves - lastDividendMove <= 4){ state.net+=1000; tone(1040,0.08,'triangle',0.06); haptic([15,25,15]); }
      lastDividendMove = state.moves;
    }
    if(t==='T'){ state.net=Math.max(0,state.net-800); state.grid[y][x]='.'; tone(220,0.08,'square',0.05); haptic(40); economicEvent=true; }
    if(t==='L'){ state.flow+=600; state.net=Math.max(0,state.net-400); state.grid[y][x]='.'; tone(520,0.06,'sawtooth',0.05); haptic([20,20,20]); economicEvent=true;
      if(state.moves<=10){ leverageCountEarly++; if(leverageCountEarly>=2){ state.flow+=1500; state.badgeBoostTurns=3; tone(1200,0.08,'sine',0.06); haptic([15,15,30]); } }
    }
    if(t==='I'){ state.grid[y][x]='.'; state.flow=Math.max(0,state.flow-200); tone(300,0.05); haptic(20); economicEvent=true; }
    return economicEvent;
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

  function baseLoad(idx){
    const L=levels[idx]; const grid=L.grid.map(r=>r.split(''));
    let player={x:0,y:0}; const assets=[], goals=[];
    for(let y=0;y<gridSize;y++) for(let x=0;x<gridSize;x++){ const t=grid[y][x];
      if(t==='P'){ player={x,y}; grid[y][x]='.'; }
      if(t==='A'){ assets.push({x,y,active:false,fuel:0}); grid[y][x]='.'; }
      if(t==='G'){ goals.push({x,y}); grid[y][x]='G'; }
    }
    state={name:L.name,target:L.target,grid,player,assets,goals,net:0,flow:0,moves:0,badgeBoostTurns:0};
    history=[]; lastDividendMove=-999; leverageCountEarly=0; lastDir={dx:0,dy:0};
    lastPos.length=0; lastPos.push({x:player.x, y:player.y});
    syncHUD(); render(); save(); fitCanvas();
  }
  function loadLevel(idx){ baseLoad(idx); started=false; updatePlayOverlay(); }

  function updatePlayOverlay(){
    const desk = document.getElementById('playOverlayDesk'); const mob = document.getElementById('playOverlayMob');
    const onMob = document.body.classList.contains('mode-mobile');
    desk && (desk.style.display = (!started && !onMob) ? 'flex' : 'none');
    mob && (mob.style.display = (!started && onMob) ? 'flex' : 'none');
  }
  function startGame(){ if(!state){ baseLoad(levelIndex); } started=true; ensureAudio(); updatePlayOverlay(); }

  function undo(){ if(!started) return; if(history.length<=1) return; history.pop(); state=clone(history[history.length-1]); syncHUD(); render(); }

  function move(dx,dy){
    if(!started) return;
    const nx=state.player.x+dx, ny=state.player.y+dy;
    if(!inBounds(nx,ny)||isWall(nx,ny)) return;

    let assetPushed = false;
    const box=assetAt(nx,ny);
    if(box){
      const bx=nx+dx, by=ny+dy;
      if(!inBounds(bx,by)||isWall(bx,by)||assetAt(bx,by)) return;
      box.x=bx; box.y=by; recalcAssets(); tone(420,0.05,'triangle'); haptic(10); assetPushed = true;
    }

    const isBacktrack = (dx === -lastDir.dx && dy === -lastDir.dy);

    history.push(clone(state)); if(history.length>160) history.shift();
    state.player.x=nx; state.player.y=ny;
    const hadEvent = applyTileEffect(nx,ny);
    state.moves++;

    // New anti‑grind rule:
    // Suppress income if NO economic event and either:
    //  (a) backtrack edge A↔B, or
    //  (b) position revisited in the last 2 moves (A→B→A loop)
    const prev = lastPos[lastPos.length-1];
    const prev2 = lastPos.length>1 ? lastPos[lastPos.length-2] : null;
    const revisitedShortLoop = prev2 && (prev2.x===state.player.x && prev2.y===state.player.y);
    const suppress = !hadEvent and not assetPushed and (isBacktrack or revisitedShortLoop);
    // update last positions
    lastPos.push({x:state.player.x, y:state.player.y}); if(lastPos.length>3) lastPos.shift();

    lastDir = {dx, dy};

    tickIncome(suppress);
    syncHUD(); render(); save();

    if(state.net >= state.target){
      tone(660,0.08); setTimeout(()=>tone(880,0.08),120); setTimeout(()=>tone(1040,0.1),240);
      haptic(35);
      const score = Math.round(state.net / Math.max(1,state.moves));
      alert(`Livello completato! ${state.name}\nMosse: ${state.moves}\nScore efficienza: ${score}`);
      levelIndex=(levelIndex+1)%levels.length; loadLevel(levelIndex);
    }
  }

  function render(){
    const W=canvas.width, H=canvas.height, CELL=Math.floor(W/gridSize);
    const c=ctx;
    c.clearRect(0,0,W,H);
    c.fillStyle="#081028"; c.fillRect(0,0,W,H);
    c.strokeStyle="#1a2655";
    for(let i=0;i<=gridSize;i++){ c.beginPath(); c.moveTo(i*CELL,0); c.lineTo(i*CELL,H); c.stroke(); c.beginPath(); c.moveTo(0,i*CELL); c.lineTo(W,i*CELL); c.stroke(); }
    for(let y=0;y<gridSize;y++) for(let x=0;x<gridSize;x++){ const t=state.grid[y][x];
      if(t==='#') c.fillStyle='#0c1533';
      else if(t==='G') c.fillStyle='#003b2a';
      else if(t==='$') c.fillStyle='#2d2300';
      else if(t==='D') c.fillStyle='#001d2a';
      else if(t==='T') c.fillStyle='#2a0000';
      else if(t==='L') c.fillStyle='#14002a';
      else if(t==='I') c.fillStyle='#2a1a00';
      else c.fillStyle='transparent';
      if(c.fillStyle!=='transparent') c.fillRect(x*CELL,y*CELL,CELL,CELL);
    }
    function dot(x,y,color){ const r=Math.floor(CELL*0.12); const cx=x*CELL + CELL/2, cy=y*CELL + CELL/2; c.beginPath(); c.fillStyle=color; c.arc(cx,cy,r,0,Math.PI*2); c.fill(); }
    for(let y=0;y<gridSize;y++) for(let x=0;x<gridSize;x++){ const t=state.grid[y][x];
      if(t==='$') dot(x,y,'#ffd700'); if(t==='D') dot(x,y,'#3dc2ff'); if(t==='T') dot(x,y,'#ff4d4d'); if(t==='L') dot(x,y,'#8a56ff'); if(t==='I') dot(x,y,'#ffaa00');
    }
    const pad=10, padP=14;
    function box(x,y,color){ c.fillStyle=color; c.fillRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); c.strokeStyle='#0a1228'; c.lineWidth=2; c.strokeRect(x*CELL+pad,y*CELL+pad,CELL-2*pad,CELL-2*pad); }
    for(const a of state.assets){ box(a.x,a.y, a.active ? '#2dd36f' : '#748ffc'); }
    c.fillStyle='#e9f1ff'; c.fillRect(state.player.x*CELL+padP, state.player.y*CELL+padP, CELL-2*padP, CELL-2*padP);
  }

  // Inputs
  function isMobile(){ return document.body.classList.contains('mode-mobile'); }
  document.querySelectorAll('.touchpad button').forEach(b=>b.addEventListener('click', ()=>{ if(isMobile()) move(parseInt(b.dataset.dx), parseInt(b.dataset.dy)); }));
  let ts=null;
  ['game','gameMob'].forEach(id=>{
    const c=document.getElementById(id);
    c.addEventListener('touchstart', e=>{ ts=e.changedTouches[0]; }, {passive:true});
    c.addEventListener('touchend', e=>{ if(!ts) return; const t=e.changedTouches[0]; const dx=t.clientX-ts.clientX, dy=t.clientY-ts.clientY;
      if(Math.max(Math.abs(dx),Math.abs(dy))<24) return;
      if(Math.abs(dx)>Math.abs(dy)) move(dx>0?1:-1,0); else move(0,dy>0?1:-1);
      ts=null; }, {passive:true});
  });
  window.addEventListener('keydown', e=>{ if(isMobile() || !started) return; const k=e.key; if(k==='ArrowLeft') move(-1,0); if(k==='ArrowRight') move(1,0); if(k==='ArrowUp') move(0,-1); if(k==='ArrowDown') move(0,1); if(k==='z'&&(e.ctrlKey||e.metaKey)) undo(); if(k==='r') loadLevel(levelIndex); });

  // Toolbar
  document.getElementById('resetBtn').addEventListener('click', ()=>{ loadLevel(levelIndex); });
  document.getElementById('undoBtn').addEventListener('click', ()=>undo());
  document.getElementById('levelsBtn').addEventListener('click', ()=>{
    const list = levels.map((L,i)=>`${i+1}. ${L.name}`).join('\\n');
    const choice = prompt(`Vai a livello (1-${levels.length})\\n${list}`, String(levelIndex+1));
    const idx = Math.max(1, Math.min(levels.length, parseInt(choice||'1'))) - 1;
    levelIndex = idx; loadLevel(levelIndex);
  });

  // PLAY
  document.getElementById('playBtnDesk').addEventListener('click', ()=>{ started=true; ensureAudio(); updatePlayOverlay(); });
  document.getElementById('playBtnMob').addEventListener('click', ()=>{ started=true; ensureAudio(); updatePlayOverlay(); });

  // Boot
  applyMode();
  if(!restore()){ baseLoad(levelIndex); } else { render(); fitCanvas(); }
  started=false; updatePlayOverlay(); syncHUD(); render();
})();