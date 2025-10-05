# 🟩 Cashflow Rush — Arcade Puzzle Tycoon (PWA)

**PWA offline, open source, MIT — © 2025 pezzaliAPP**

Un rompicapo stile *Sokoban* con una twist finanziaria: spingi gli **Asset** sui pad **Goal** per attivarli e costruire **cashflow**. Ogni mossa può generare (o bruciare) valore. Raggiungi il **target** di Valore Netto nel minor numero di mosse.

## Come si gioca
- **Player**: quadrato bianco — muovi con **frecce** o **swipe**.
- **Asset (blu/verde)**: blocchi spingibili; se posati sui **Goal verdi**, diventano **attivi**.
- **Monete**: +500€ immediati.
- **Dividendo**: aumenta il **cashflow**.
- **Tassa/Debito**: -800€ istantanei.
- **Leva**: +600€/mossa ma -400€ subito. Usala con criterio.
- **Inflazione**: riduce il cashflow.
- **Ogni 5 mosse**: ogni asset **attivo** aggiunge **+500€/mossa** (compounding).
- **Ogni 7 mosse**: inflazione periodica riduce leggermente il cashflow.
- Vinci quando **Valore Netto ≥ Target**.

## PWA
- **Installa**: da Chrome/Edge/Android "Aggiungi alla Home". Su iOS apri in Safari e usa **Condividi → Aggiungi alla schermata Home**.
- **Offline**: funziona senza rete grazie al *service worker* cache‑first.

## Struttura
```
CashflowRushPWA/
  index.html
  app.js
  manifest.webmanifest
  sw.js
  icons/
    icon-192.png
    icon-512.png
```

## Licenza
MIT — usa, modifica, condividi. Cita la fonte se ti va: *pezzaliAPP*.

- v2.8.7: mobile rifinito (D-pad più in alto, legenda split centrata), disattivato suono di fallback haptics; desktop invariato.
