# Cashflow Rush — Arcade Puzzle Tycoon (PWA)

Versione: **v2.8.9** — Modalità **Laptop** / **Smartphone** / **Auto**

## Pitch
Cashflow Rush è un rompicapo arcade in cui spingi **asset** sulla griglia per attivarli, generare **cashflow** e raggiungere l’**obiettivo di Valore Netto** nel minor numero di **mosse**. Funziona **offline** come PWA e si avvia con un pulsante **PLAY** centrale.

## Come si gioca
- **Obiettivo:** raggiungi il target di **Valore Netto** prima possibile.
- **Mossa:** ogni mossa incassa (o perde) **cash** in base a regole e stato della griglia.
- **Attivazione asset:** spingi i blocchi **Asset** sui riquadri **Goal** per attivarli (rendono per alcuni turni).
- **Anti-grind:** andare avanti-indietro annulla le entrate di routine di quella mossa.
- **Fine livello:** al raggiungimento del target si passa automaticamente al livello successivo.

### Regole economiche
- **Monete (giallo)**: +500€ immediati.
- **Dividendo (blu)**: +200€/mossa + bonus combo (+1.000€ se presi ravvicinati).
- **Tassa/Debito (rosso)**: −800€.
- **Leva (viola)**: +600€/mossa al flow, −400€ al net. Early boost se prese 2 leve entro 10 mosse: **+1.500€/mossa** per 3 mosse.
- **Inflazione (arancio)**: −200€/mossa al flow.
- **Asset (azzurro/verde)**: attivo su **Goal** → +100€/mossa per 5 mosse.

### Ricorrenze/decadimenti
- Incassi sempre il **flow** corrente.
- Ogni **10 mosse**: se 0 asset attivi −500€, altrimenti +200€ per asset attivo.
- Ogni **7 mosse**: −100€/mossa al flow (min 0).

## Comandi
**Laptop**: Frecce; Ctrl/Cmd+Z = Undo; R = Reset; **PLAY** per iniziare.  
**Smartphone**: Swipe o D‑pad; **PLAY** sopra la griglia.

## Legenda
🟡 Monete · 🟣 Leva · 🟢 Asset attivo · 🔵 Asset inattivo · 🔷 Dividendo · 🟠 Inflazione · 🔴 Tassa · 🟩 Goal

## Livelli
1) Tutorial del Valore (5.000€) · 2) Leva & Tasse (15.000€) · 3) Scalata di Capitale (50.000€) · 4) Rendita a Cascata (120.000€) · 5) Debito Creativo (200.000€) · 6) Inflazione Cattiva (250.000€) · 7) Tycoon Finale (500.000€)

## PWA
Installabile, offline-first con **Service Worker**, **auto-update** quando cambia versione (`?v=`).

## Changelog
- **v2.8.9**: fix **PLAY** (parte subito); mobile 3‑col (legenda verticale ai lati del D‑pad).
- v2.8.8: pulsante PLAY + legenda verticale.
- v2.8.7: D‑pad più in alto; fix haptics; desktop invariato.

## Licenza
MIT © 2025 pezzaliAPP
