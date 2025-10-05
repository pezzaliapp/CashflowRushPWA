// Cashflow Rush — Career Edition v3.1.4-robust (anti-grind + KPI mobile fix)
// pezzaliAPP ©2025 — MIT License
(() => {
  const SIZE = 12, BASE = 720;
  const $ = id => document.getElementById(id);

  // ---------- util ----------
  function isVisibleEl(el){ return !!(el && el.offsetParent !== null); }
  function pickVisible(...ids){
    for(const id of ids){
      const el = $(id);
      if(isVisibleEl(el)) return el;
    }
    // fallback: restituisci il primo esistente anche se nascosto
    for(const id of ids){
      const el = $(id);
      if(el) return el;
    }
    return null;
  }

  // ---------- canvas: scegli sempre quello VISIBILE ----------
  let canvas = null, ctx = null;
  function pickCanvas() {
    const g = $('game');
    const m = $('gameMob');
    const d = $('gameDesk');
    if (isVisibleEl(g)) return g;
    if (isVisibleEl(m)) return m;
    if (isVisibleEl(d)) return d;
    const any = Array.from(document.querySelectorAll('canvas')).find(isVisibleEl);
    return any || g || m || d || null;
  }
  function syncCanvas() {
    const c = pickCanvas();
    if (!c) return;
    if (canvas !== c) {
      canvas = c;
      ctx = canvas.getContext('2d');
      canvas.width = BASE; canvas.height = BASE;
    }
  }
  syncCanvas();
  window.addEventListener('resize', syncCanvas);
  setInterval(syncCanvas, 600); // iOS WebView a volte non emette resize

  // ---------- Overlay / PLAY ----------
  const overlayEls = [ $('playOverlayDesk'), $('playOverlayMob') ].filter(Boolean);
  const playBtns   = [ $('playBtnDesk'),    $('playBtnMob')     ].filter(Boolean);
  function toggleOverlay(show){ overlayEls.forEach(el=> el.style.display = show ? 'flex' : 'none'); }
  playBtns.forEach(btn=> btn.addEventListener('click', ()=>{
    started=true; toggleOverlay(false); tone(660,0.06);
  }));

  // ---------- Audio ----------
  let muted = localStorage.getItem('cfr.muted') === '1';
  const $mute = $('muteBtn'); if ($mute) $mute.textContent = muted ? '🔇' : '🔊';
  const AC = window.AudioContext || window.webkitAudioContext;
  const actx = AC ? new AC() : null;
  function tone(f=440,d=0.05,t='sine',v=0.05){
    if(!actx || muted) return;
    const o=actx.createOscillator(), g=actx.createGain();
    o.type=t; o.frequency.value=f; g.gain.value=v;
    o.connect(g); g.connect(actx.destination);
    o.start(); setTimeout(()=>{ try{o.stop()}catch{} }, d*1000);
  }
  if ($mute) {
    $mute.addEventListener('click', ()=>{
      muted=!muted; localStorage.setItem('cfr.muted', muted?'1':'0'); $mute.textContent = muted ? '🔇' : '🔊';
    });
  }

  // ---------- Career ----------
  const levels = [
    { name:"Risparmio",         target:  5000,  seed:1 },
    { name:"Investimento",      target: 15000,  seed:2 },
    { name:"Leva Finanziaria",  target: 30000,  seed:3 },
    { name:"Inflazione",        target: 50000,  seed:4 },
    { name:"Speculazione",      target: 80000,  seed:5 },
    { name:"Diversificazione",  target: 120000, seed:6 },
    { name:"Crisi",             target: 150000, seed:7 },
    { name:"Ripresa",           target: 220000, seed:8 },
    { name:"Bolla",             target: 350000, seed:9 },
    { name:"Tycoon Finale",     target:1000000, seed:10 },
  ];
  let L = parseInt(localStorage.getItem('cfr.level')||'0'); if(L>=levels.length) L=0;

  // ---------- Stato ----------
  let state=null, history=[], started=false;

  // RNG & griglia
  function rng(seed){ let s=seed||1; return ()=> (s=(s*1664525+1013904223)%4294967296)/4294967296; }
  function genGrid(seed){
    const rnd=rng(seed), g=Array.from({length:SIZE}, _=>Array(SIZE).fill('.'));
    for(let i=0;i<SIZE;i++){ g[0][i]='#'; g[SIZE-1][i]='#'; g[i][0]='#'; g[i][SIZE-1]='#'; }
    for(let i=0;i<3;i++) g[2+i*3][SIZE-2]='G';
    const features=['$','D','T','L','I'];
    for(let k=0;k<28;k++){
      const x=1+Math.floor(rnd()*(SIZE-2)), y=1+Math.floor(rnd()*(SIZE-2));
      if(g[y][x]!=='.') continue;
      g[y][x]=features[Math.floor(rnd()*features.length)];
    }
    for(let k=0;k<4;k++){
      const x=1+Math.floor(rnd()*(SIZE-2)), y=1+Math.floor(rnd()*(SIZE-2));
      if(g[y][x]!=='.') continue; g[y][x]='A';
    }
    g[1][1]='P'; return g;
  }

  function loadLevel(index){
    const meta=levels[index];
    const grid=genGrid(meta.seed);
    let player={x:1,y:1};
    const assets=[], goals=[];
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
      const t=grid[y][x];
      if(t==='P'){ player={x,y}; grid[y][x]='.'; }
      if(t==='A'){ assets.push({x,y,active:false,fuel:0}); grid[y][x]='.'; }
      if(t==='G'){ goals.push({x,y}); }
    }
    state={ name:meta.name,target:meta.target,grid,player,assets,goals, net:0,flow:0,moves:0, rep:parseInt(localStorage.getItem('cfr.rep')||'0'), eff:0 };
    history.length=0;
    updateHUD(); render(); started=false; toggleOverlay(true);
  }

  // ---------- Helpers ----------
  function euro(n){ return n.toLocaleString('it-IT')+"€"; }
  function inB(x,y){ return x>=0 && y>=0 && x<SIZE && y<SIZE; }
  function at(x,y){ return state.grid[y][x]; }
  function isWall(x,y){ return at(x,y)==='#'; }
  function assetAt(x,y){ return state.assets.find(a=>a.x===x && a.y===y); }
  function isGoal(x,y){ return state.goals.some(g=>g.x===x && g.y===y); }
  function recalc(){ for(const a of state.assets){ const was=a.active; a.active=isGoal(a.x,a.y); if(a.active && !was) a.fuel=5; } }

  // ---------- Eventi (senza clamp a 0 su Netto) ----------
  function applyTile(x,y){
    const t=at(x,y);
    if(t==='$'){ state.net += 500; state.grid[y][x]='.'; tone(760,0.06); }
    if(t==='D'){ state.flow += 200; state.grid[y][x]='.'; tone(900,0.06); }
    if(t==='T'){ state.net  -= 800; state.grid[y][x]='.'; tone(240,0.06,'square'); }
    if(t==='L'){ state.flow += 600; state.net  -= 400; state.grid[y][x]='.'; tone(520,0.06,'triangle'); }
    if(t==='I'){ state.flow = Math.max(0, state.flow - 200); state.grid[y][x]='.'; tone(300,0.05); }
  }

  // ---------- Tick con anti-grind ----------
  function tick(gainAllowed = true){
    if (gainAllowed) state.net += state.flow; // incasso flusso solo se mossa “valida”
    for(const a of state.assets){
      if(a.active && a.fuel>0){
        state.net += 100;
        a.fuel--;
        if(a.fuel<=0) a.active=false;
      }
    }
    if(state.moves % 7 === 0) state.flow = Math.max(0, state.flow - 100); // decadimento
  }

  // ---------- Movimento ----------
  function move(dx,dy){
    if(!started) return;

    let didSomething = false;

    const nx=state.player.x+dx, ny=state.player.y+dy;
    if(!inB(nx,ny) || isWall(nx,ny)) return;

    const box=assetAt(nx,ny);
    if(box){
      const bx=nx+dx, by=ny+dy;
      if(!inB(bx,by) || isWall(bx,by) || assetAt(bx,by)) return;
      box.x=bx; box.y=by;
      recalc();
      didSomething = true;       // spinta = mossa valida
      tone(420,0.05,'triangle');
    }

    // Undo snapshot
    history.push(JSON.parse(JSON.stringify(state)));

    // Muovi player
    state.player.x=nx; state.player.y=ny;

    // Eventi su cella e verifica se hanno cambiato net/flow
    const beforeNet = state.net, beforeFlow = state.flow;
    applyTile(nx,ny);
    if (state.net !== beforeNet || state.flow !== beforeFlow) didSomething = true;

    // Avanza tempo
    state.moves++;
    tick(didSomething);

    updateHUD(); render();

    if(state.net>=state.target) completeLevel();
  }

  // ---------- Vittoria ----------
  function completeLevel(){
    if(history.every(s=>s.net>=0)) state.rep = Math.min(5,(state.rep||0)+1);
    localStorage.setItem('cfr.rep', String(state.rep||0));
    const eff = state.moves ? Math.max(0, Math.round((state.net/state.moves)/10)) : 0;
    state.eff = eff;

    const rLevel=$('rLevel'), rTarget=$('rTarget'), rNet=$('rNet'), rFlow=$('rFlow'), rMoves=$('rMoves'), rEff=$('rEff'), rRep=$('rRep');
    const modal=$('reportModal');
    if(rLevel)  rLevel.textContent  = state.name;
    if(rTarget) rTarget.textContent = euro(state.target);
    if(rNet)    rNet.textContent    = euro(state.net);
    if(rFlow)   rFlow.textContent   = euro(state.flow);
    if(rMoves)  rMoves.textContent  = state.moves;
    if(rEff)    rEff.textContent    = eff + "%";
    if(rRep)    rRep.textContent    = (state.rep||0) + "★";
    if(modal)   modal.classList.add('show');

    tone(800,0.15,'triangle');
    L=(L+1)%levels.length;
    localStorage.setItem('cfr.level', String(L));
  }

  // ---------- HUD: scegli SEMPRE l’elemento visibile (desktop/mobile) ----------
  function updateHUD(){
    const elNet   = pickVisible('dNet','mNet');
    const elFlow  = pickVisible('dFlow','mFlow');
    const elMoves = pickVisible('dMoves','mMoves');
    const elTarget= pickVisible('dTarget','mTarget');
    const elEff   = pickVisible('dEff','mEff');
    const elRep   = pickVisible('dRep','mRep');

    if(elNet)    elNet.textContent    = euro(state.net);
    if(elFlow)   elFlow.textContent   = euro(state.flow) + "/mossa";
    if(elMoves)  elMoves.textContent  = state.moves;
    if(elTarget) elTarget.textContent = euro(state.target);

    const eff = state.moves ? Math.max(0, Math.round((state.net/state.moves)/10)) : 0;
    state.eff = eff;

    if(elEff) elEff.textContent = eff + "%";
    if(elRep) elRep.textContent = state.rep;
  }

  // ---------- Render ----------
  function render(){
    syncCanvas(); if(!canvas || !ctx) return;
    const W=canvas.width, H=canvas.height, C=Math.floor(W/SIZE);
    const c=ctx;
    c.clearRect(0,0,W,H);
    c.fillStyle="#081028"; c.fillRect(0,0,W,H);

    // griglia
    c.strokeStyle="#1a2655";
    for(let i=0;i<=SIZE;i++){
      c.beginPath(); c.moveTo(i*C,0); c.lineTo(i*C,H); c.stroke();
      c.beginPath(); c.moveTo(0,i*C); c.lineTo(W,i*C); c.stroke();
    }

    // sfondo celle speciali
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

    // puntini evento
    function dot(x,y,color){ const r=Math.floor(C*0.12), cx=x*C+C/2, cy=y*C+C/2;
      c.beginPath(); c.fillStyle=color; c.arc(cx,cy,r,0,Math.PI*2); c.fill(); }
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++){
      const t=state.grid[y][x];
      if(t==='$') dot(x,y,'#ffd700');
      if(t==='D') dot(x,y,'#3dc2ff');
      if(t==='T') dot(x,y,'#ff4d4d');
      if(t==='L') dot(x,y,'#8a56ff');
      if(t==='I') dot(x,y,'#ffaa00');
    }

    // asset e player
    const pad=10, padP=14;
    function box(x,y,color){ c.fillStyle=color; c.fillRect(x*C+pad,y*C+pad,C-2*pad,C-2*pad);
      c.strokeStyle='#0a1228'; c.lineWidth=2; c.strokeRect(x*C+pad,y*C+pad,C-2*pad,C-2*pad); }
    for(const a of state.assets) box(a.x,a.y, a.active ? '#2dd36f' : '#748ffc');
    c.fillStyle='#e9f1ff'; c.fillRect(state.player.x*C+padP, state.player.y*C+padP, C-2*padP, C-2*padP);
  }

  // ---------- Input tastiera (desktop) ----------
  window.addEventListener('keydown', e=>{
    const k=e.key;
    if(k==='ArrowLeft') move(-1,0);
    if(k==='ArrowRight') move(1,0);
    if(k==='ArrowUp') move(0,-1);
    if(k==='ArrowDown') move(0,1);
    if((e.ctrlKey||e.metaKey) && k==='z' && history.length){ state = history.pop(); updateHUD(); render(); }
    if(k==='r') loadLevel(L);
  });

  // ---------- D-Pad (mobile) ----------
  document.querySelectorAll('.touchpad button[data-dx]').forEach(b=> b.addEventListener('click', ()=>{
    const dx=parseInt(b.dataset.dx), dy=parseInt(b.dataset.dy);
    move(dx,dy);
  }));

  // ---------- Toolbar ----------
  const levelsBtn = $('levelsBtn');
  if(levelsBtn){
    levelsBtn.addEventListener('click', ()=>{
      const list = levels.map((x,i)=>`${i+1}. ${x.name} — target ${x.target.toLocaleString('it-IT')}€`).join('\n');
      const ans = prompt(`Vai al livello (1-${levels.length})\n`+list, String(L+1));
      const idx = Math.max(1, Math.min(levels.length, parseInt(ans||'1'))) - 1;
      L=idx; loadLevel(L);
    });
  }
  const resetBtn=$('resetBtn'); if(resetBtn) resetBtn.addEventListener('click', ()=>loadLevel(L));
  const undoBtn =$('undoBtn');  if(undoBtn)  undoBtn.addEventListener('click', ()=>{ if(history.length){ state=history.pop(); updateHUD(); render(); }});
  const careerBtn=$('careerBtn'); if(careerBtn) careerBtn.addEventListener('click', ()=>{
    if(confirm("Ricominciare la Carriera?\nQuesto resetta progressione e reputazione.")){
      localStorage.removeItem('cfr.level'); localStorage.removeItem('cfr.rep'); L=0; loadLevel(L);
    }
  });

  // ---------- API per dual.js (swipe & play) ----------
  window.Game = {
    start: () => { if(!started){ started = true; toggleOverlay(false); tone(660,0.06); } },
    nudge: (dx,dy) => move(dx,dy),
    reload: () => loadLevel(L),
  };

  // Avvio
  loadLevel(L);
})();
