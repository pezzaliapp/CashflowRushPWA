// dual.js v3.1.0-career — auto layout + swipe
(()=>{
  const modeSeg = document.getElementById('modeSeg');
  function computeAuto(){ return (('ontouchstart' in window) || navigator.maxTouchPoints>0 || window.innerWidth<920) ? 'mobile' : 'desktop'; }
  let modePref = localStorage.getItem('du.mode') || 'auto';
  function applyMode(){
    const m = modePref==='auto' ? computeAuto() : modePref;
    document.body.classList.toggle('mode-mobile', m==='mobile');
    document.body.classList.toggle('mode-desktop', m!=='mobile');
    document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('active', b.dataset.mode===modePref));
  }
  window.addEventListener('resize', ()=>{ if(modePref==='auto') applyMode(); });
  if(modeSeg){
    modeSeg.addEventListener('click', e=>{
      const b=e.target.closest('button'); if(!b) return;
      modePref=b.dataset.mode; localStorage.setItem('du.mode', modePref); applyMode();
    });
  }
  applyMode();

  // Swipe on mobile canvas
  const mob = document.getElementById('gameMob');
  if(mob){
    let start=null;
    mob.addEventListener('touchstart', e=>{ start=e.changedTouches[0]; }, {passive:true});
    mob.addEventListener('touchend', e=>{
      if(!start) return; const t=e.changedTouches[0]; const dx=t.clientX-start.clientX, dy=t.clientY-start.clientY;
      if(Math.max(Math.abs(dx),Math.abs(dy))<24) return;
      if(Math.abs(dx)>Math.abs(dy)){ window.Game?.nudge?.(dx>0?1:-1,0); } else { window.Game?.nudge?.(0,dy>0?1:-1); }
      start=null;
    }, {passive:true});
  }

  // Ensure PLAY buttons call Game.start too (fallback)
  ['playBtnDesk','playBtnMob'].forEach(id=>{
    const b=document.getElementById(id); if(b) b.addEventListener('click', ()=> window.Game?.start?.());
  });
})();