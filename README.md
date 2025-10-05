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
