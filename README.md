# Cashflow Rush — Arcade Puzzle Tycoon (PWA)
**Versione:** v2.8.10 (stabile) — **Dual Mode** Laptop/Smartphone — PWA offline-first con auto-update

## Pitch
Spingi gli **Asset** sulla griglia per attivarli, genera **cashflow** e raggiungi l’**Obiettivo di Valore Netto** con meno **mosse** possibili. PWA con overlay **PLAY**.

## Dati sempre visibili
- **Valore Netto** · **Flusso €/mossa** · **Mosse** · **Obiettivo** (es. 50.000€)

## Comandi
**Laptop:** Frecce; `Ctrl/Cmd+Z` = Undo; `R` = Reset; **PLAY** per iniziare.  
**Smartphone:** Swipe o **D‑pad**; **PLAY** sull’overlay. Legenda verticale ai lati del D‑pad.

## Legenda
🟡 Monete (+500€) · 🔷 Dividendo (+200€/mossa) · 🟣 Leva (+600€/mossa, −400€) · 🔴 Tassa (−800€) · 🟠 Inflazione (−200€/mossa) · 🔵 Asset inattivo → 🟢 attivo su 🟩 Goal (+100€/mossa ×5)

## Regole economiche
- Incassi il **flow** ogni mossa.  
- Ogni **10 mosse**: se 0 asset attivi → −500€, altrimenti +200€ per asset attivo.  
- Ogni **7 mosse**: decadimento −100€/mossa (min 0).

## **Anti‑grind (definitivo)**
Nessun incasso ricorrente se **non** avviene un evento economico **e**:
- fai una mossa di **ritorno** immediato (A↔B), **oppure**
- torni su una casella visitata **nelle ultime 2 mosse** (loop A→B→A).  
Spingere un **asset** o raccogliere **$ / D / L / T / I** abilita comunque l’incasso di quella mossa.

## Livelli
Tutorial del Valore · Leva & Tasse · Scalata di Capitale · Rendita a Cascata · Debito Creativo · Inflazione Cattiva · Tycoon Finale

## PWA
`sw.js?v=2.8.10` forza l’**auto‑update**; nessun bisogno di svuotare la cache.

## Licenza
MIT © 2025 pezzaliAPP
