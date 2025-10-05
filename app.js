// Cashflow Rush — Dual Universe v3.1.0 (Classic + Career) with anti-grind
(()=>{
  const SIZE = 12, BASE = 720;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  canvas.width = BASE; canvas.height = BASE;

  const flash = document.getElementById('flash');
  function doFlash(color){ flash.className = 'flash ' + color + ' show'; setTimeout(()=> flash.classList.remove('show'), 220); }

  let modePref = localStorage.getItem('du.mode') || 'auto';
  document.getElementById('modeSeg').addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return;
    modePref = b.dataset.mode; localStorage.setItem('du.mode', modePref);
    document.querySelectorAll('#modeSeg button').forEach(x=>x.classList.toggle('active', x.dataset.mode===modePref));
  });

  let gameMode = localStorage.getItem('du.gameMode');
  if(!gameMode){ gameMode = 'career'; }
  document.querySelectorAll('#gameModeSeg button').forEach(b=>b.classList.toggle('active', b.dataset.gamemode===gameMode));
  document.getElementById('gameModeSeg').addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return;
    const newMode = b.dataset.gamemode;
    if(newMode===gameMode) return;
    gameMode = newMode; localStorage.setItem('du.gameMode', gameMode);
    document.querySelectorAll('#gameModeSeg button').forEach(x=>x.classList.toggle('active', x.dataset.gamemode===gameMode));
    doFlash(gameMode==='classic' ? 'green' : 'red');
    tone(gameMode==='classic' ? 760 : 540, 0.05);
    loadLevel(L);
  });

  // Audio
  let muted = localStorage.getItem('du.muted')==='1';
  const $mute = document.getElementById('muteBtn'); $mute.textContent = muted ? '🔇' : '🔊';
  const AC = window.AudioContext || window.webkitAudioContext; const actx = AC ? new AC() : null;
  function ensureAudio(){ if(actx && actx.state==='suspended'){ actx.resume().catch(()=>{}); } }
  ['touchstart','mousedown','keydown'].forEach(ev=>window.addEventListener(ev, ensureAudio, {passive:true}));
  function tone(f=440,d=0.06,t='sine',v=0.05){ if(!actx || muted) return; const o=actx.createOscillator(), g=actx.createGain(); o.type=t; o.frequency.value=f; g.gain.value=v; o.connect(g); g.connect(actx.destination); o.start(); setTimeout(()=>{try{o.stop()}catch{}}, d*1000); }
  function haptic(ms=12){ if(navigator.vibrate){ navigator.vibrate(ms); } }
  $mute.addEventListener('click', ()=>{ muted=!muted; localStorage.setItem('du.muted', muted?'1':'0'); $mute.textContent = muted ? '🔇' : '🔊'; });

  const classicLevels = [
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

  const careerLevels = [
    {name:"Risparmio",         target:  5000,  seed:1},
    {name:"Investimento",     target: 15000,  seed:2},
    {name:"Leva Finanziaria", target: 30000,  seed:3},
    {name:"Inflazione",       target: 50000,  seed:4},
    {name:"Speculazione",     target: 80000,  seed:5},
    {name:"Diversificazione", target:120000,  seed:6},
    {name:"Crisi",            target:150000,  seed:7},
    {name:"Ripresa",          target:220000,  seed:8},
    {name:"Bolla",            target:350000,  seed:9},
    {name:"Tycoon Finale",    target:1000000, seed:10},
  ];

  let L = parseInt(localStorage.getItem('du.level')||'0');
  if(gameMode==='classic' && L>=classicLevels.length) L=0;
  if(gameMode==='career'  && L>=careerLevels.length) L=0;

  let state = null, history = [];
  let started = false;
  let lastDir = {dx:0,dy:0};
  const lastPos = [];

  function rng(seed){ let s = seed||1; return ()=> (s = (s*1664525+1013904223)%4294967296)/4294967296; }
  function genGridCareer(seed){
    const rnd = rng(seed), g = Array.from({length:SIZE}, _=>Array(SIZE).fill('.'));
    for(let i=0;i<SIZE;i++){ g[0][i]='#'; g[SIZE-1][i]='#'; g[i][0]='#'; g[i][SIZE-1]='#'; }
    for(let i=0;i<3;i++){ g[2+i*3][SIZE-2] = 'G'; }
    const features = ['$', 'D', 'T', 'L', 'I'];
    for(let k=0;k<28;k++){
      const x=1+Math.floor(rnd()*(SIZE-2)), y=1+Math.floor(rnd()*(SIZE-2));
      if(g[y][x]!=='.') continue;
      g[y][x] = features[Math.floor(rnd()*features.length)];
    }
    for(let k=0;k<4;k++){
      const x=1+Math.floor(rnd()*(SIZE-2)), y=1+Math.floor(rnd()*(SIZE-2));
      if(g[y][x]!=='.') continue; g[y][x] = 'A';
    }
    g[1][1] = 'P';
    return g;
  }

  const el = { net:kNet, flow:kFlow, moves:kMoves, target:kTarget, eff:kEff, rep:kRep };
  function euro(n){ return n.toLocaleString('it-IT')+"€"; }
  function updateHUD(){
    el.net.textContent = euro(state.net);
    el.flow.textContent = euro(state.flow)+"/mossa";
    el.moves.textContent = state.moves;
    el.target.textContent = euro(state.target);
    const eff = state.moves? Math.max(0, Math.round((state.net/state.moves)/10)) : 0;
    state.eff = eff; el.eff.textContent = eff+"%";
    el.rep.textContent = state.rep||0;
  }

  function loadLevel(index){
    const meta = (gameMode==='classic' ? classicLevels[index] : careerLevels[index]);
    let grid, player={x:1,y:1}, assets=[], goals=[];
    if(gameMode==='classic'){
      grid = meta.grid.map(r=>r.split(''));
      for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
        const t = grid[y][x];
        if(t==='P'){ player={x,y}; grid[y][x]='.'; }
        if(t==='A'){ assets.push({x,y,active:false,fuel:0}); grid[y][x]='.'; }
        if(t==='G'){ goals.push({x,y}); }
      }
    }else{
      grid = genGridCareer(meta.seed);
      for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
        const t = grid[y][x];
        if(t==='P'){ player={x,y}; grid[y][x]='.'; }
        if(t==='A'){ assets.push({x,y,active:false,fuel:0}); grid[y][x]='.'; }
        if(t==='G'){ goals.push({x,y}); }
      }
    }
    state = { name:meta.name, target:meta.target, grid, player, assets, goals, net:0, flow:0, moves:0, rep:parseInt(localStorage.getItem('du.rep')||'0'), eff:0 };
    history.length=0; lastDir={dx:0,dy:0}; lastPos.length=0; lastPos.push({x:player.x,y:player.y});
    updateHUD(); render(); started=false; toggleOverlay(true);
    localStorage.setItem('du.level', String(index));
  }

  function inB(x,y){ return x>=0 && y>=0 && x<SIZE && y<SIZE; }
  function at(x,y){ return state.grid[y][x]; }
  function isWall(x,y){ return at(x,y)==='#'; }
  function assetAt(x,y){ return state.assets.find(a=>a.x===x && a.y===y); }
  function isGoal(x,y){ return state.goals.some(g=>g.x===x && g.y===y); }
  function recalc(){ for(const a of state.assets){ const was=a.active; a.active=isGoal(a.x,a.y); if(a.active && !was) a.fuel=5; } }

  function applyTile(x,y){
    let event=false;
    const t = at(x,y);
    if(t==='$'){ state.net+=500; state.grid[y][x]='.'; tone(760,0.06); haptic(12); event=true; }
    if(t==='D'){ state.flow+=200; state.grid[y][x]='.'; tone(900,0.06); haptic([10,30,10]); event=true; }
    if(t==='T'){ state.net=Math.max(0,state.net-800); state.grid[y][x]='.'; tone(240,0.06,'square'); haptic(35); event=true; }
    if(t==='L'){ state.flow+=600; state.net=Math.max(0,state.net-400); state.grid[y][x]='.'; tone(520,0.06,'triangle'); haptic(25); event=true; }
    if(t==='I'){ state.flow=Math.max(0,state.flow-200); state.grid[y][x]='.'; tone(300,0.05); haptic(20); event=true; }
    return event;
  }

  function tickIncome(suppress=false){
    if(suppress) return;
    state.net += state.flow;
    for(const a of state.assets){
      if(a.active && a.fuel>0){ state.net += 100; a.fuel--; if(a.fuel<=0) a.active=false; }
    }
    if(state.moves % 10 === 0){
      const actives = state.assets.filter(a=>a.active).length;
      if(actives === 0){ state.net = Math.max(0, state.net - 500); } else { state.net += actives * 200; }
    }
    if(state.moves % 7 === 0){ state.flow = Math.max(0, state.flow - 100); }
  }

  function toggleOverlay(show){ document.getElementById('overlay').style.display = show ? 'flex' : 'none'; }
  document.getElementById('playBtn').addEventListener('click', ()=>{ started=true; toggleOverlay(false); tone(660,0.06); });

  window.addEventListener('keydown', e=>{
    const k=e.key;
    if(k==='ArrowLeft') move(-1,0);
    if(k==='ArrowRight') move(1,0);
    if(k==='ArrowUp') move(0,-1);
    if(k==='ArrowDown') move(0,1);
    if((e.ctrlKey||e.metaKey) && k==='z' && history.length){ state = history.pop(); updateHUD(); render(); }
    if(k==='r') loadLevel(L);
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>loadLevel(L));
  document.getElementById('undoBtn').addEventListener('click', ()=>{ if(history.length){ state = history.pop(); updateHUD(); render(); }});
  document.getElementById('levelsBtn').addEventListener('click', ()=>{
    const levels = (gameMode==='classic'? classicLevels : careerLevels);
    const list = levels.map((x,i)=>`${i+1}. ${x.name} — target ${x.target.toLocaleString('it-IT')}€`).join('\n');
    const ans = prompt(`Vai al livello (1-${levels.length})\n`+list, String(L+1));
    const idx = Math.max(1, Math.min(levels.length, parseInt(ans||'1'))) - 1;
    L=idx; loadLevel(L);
  });

  function move(dx,dy){
    if(!started) return;
    const nx=state.player.x+dx, ny=state.player.y+dy;
    if(!inB(nx,ny) || isWall(nx,ny)) return;

    let assetPushed=false;
    const box = assetAt(nx,ny);
    if(box){
      const bx=nx+dx, by=ny+dy;
      if(!inB(bx,by) || isWall(bx,by) || assetAt(bx,by)) return;
      box.x=bx; box.y=by; recalc(); tone(420,0.05,'triangle'); haptic(10); assetPushed = true;
    }

    const isBacktrack = (dx === -lastDir.dx && dy === -lastDir.dy);

    history.push(JSON.parse(JSON.stringify(state)));
    state.player.x=nx; state.player.y=ny;
    const hadEvent = applyTile(nx,ny);
    state.moves++;

    const prev = lastPos[lastPos.length-1];
    const prev2 = lastPos.length>1 ? lastPos[lastPos.length-2] : null;
    const revisitedShortLoop = prev2 && (prev2.x===state.player.x && prev2.y===state.player.y);
    const suppress = !hadEvent && !assetPushed && (isBacktrack || revisitedShortLoop);

    lastPos.push({x:state.player.x, y:state.player.y}); if(lastPos.length>3) lastPos.shift();
    lastDir = {dx, dy};

    tickIncome(suppress);
    updateHUD(); render();

    if(state.net>=state.target){
      if(history.every(s=>s.net>=0)) state.rep = Math.min(5, (state.rep||0)+1);
      localStorage.setItem('du.rep', String(state.rep||0));
      const score = Math.round(state.net/Math.max(1,state.moves)) + (state.eff||0)*10 + (state.rep||0)*500;
      alert(`Livello completato: ${state.name}\nMosse: ${state.moves}\nEfficienza: ${state.eff||0}%\nReputazione: ${state.rep||0}★\nScore: ${score}`);
      const levels = (gameMode==='classic'? classicLevels : careerLevels);
      L = (L+1) % levels.length; loadLevel(L);
    }
  }

  function render(){
    const W=canvas.width, H=canvas.height, C=Math.floor(W/SIZE);
    const c=ctx;
    c.clearRect(0,0,W,H);
    c.fillStyle="#081028"; c.fillRect(0,0,W,H);
    c.strokeStyle="#1a2655";
    for(let i=0;i<=SIZE;i++){ c.beginPath(); c.moveTo(i*C,0); c.lineTo(i*C,H); c.stroke(); c.beginPath(); c.moveTo(0,i*C); c.lineTo(W,i*C); c.stroke(); }
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
      const t=state.grid[y][x];
      if(t==='#') c.fillStyle='#0c1533';
      else if(t==='G') c.fillStyle='#003b2a';
      else if(t==='$') c.fillStyle='#2d2300';
      else if(t==='D') c.fillStyle='#001d2a';
      else if(t==='T') c.fillStyle='#2a0000';
      else if(t==='L') c.fillStyle='#14002a';
      else if(t==='I') c.fillStyle='#2a1a00';
      else c.fillStyle='transparent';
      if(c.fillStyle!=='transparent') c.fillRect(x*C,y*C,C,C);
    }
    function dot(x,y,color){ const r=Math.floor(C*0.12); const cx=x*C + C/2, cy=y*C + C/2; c.beginPath(); c.fillStyle=color; c.arc(cx,cy,r,0,Math.PI*2); c.fill(); }
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
      const t=state.grid[y][x];
      if(t==='$') dot(x,y,'#ffd700');
      if(t==='D') dot(x,y,'#3dc2ff');
      if(t==='T') dot(x,y,'#ff4d4d');
      if(t==='L') dot(x,y,'#8a56ff');
      if(t==='I') dot(x,y,'#ffaa00');
    }
    const pad=10, padP=14;
    function box(x,y,color){ c.fillStyle=color; c.fillRect(x*C+pad,y*C+pad,C-2*pad,C-2*pad); c.strokeStyle='#0a1228'; c.lineWidth=2; c.strokeRect(x*C+pad,y*C+pad,C-2*pad,C-2*pad); }
    for(const a of state.assets){ box(a.x,a.y, a.active ? '#2dd36f' : '#748ffc'); }
    c.fillStyle='#e9f1ff'; c.fillRect(state.player.x*C+padP, state.player.y*C+padP, C-2*padP, C-2*padP);
  }

  const showCareer = (localStorage.getItem('du.gameMode')||'career')==='career';
  document.querySelectorAll('#gameModeSeg button').forEach(b=>b.classList.toggle('active', b.dataset.gamemode===(showCareer?'career':'classic')));
  const levels = (gameMode==='classic'? classicLevels : careerLevels);
  loadLevel(L);
})();