# Cashflow Rush — Dual Universe (PWA) — v3.1.0

**Modalità di gioco:** Classic (7 livelli rapidi) · Career (10 livelli progressivi)  
**Antigrind:** niente incassi su avanzamento avanti↔indietro/loop breve senza evento economico  
**PWA:** offline-first con auto-update (sw.js?v=3.1.0)

---

## 1) Pitch
Rompicapo arcade finanziario: spingi gli **Asset** per attivarli, genera **cashflow** e raggiungi l’**Obiettivo di Valore Netto**. Ora in un’unica PWA con **due universi**: Classic (veloce) e Career (strategico).

## 2) Obiettivo
Arrivare al **target di Valore Netto** del livello nel minor numero di **mosse**, mantenendo un **Flusso €/mossa** sostenibile.

## 3) Modalità di gioco
- **Classic:** 7 livelli fissi, sessioni rapide.
- **Career:** 10 livelli (*Risparmio → Tycoon Finale*), KPI aggiuntivi (**Efficienza %**, **Reputazione ★**).  
- Selettore in alto **Classic | Career** (al **primo avvio** parte **Career**, poi ricorda la tua scelta).

## 4) Comandi
**Laptop:** Frecce; `Ctrl/Cmd+Z` = Undo; `R` = Reset; **PLAY** per iniziare.  
**Smartphone:** Swipe sulla griglia; D-pad virtuale (se attivo).

## 5) Legenda
🟡 Monete (+500€) · 🔷 Dividendo (+200€/mossa) · 🟣 Leva (+600€/mossa, −400€) · 🔴 Tassa (−800€) · 🟠 Inflazione (−200€/mossa) · 🔵 Asset inattivo → 🟢 attivo su 🟩 Goal (+100€/mossa ×5)

## 6) Regole economiche
- Incassi il **flow** ogni mossa.  
- Ogni **10 mosse**: se 0 asset attivi → −500€, altrimenti +200€ per asset attivo.  
- Ogni **7 mosse**: decadimento −100€/mossa (min 0).

## 7) Anti-grind (definitivo)
Nessun incasso se **non** avviene un evento economico **e**:
- mossa di **ritorno immediato** (A↔B), oppure
- **loop breve** (A→B→A).  
✅ Incasso sempre permesso se **spingi un asset** o **raccogli** $, D, L, T, I.

## 8) Career Levels
1. Risparmio — 5.000€
2. Investimento — 15.000€
3. Leva Finanziaria — 30.000€
4. Inflazione — 50.000€
5. Speculazione — 80.000€
6. Diversificazione — 120.000€
7. Crisi — 150.000€
8. Ripresa — 220.000€
9. Bolla — 350.000€
10. Tycoon Finale — 1.000.000€

## 9) PWA
Installabile e offline. Il service worker (`sw.js?v=3.1.0`) effettua **auto-update** senza svuotare cache.

## 10) Struttura
```
/
├─ index.html
├─ app.js
├─ sw.js
├─ manifest.webmanifest
├─ icons/
│  ├─ icon-192.png
│  └─ icon-512.png
└─ DualUniverse_Banner.png
```

## 11) Changelog
- **v3.1.0**: PWA unificata Classic+Career, anti-grind definitivo, overlay PLAY, flash visivo al cambio modalità, icone Orbital, banner incluso.

## 12) Licenza & Crediti
MIT © 2025 pezzaliAPP
