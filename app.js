// app.js — Cashflow Rush (Arcade Puzzle Tycoon) v1.0
// © 2025 pezzaliAPP — MIT

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const GRID = 12; // 12x12 grid
  const CELL = Math.floor(W / GRID);

  const $net = document.getElementById('netWorth');
  const $flow = document.getElementById('cashflow');
  const $moves = document.getElementById('moves');
  const $target = document.getElementById('target');
  const $reset = document.getElementById('resetBtn');
  const $undo = document.getElementById('undoBtn');
  const $mute = document.getElementById('muteBtn');

  let muted = localStorage.getItem('cashflow.muted') === '1';
  $mute.textContent = muted ? '🔇' : '🔊';
  $mute.addEventListener('click', ()=>{
    muted = !muted;
    localStorage.setItem('cashflow.muted', muted ? '1':'0');
    $mute.textContent = muted ? '🔇' : '🔊';
  });

  // --- Sounds (simple beep via WebAudio) ---
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const actx = AudioCtx ? new AudioCtx() : null;
  function beep(freq=440, dur=0.07, type='sine', vol=0.05){
    if(!actx || muted) return;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    o.start();
    setTimeout(()=>{ o.stop(); }, dur*1000);
  }

  // --- Level encoding ---
  // Tiles: '.' empty, '#' wall, 'P' player, '$' coin, 'A' asset (pushable like a crate),
  // 'G' goal pad (activate asset when placed), 'T' tax/debt, 'D' dividend, 'L' leverage, 'I' inflation (reduces flow each 4 moves)
  const levels = [
    {
      name: "Tutorial del Valore",
      target: 5000,
      grid: [
        "############",
        "#..$..D..G.#",
        "#..##....#.#",
        "#..A..P..#.#",
        "#..##....#.#",
        "#..$..L..#.#",
        "#..##....#.#",
        "#..A.....#.#",
        "#..##..T.#.#",
        "#..$.....#.#",
        "#..##..I.#.#",
        "############",
      ]
    },
    {
      name: "Leva & Tasse",
      target: 15000,
      grid: [
        "############",
        "#P..A..#..G#",
        "#.##.#.#.#.#",
        "#.$..L..D..#",
        "#.##.#.#.#.#",
        "#..A..#..G.#",
        "#.#.#.#.#..#",
        "#..T..I..$.#",
        "#.#.#.#.#..#",
        "#..A..#..G.#",
        "#..$..D..$.#",
        "############",
      ]
    }
  ];

  // --- Game State ---
  let levelIndex = parseInt(localStorage.getItem('cashflow.level')||'0');
  if(levelIndex >= levels.length) levelIndex = 0;

  let state = null;
  let history = [];

  function loadLevel(idx){
    const L = levels[idx];
    const grid = L.grid.map(r=>r.split(''));
    let player = {x:0,y:0};
    const assets = [];
    const goals = [];
    for(let y=0;y<GRID;y++){
      for(let x=0;x<GRID;x++){
        const t = grid[y][x];
        if(t==='P'){ player={x,y}; grid[y][x]='.'; }
        if(t==='A'){ assets.push({x,y,active:false}); grid[y][x]='.'; }
        if(t==='G'){ goals.push({x,y}); grid[y][x]='G'; }
      }
    }
    state = {
      name: L.name,
      target: L.target,
      grid, player, assets, goals,
      net: 0, flow: 0, moves: 0, tick: 0
    };
    history = [];
    saveSnapshot();
    render();
    updateHUD();
  }

  function clone(obj){ return JSON.parse(JSON.stringify(obj)); }

  function saveSnapshot(){
    history.push(clone(state));
    if(history.length>80) history.shift();
  }

  function undo(){
    if(history.length<=1) return;
    history.pop();
    state = clone(history[history.length-1]);
    render(); updateHUD();
  }

  // Helpers
  function tile(x,y){ return state.grid[y][x]; }
  function isWall(x,y){ return tile(x,y)==='#'; }
  function inBounds(x,y){ return x>=0 && y>=0 && x<GRID && y<GRID; }
  function assetAt(x,y){ return state.assets.find(a=>a.x===x && a.y===y); }
  function goalAt(x,y){ return state.goals.some(g=>g.x===x && g.y===y); }

  function applyTileEffect(x,y){
    const t = tile(x,y);
    if(t==='$'){ state.net += 500; state.grid[y][x]='.'; beep(660); }
    if(t==='D'){ state.flow += 200; state.grid[y][x]='.'; beep(880); }
    if(t==='T'){ state.net = Math.max(0, state.net - 800); state.grid[y][x]='.'; beep(220,'0.08','square'); }
    if(t==='L'){ state.flow += 600; state.net = Math.max(0, state.net - 400); state.grid[y][x]='.'; beep(520,'0.06','sawtooth'); }
    if(t==='I'){ // inflation hurts flow periodically
      state.grid[y][x]='.'; state.flow = Math.max(0, state.flow - 200); beep(300,'0.05'); 
    }
  }

  function recalcAssets(){
    // activated asset contributes +1000 net immediately and +500 flow per 5 moves
    for(const a of state.assets){
      a.active = goalAt(a.x,a.y);
    }
  }

  function tickIncome(){
    // every move: net += flow
    state.net += state.flow;
    // every 5 moves: each active asset adds +500 flow (compounding engine)
    if(state.moves % 5 === 0){
      const actives = state.assets.filter(a=>a.active).length;
      state.flow += actives * 500;
    }
    // every 7 moves: inflation pulse reduces flow slightly
    if(state.moves % 7 === 0){
      state.flow = Math.max(0, state.flow - 100);
    }
  }

  function move(dx,dy){
    const nx = state.player.x + dx;
    const ny = state.player.y + dy;
    if(!inBounds(nx,ny) || isWall(nx,ny)) return;
    const box = assetAt(nx,ny);
    if(box){
      const bx = nx + dx, by = ny + dy;
      if(!inBounds(bx,by) || isWall(bx,by) || assetAt(bx,by)) return; // blocked
      box.x = bx; box.y = by;
      recalcAssets();
      beep(420,'0.05','triangle');
    }
    state.player.x = nx; state.player.y = ny;
    applyTileEffect(nx,ny);
    state.moves++;
    tickIncome();
    saveSnapshot();
    render(); updateHUD();
    checkWin();
  }

  function checkWin(){
    if(state.net >= state.target){
      setTimeout(()=>{
        beep(660,0.1); setTimeout(()=>beep(880,0.1),120); setTimeout(()=>beep(1040,0.1),240);
        alert(`Livello completato! ${state.name}\nMosse: ${state.moves}\nValore netto: ${fmt(state.net)}`);
        levelIndex = (levelIndex+1) % levels.length;
        localStorage.setItem('cashflow.level', String(levelIndex));
        loadLevel(levelIndex);
      }, 20);
    }
  }

  function fmt(n){ return n.toLocaleString('it-IT',{maximumFractionDigits:0}) + "€"; }
  function updateHUD(){
    $net.textContent = fmt(state.net);
    $flow.textContent = fmt(state.flow) + "/mossa";
    $moves.textContent = state.moves;
    $target.textContent = fmt(levels[levelIndex].target);
  }

  function drawCell(x,y,color){
    const px = x*CELL, py = y*CELL;
    ctx.fillStyle = color; ctx.fillRect(px,py,CELL,CELL);
  }

  function render(){
    // background grid
    ctx.fillStyle = "#081028"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = "#1a2655";
    for(let i=0;i<=GRID;i++){
      ctx.beginPath(); ctx.moveTo(i*CELL,0); ctx.lineTo(i*CELL,H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,i*CELL); ctx.lineTo(W,i*CELL); ctx.stroke();
    }
    // tiles
    for(let y=0;y<GRID;y++){
      for(let x=0;x<GRID;x++){
        const t = tile(x,y);
        if(t==='#'){ drawCell(x,y,'#0c1533'); }
        if(t==='G'){ drawCell(x,y,'#003b2a'); }
        if(t==='$'){ drawCell(x,y,'#2d2300'); }
        if(t==='D'){ drawCell(x,y,'#001d2a'); }
        if(t==='T'){ drawCell(x,y,'#2a0000'); }
        if(t==='L'){ drawCell(x,y,'#14002a'); }
        if(t==='I'){ drawCell(x,y,'#2a1a00'); }
      }
    }
    // coins / pickups dots
    for(let y=0;y<GRID;y++){
      for(let x=0;x<GRID;x++){
        const t = tile(x,y);
        if(t==='$'){ dot(x,y,'#ffd700'); }
        if(t==='D'){ dot(x,y,'#3dc2ff'); }
        if(t==='T'){ dot(x,y,'#ff4d4d'); }
        if(t==='L'){ dot(x,y,'#8a56ff'); }
        if(t==='I'){ dot(x,y,'#ffaa00'); }
      }
    }
    // assets
    for(const a of state.assets){
      box(a.x,a.y, a.active ? '#2dd36f' : '#748ffc');
    }
    // player
    rect(state.player.x, state.player.y, '#e9f1ff');
  }

  function rect(x,y,color){
    const pad = Math.floor(CELL*0.18);
    ctx.fillStyle = color;
    ctx.fillRect(x*CELL+pad, y*CELL+pad, CELL-2*pad, CELL-2*pad);
  }
  function box(x,y,color){
    const pad = Math.floor(CELL*0.12);
    ctx.fillStyle = color;
    ctx.fillRect(x*CELL+pad, y*CELL+pad, CELL-2*pad, CELL-2*pad);
    ctx.strokeStyle = '#0a1228'; ctx.lineWidth = 2;
    ctx.strokeRect(x*CELL+pad, y*CELL+pad, CELL-2*pad, CELL-2*pad);
  }
  function dot(x,y,color){
    const r = Math.floor(CELL*0.12);
    const cx = x*CELL + CELL/2, cy = y*CELL + CELL/2;
    ctx.beginPath(); ctx.fillStyle = color; ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }

  // Input
  let touchStart=null;
  canvas.addEventListener('touchstart', (e)=>{
    const t = e.changedTouches[0]; touchStart = {x:t.clientX, y:t.clientY}; 
  }, {passive:true});
  canvas.addEventListener('touchend', (e)=>{
    const t = e.changedTouches[0];
    if(!touchStart) return;
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if(Math.max(ax,ay) < 24) return;
    if(ax>ay) move(dx>0?1:-1,0); else move(0, dy>0?1:-1);
    touchStart = null;
  }, {passive:true});

  window.addEventListener('keydown', (e)=>{
    const k = e.key;
    if(k==='ArrowLeft') move(-1,0);
    if(k==='ArrowRight') move(1,0);
    if(k==='ArrowUp') move(0,-1);
    if(k==='ArrowDown') move(0,1);
    if(k==='z' && (e.ctrlKey||e.metaKey)) undo();
    if(k==='r') loadLevel(levelIndex);
  });

  document.getElementById('resetBtn').addEventListener('click', ()=>loadLevel(levelIndex));
  document.getElementById('undoBtn').addEventListener('click', ()=>undo());

  // Start
  loadLevel(levelIndex);
})();
