// dual.js — Cashflow Rush v3.1.4 (Hybrid layout + Swipe + Vibration + iOS de-dupe)
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
        modePref = m;
        mode = m === 'auto' ? detectDevice() : m;
        document.body.classList.toggle('mode-mobile', mode === 'mobile');
        document.body.classList.toggle('mode-desktop', mode === 'desktop');
        seg.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');

        // Aggiorna canvas attivo quando si cambia modalità
        activateCanvasForMode();
      });
    });
  }

  // Attiva canvas corretto (assegna id="game" a quello giusto)
  function activateCanvasForMode() {
    const wantMobile = (mode === 'mobile');
    const desk = $('gameDesk');
    const mob  = $('gameMob');
    if (!desk || !mob) return;

    if (wantMobile && mob.id !== 'game') {
      if (desk.id === 'game') desk.id = 'gameDesk';
      mob.id = 'game';
    } else if (!wantMobile && desk.id !== 'game') {
      if (mob.id === 'game') mob.id = 'gameMob';
      desk.id = 'game';
    }
  }
  activateCanvasForMode();

  // ====== Debounce anti-doppio input (iOS touch + click fantasma) ======
  let moveLock = false;
  function doMove(dx, dy) {
    if (moveLock) return;
    moveLock = true;
    try {
      window.Game.start();
      window.Game.nudge(dx, dy);
      if (navigator.vibrate) navigator.vibrate(20);
    } catch (e) {}
    setTimeout(() => { moveLock = false; }, 120); // piccolo cooldown
  }

  // Tasto PLAY (pointerup gestisce touch e mouse senza doppioni)
  const playBtns = [ $('playBtnDesk'), $('playBtnMob') ].filter(Boolean);
  playBtns.forEach(btn => {
    btn.addEventListener('pointerup', (e) => {
      e.preventDefault();
      try { window.Game.start(); } catch(e){}
    });
    // Evita click fantasma post-touch
    btn.addEventListener('click', e => e.preventDefault());
  });

  // D-pad mobile: usa SOLO touchstart (niente click)
  document.querySelectorAll('.touchpad button[data-dx]').forEach(b => {
    // annulla eventuali click fantasma
    b.addEventListener('click', e => e.preventDefault());

    b.addEventListener('touchstart', (e) => {
      // evita che il touch generi click secondario
      e.preventDefault();
      const dx = parseInt(b.dataset.dx, 10);
      const dy = parseInt(b.dataset.dy, 10);
      doMove(dx, dy);
    }, { passive: false });
  });

  // Swipe su canvas (solo in mobile) con debounce
  (function setupSwipe() {
    if (mode !== 'mobile') return;
    const canvas = $('game');
    if (!canvas) return;

    let startX = 0, startY = 0;
    const MIN = 30; // soglia swipe

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
      if (Math.max(absX, absY) < MIN) return; // swipe troppo corto

      if (absX > absY) {
        doMove(dx > 0 ? 1 : -1, 0);
      } else {
        doMove(0, dy > 0 ? 1 : -1);
      }
    }, { passive: true });
  })();

  // Aggiornamento layout on resize (resta coerente con preferenza)
  window.addEventListener('resize', () => {
    const newMode = modePref === 'auto' ? detectDevice() : modePref;
    document.body.classList.toggle('mode-mobile', newMode === 'mobile');
    document.body.classList.toggle('mode-desktop', newMode === 'desktop');
    if (newMode !== mode) {
      mode = newMode;
      activateCanvasForMode();
    }
  });
})();
