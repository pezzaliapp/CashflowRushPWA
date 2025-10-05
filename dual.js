// dual.js — Cashflow Rush v3.1.3 (Hybrid layout + Swipe + Vibration)
// ©2025 pezzaliAPP — MIT License
(() => {
  const $ = id => document.getElementById(id);

  // Rileva dispositivo
  function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|android/.test(ua)) return 'mobile';
    return 'desktop';
  }

  let modePref = localStorage.getItem('cfr.mode') || 'auto';
  let mode = modePref === 'auto' ? detectDevice() : modePref;
  document.body.classList.toggle('mode-mobile', mode === 'mobile');
  document.body.classList.toggle('mode-desktop', mode === 'desktop');

  // Selettore "Auto / Laptop / Smartphone"
  const seg = $('modeSeg');
  if (seg) {
    seg.querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === modePref);
      b.addEventListener('click', () => {
        const m = b.dataset.mode;
        localStorage.setItem('cfr.mode', m);
        mode = m === 'auto' ? detectDevice() : m;
        document.body.classList.toggle('mode-mobile', mode === 'mobile');
        document.body.classList.toggle('mode-desktop', mode === 'desktop');
        seg.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });
  }

  // Attiva canvas corretto
  const canvas = (mode === 'mobile') ? $('gameMob') : $('gameDesk');
  if (canvas && canvas.id !== 'game') canvas.id = 'game';

  // Tasto PLAY
  const playBtns = [ $('playBtnDesk'), $('playBtnMob') ].filter(Boolean);
  playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      try { window.Game.start(); } catch(e){}
    });
  });

  // Touch D-Pad (mobile)
  document.querySelectorAll('.touchpad button[data-dx]').forEach(b => {
    b.addEventListener('click', () => {
      const dx = parseInt(b.dataset.dx), dy = parseInt(b.dataset.dy);
      try {
        window.Game.start();
        window.Game.nudge(dx, dy);
        if (navigator.vibrate) navigator.vibrate(20);
      } catch(e){}
    });
  });

  // Swipe su canvas (mobile)
  if (mode === 'mobile' && canvas) {
    let startX = 0, startY = 0;
    canvas.addEventListener('touchstart', e => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });

    canvas.addEventListener('touchend', e => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < 30) return;
      try {
        if (absX > absY) {
          window.Game.nudge(dx > 0 ? 1 : -1, 0);
        } else {
          window.Game.nudge(0, dy > 0 ? 1 : -1);
        }
        if (navigator.vibrate) navigator.vibrate(25);
      } catch(e){}
    }, { passive: true });
  }

  // Aggiornamento layout on resize
  window.addEventListener('resize', () => {
    const newMode = modePref === 'auto' ? detectDevice() : modePref;
    document.body.classList.toggle('mode-mobile', newMode === 'mobile');
    document.body.classList.toggle('mode-desktop', newMode === 'desktop');
  });
})();
