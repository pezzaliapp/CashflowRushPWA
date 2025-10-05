# 💼 Cashflow Rush — Career Edition (v3.1.4)

Arcade rompicapo finanziario in stile “push-box”, con progressione a 10 livelli di difficoltà crescente.  
Ottimizzato per **Laptop (tastiera)** e **Smartphone (touch + D-pad)**.  
Funziona **offline** come Progressive Web App (PWA).

---

## 🎮 Come si gioca
Sposta il personaggio sulla griglia e spingi gli **Asset (blu)** verso i **Goal (verdi)** per attivarli e generare rendite passive.

### Eventi economici:
| Simbolo | Evento | Effetto |
|:--|:--|:--|
| 💰 `$` | Monete | +500 Valore Netto |
| 💧 `D` | Dividendo | +200 Flusso €/mossa |
| ⚙️ `L` | Leva | +600 Flusso, −400 Valore Netto |
| 🔥 `I` | Inflazione | −200 Flusso |
| 💸 `T` | Tassa | −800 Valore Netto |

Ogni mossa incassa il tuo **Flusso €/mossa**.  
Gli Asset attivati su un Goal generano extra per alcune mosse.

🎯 Completa il livello raggiungendo l’**Obiettivo (Valore Netto)**.

> ⚖️ *Anti-grind attivo:* nessun incasso se ripeti micro-loop avanti/indietro senza raccogliere eventi o spingere asset.

---

## 🧭 Simboli & Legenda
| Colore | Simbolo | Significato |
|:--|:--|:--|
| 🟡 | `$` | Monete |
| 🔵 | `D` | Dividendo |
| 🟣 | `L` | Leva Finanziaria |
| 🟠 | `I` | Inflazione |
| 🔴 | `T` | Tassa |
| 🟩 | `G` | Goal (attiva Asset sovrapposto) |
| 🟦 | `A` | Asset spingibile |
| ⬛ | `#` | Muro |

---

## 📊 KPI in tempo reale
| KPI | Descrizione |
|:--|:--|
| **Valore Netto** | Capitale cumulato (target del livello). |
| **Flusso €/mossa** | Entrata netta per ogni mossa. |
| **Mosse** | Numero di mosse effettuate. |
| **Obiettivo** | Traguardo da raggiungere per completare il livello. |
| **Efficienza** | Indicatore % ≈ (Netto/Mosse)/10. |
| **Reputazione ★** | +1 stella se completi il livello senza mai chiudere in negativo. |

Su **smartphone** è incluso il pulsante **📊 Report** che mostra il riepilogo di:
Livello, Obiettivo, Valore Netto, Flusso, Mosse, Efficienza e Reputazione.

---

## 🏁 Livelli (Career Mode)
| # | Nome | Target |
|:-:|:--|--:|
| 1 | Risparmio | 5.000€ |
| 2 | Investimento | 15.000€ |
| 3 | Leva Finanziaria | 30.000€ |
| 4 | Inflazione | 50.000€ |
| 5 | Speculazione | 80.000€ |
| 6 | Diversificazione | 120.000€ |
| 7 | Crisi | 150.000€ |
| 8 | Ripresa | 220.000€ |
| 9 | Bolla | 350.000€ |
| 10 | Tycoon Finale | 1.000.000€ |

> Layout e generazione griglia sono deterministici (seed fissi), garantendo stabilità tra sessioni.

---

## ⌨️ / 📱 Controlli

### Laptop
- **Frecce** — Muoviti / spingi Asset  
- **R** — Ricarica livello  
- **Ctrl/Cmd + Z** — Undo ultima mossa  
- **Toolbar** — Reset, Undo, 📈 Livelli, 🔊/🔇 Audio, 📊 Report  

### Smartphone
- **PLAY** — Inizia la partita (sblocca audio su iOS)  
- **D-pad (▲ ◀ ▶ ▼)** o **Swipe** sul canvas  
- **📊 Report** — Mostra riepilogo livello  

---

## 📱 Suggerimento iOS: Aggiungi alla Home
Su iPhone/iPad, per un’esperienza fluida e con audio attivo:
1. Tocca **Condividi (⬆️)** nella barra in basso  
2. Seleziona **“Aggiungi alla schermata Home”**  
3. Apri l’icona **Cashflow Rush** appena creata  

> Funziona anche **offline** come una vera App. 🚀

L’overlay di guida appare **solo la prima volta** se l’app non è ancora installata come PWA.

---

## ⚙️ PWA — Installazione & Aggiornamenti
- Installabile su iOS, Android e Desktop  
- **Aggiornamento automatico:** il Service Worker aggiorna i file quando rileva una nuova versione  
- Versione attuale: **v3.1.4**  
- In `index.html`, `app.js`, `dual.js`, `sw.js` è usata la query `?v=3.1.4`  
- Il Service Worker invia `SW_UPDATED` e forza il refresh automatico

> Se noti risorse non aggiornate: apri l’app, attendi due refresh — non serve svuotare la cache manualmente.

---

## 📂 Struttura File

/index.html
→ UI desktop/mobile, KPI, D-pad, PLAY, Report, overlay iOS

/app.js
→ Motore Career + Anti-grind + KPI + gestione asset

/dual.js
→ Adattatore device (auto, desktop, mobile) + swipe

/sw.js
→ Service Worker cache-busting + auto-reload

/manifest.webmanifest
→ Metadati PWA

/icons/icon-192.png
/icons/icon-512.png
→ Icone per installazione

/README.md
→ Documentazione tecnica

---

## ⚖️ Parametri di Gioco (default)
| Evento | Effetto |
|:--|:--|
| Monete | +500 Netto |
| Dividendo | +200 Flusso |
| Leva | +600 Flusso, −400 Netto |
| Inflazione | −200 Flusso |
| Tassa | −800 Netto |
| Asset attivo | +100 Netto/mossa per un numero limitato di mosse |
| Decadimento | ogni 7 mosse il Flusso si riduce di 100 |

---

## 🚫 Anti-Grind
Il sistema disattiva guadagni da flusso/asset se:
- ti muovi indietro immediatamente rispetto alla direzione precedente,  
- oppure esegui un micro-loop A→B→A senza raccogliere o spingere asset.  

Serve a mantenere la sfida pulita, evitando farming.

---

## 🧩 Progressi e Reset
- **📈 Livelli** — Salta a un livello specifico  
- **↺ Restart Career** — Azzera progressi e reputazione  
- I progressi sono salvati localmente:
  - `cfr.level`, `cfr.rep`, `cfr.muted`, `du.mode`

---

## 🚀 Deploy / Hosting
1. Copia la cartella su un server statico (HTTPS consigliato)  
2. Assicurati di servire correttamente MIME type (JS, JSON, PNG, Webmanifest)  
3. Aggiorna le query di versione (`?v=`) in `index.html`, `sw.js` e `dual.js`  
4. Incrementa la versione in:
   - `<title>` e file JS
   - `const VER` in `sw.js`

---

## 🧾 License
MIT © 2025 **pezzaliAPP**

---

## 🧠 Changelog (estratto)
- **v3.1.4**
  - Legenda visiva desktop migliorata  
  - Overlay iOS “Aggiungi alla Home” automatico  
  - Sincronizzazione KPI e Report  
  - Fix asset + touchpad responsive  
  - PWA robusta con auto-update

- **v3.1.0-career**
  - Career Mode stabile (10 livelli)  
  - D-pad + Swipe su iPhone (Game.nudge)  
  - Report in-app (📊)  
  - Anti-grind attivo  
  - Service Worker con cache-busting e reload

---

## 🧾 Dichiarazione di Originalità e Copyright

**💼 Cashflow Rush — Career Edition** è un progetto originale sviluppato da **Alessandro Pezzali (pezzaliAPP)**.  
Non esiste alcun titolo identico o equivalente pubblicato o registrato con lo stesso nome, regole o struttura.

Il gioco si ispira liberamente al genere **Sokoban** (Hiroyuki Imabayashi, 1981), ma l’ispirazione è puramente meccanica (spostamento e spinta di oggetti in una griglia).  
Tutti gli altri elementi — **tema economico-finanziario, KPI, modalità Career, sistema anti-grind, interfaccia PWA e finalità educativa** — sono opere inedite e frutto di sviluppo autonomo.

### 🔹 Elementi distintivi e originali
1. **Tema e semantica** — Asset, monete, tasse, inflazione, dividendi e leva sostituiscono i blocchi tradizionali, introducendo significato economico e didattico.  
2. **Career Mode** — Progressione con indicatori reali: *Valore Netto, Flusso €/mossa, Efficienza, Reputazione ★*.  
3. **Motore anti-grind** — Prevenzione automatica di loop e micro-mosse senza valore economico.  
4. **Architettura PWA** — Gioco installabile e offline-first, adattivo per mobile e desktop.  
5. **Finalità educativa** — Serious game per l’apprendimento dei principi di finanza personale e gestione delle risorse.

### 🔹 Status legale
- ✅ **Originale e non derivativo**: nessun codice, grafica o asset proviene da opere terze.  
- ✅ **Titolarità completa** del nome, codice sorgente, logica, interfaccia e contenuti.  
- ✅ **Licenza MIT**: il codice è open source, liberamente utilizzabile e modificabile nel rispetto dei termini.  
- 🚫 **Nessun uso di materiali protetti** (marchi, loghi, colonne sonore, elementi grafici commerciali).

---

📍 **Autore:** [Alessandro Pezzali](https://www.alessandropezzali.it)  
**Progetto:** [pezzaliAPP.com](https://www.pezzaliapp.com)  
**Licenza:** MIT — opera originale, open source e a scopo educativo.
