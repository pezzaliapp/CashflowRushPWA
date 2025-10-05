// dual.js v3.1.0-career — Adattatore layout + play + d-pad + swipe (Career only)
(()=>{
  // Device mode
  let modePref = localStorage.getItem('du.mode') || 'auto';
  const uaIsMobile = ()=> /iPhone|Android|Mobile|iPad|iPod/i.test(navigator.userAgent||'');
  const computeAuto = ()=> (('ontouchstart' in window) || navigator.maxTouchPoints>0 || window.innerWidth<920 || uaIsMobile()) ? 'mobile' : 'desktop';

  function applyMode(){
    const m = modePref==='auto' ? computeAuto() : modePref;
    document.body.classList.toggle('mode-mobile', m==='mobile');
    document.body.classList.toggle('mode-desktop', m!=='mobile');
    document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('active', b.dataset.mode===modePref));
    syncCanvasId(); fitCanvas(); bindPlay();
  }

  const modeSeg=document.getElementById('modeSeg');
  if(modeSeg){
    modeSeg.addEventListener('click', e=>{
      const b=e.target.closest('button'); if(!b) return;
      modePref=b.dataset.mode; localStorage.setItem('du.mode', modePref); applyMode();
    });
  }
  window.addEventListener('resize', ()=>{ if(modePref==='auto') applyMode(); else fitCanvas(); });

  // Canvas: l’engine usa #game → rinomina quello visibile
  function syncCanvasId(){
    const isMob = document.body.classList.contains('mode-mobile');
    const desk = document.getElementById('gameDesk');
    const mob  = document.getElementById('gameMob');
    if(desk && desk.id==='game') desk.id='gameDesk';
    if(mob  && mob.id==='game') mob.id='gameMob';
    (isMob ? mob : desk).id='game';
  }
  function fitCanvas(){
    const c=document.getElementById('game'); if(!c) return;
    const isMob=document.body.classList.contains('mode-mobile');
    if(isMob){ const w=Math.min(window.innerWidth*0.94,720); c.style.width=w+'px'; c.style.height='auto'; }
    else{ const stage=document.querySelector('.stageDesk'); const maxW=stage?(stage.clientWidth-24):720; const maxH=Math.min(window.innerHeight-320, stage?(stage.clientHeight-24):720); const size=Math.max(520,Math.min(maxW,maxH,720)); c.style.width=size+'px'; c.style.height=size+'px'; }
  }

  // PLAY + audio unlock iOS
  let started=false;
  function ensureAudio(){
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    window.__actx=window.__actx||new AC();
    if(window.__actx.state==='suspended'){ window.__actx.resume().catch(()=>{}); }
  }
  function tone(f=660,d=0.05){
    const ac=window.__actx; if(!ac) return; const o=ac.createOscillator(), g=ac.createGain(); o.type='sine'; o.frequency.value=f; g.gain.value=0.05; o.connect(g); g.connect(ac.destination); o.start(); setTimeout(()=>{try{o.stop()}catch{};}, d*1000);
  }
  function startUI(ev){
    if(ev && ev.preventDefault) try{ev.preventDefault();}catch(_){}
    if(started) return; started=true;
    ensureAudio(); tone(660,0.05);
    const o1=document.getElementById('playOverlayDesk'); const o2=document.getElementById('playOverlayMob');
    if(o1) o1.style.display='none'; if(o2) o2.style.display='none';
    if(window.Game && typeof Game.start==='function') Game.start();
  }
  function bindPlay(){
    const b1=document.getElementById('playBtnDesk'); const b2=document.getElementById('playBtnMob'); const c=document.getElementById('game');
    ['click','touchstart','pointerup'].forEach(h=>{ if(b1) b1.addEventListener(h,startUI,{passive:false}); if(b2) b2.addEventListener(h,startUI,{passive:false}); });
    if(c){ ['touchstart','pointerdown','mousedown'].forEach(h=> c.addEventListener(h, ()=>{ if(!started) startUI(); }, {passive:true})); }
  }

  // D-pad → Game.nudge
  document.querySelectorAll('.touchpad button').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(!started) startUI();
      const dx=parseInt(b.dataset.dx), dy=parseInt(b.dataset.dy);
      if(window.Game && typeof Game.nudge==='function'){ Game.nudge(dx,dy); }
    });
  });

  // Swipe mobile → Game.nudge
  (()=>{
    const mob=document.getElementById('gameMob'); if(!mob) return;
    let s=null;
    mob.addEventListener('touchstart', e=>{ s=e.changedTouches[0]; }, {passive:true});
    mob.addEventListener('touchend', e=>{
      if(!s) return; const t=e.changedTouches[0]; const dx=t.clientX-s.clientX, dy=t.clientY-s.clientY;
      if(Math.max(Math.abs(dx),Math.abs(dy))<24) return;
      if(!started) startUI();
      if(window.Game && typeof Game.nudge==='function'){
        if(Math.abs(dx)>Math.abs(dy)) Game.nudge(dx>0?1:-1,0); else Game.nudge(0,dy>0?1:-1);
      }
      s=null;
    }, {passive:true});
  })();

  // Boot
  applyMode();
  setTimeout(()=>{ syncCanvasId(); fitCanvas(); bindPlay(); }, 0);
})();
