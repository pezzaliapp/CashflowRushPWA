# Cashflow Rush — Dual Universe (PWA) — v3.1.1

**Modalità di gioco:** Classic (7 livelli rapidi) · Career (10 livelli progressivi)  
**Smartphone layout dedicato:** canvas centrato, **D‑pad** e legende verticali ai lati, overlay **PLAY** mobile.  
**Antigrind:** niente incassi su avanti↔indietro/loop breve senza evento economico.  
**PWA:** offline-first con auto-update (sw.js?v=3.1.1)

---

## 1) Pitch
Rompicapo arcade finanziario: spingi gli **Asset** per attivarli, genera **cashflow** e raggiungi l’**Obiettivo di Valore Netto**. **Dual Universe** unifica **Classic** e **Career** con UI su misura per laptop e smartphone.

## 2) Obiettivo
Raggiungi il target di **Valore Netto** del livello con il minor numero di **mosse**, mantenendo un **Flusso €/mossa** sostenibile.

## 3) Modalità di gioco
- **Classic:** 7 livelli fissi, sessioni rapide.  
- **Career:** 10 livelli (*Risparmio → Tycoon Finale*), KPI aggiuntivi (**Efficienza %**, **Reputazione ★**).  
- Selettore in alto **Classic | Career**. **Primo avvio = Career** (poi ricorda la scelta).

## 4) Comandi
**Laptop:** Frecce; `Ctrl/Cmd+Z` = Undo; `R` = Reset; **PLAY** per iniziare.  
**Smartphone:** Swipe sulla griglia o **D‑pad** (▲ ◀ ▶ ▼); **PLAY** su overlay mobile.

## 5) Legenda
🟡 Monete (+500€) · 🔷 Dividendo (+200€/mossa) · 🟣 Leva (+600€/mossa, −400€) · 🔴 Tassa (−800€) · 🟠 Inflazione (−200€/mossa) · 🔵 Asset inattivo → 🟢 attivo su 🟩 Goal (+100€/mossa ×5)

## 6) Regole economiche
- Incassi il **flow** ogni mossa.  
- Ogni **10 mosse**: se 0 asset attivi → −500€, altrimenti +200€ per asset attivo.  
- Ogni **7 mosse**: decadimento −100€/mossa (min 0).

## 7) Anti-grind (definitivo)
Zero incassi se **non** avviene un evento economico **e**: ritorno **A↔B** oppure **loop A→B→A**.  
✅ Incasso permesso se **spingi un asset** o **raccogli** $, D, L, T, I.

## 8) PWA
`sw.js?v=3.1.1` forza auto‑update senza svuotare cache. Manifest e icone **Orbital** (192/512).

## 9) Struttura
```
/
├─ index.html
├─ app.js
├─ sw.js
├─ manifest.webmanifest
├─ icons/
│  ├─ icon-192.png
│  └─ icon-512.png
└─ DualUniverse_Banner.png (opzionale da v3.1.0)
```

## 10) Changelog
- **v3.1.1**: layout **smartphone** dedicato (D‑pad + legende ai lati), performance e touch/swipe migliorati.
- **v3.1.0**: PWA unificata Classic+Career, anti-grind, overlay PLAY, flash visivo, icone Orbital.

## 11) Licenza & Crediti
MIT © 2025 pezzaliAPP
