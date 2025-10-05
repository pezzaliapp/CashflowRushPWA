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

---

### 🎮 Livelli disponibili
1. **Tutorial del Valore** — Introduzione al movimento e ai simboli.
2. **Leva & Tasse** — Prime scelte di rischio/rendimento.
3. **Scalata di Capitale** — Gestione del cashflow in crescita.
4. **Rendita a Cascata** — Asset a consumo e combinazioni.
5. **Debito Creativo** — Trade-off tra debito e ROI.
6. **Inflazione Cattiva** — Shock negativi da compensare.
7. **Tycoon Finale** — Target massimo e pianificazione perfetta.

---

**Changelog sintetico**
- v2.8.6: ripristinata UI **Laptop** (2 colonne, niente D‑pad); **Mobile** centrato e ingrandito; audio + haptics; SW auto-update.
- v2.8.5: aggiunte vibrazioni (Android) + fix audio iOS.
- v2.8.4: layout mobile rifatto, canvas adattivo, auto-update aggressivo.
