# Cashflow Rush — Career Edition (v3.1.0-career)

Arcade rompicapo finanziario in stile “push-box” con progressione a 10 livelli.
Ottimizzato per Laptop (tastiera) e Smartphone (touch + D-pad). Funziona offline come PWA.

⸻

## Come si gioca (in breve)
	•	Sposta il personaggio sulla griglia, spingendo gli Asset (blu) verso i Goal (verdi) per attivarli e generare rendite.
	•	Raccogli eventi economici:
	•	Monete ($) → +500 Valore Netto
	•	Dividendo (D) → +200 Flusso €/mossa
	•	Leva (L) → +600 Flusso, ma −400 Valore Netto
	•	Inflazione (I) → −200 Flusso
	•	Tassa (T) → −800 Valore Netto
	•	Ogni mossa incassa il tuo Flusso. Gli Asset attivi danno extra per alcune mosse.
	•	Completa il livello raggiungendo l’Obiettivo (Valore Netto).

Anti-grind: niente incassi se ti muovi avanti/indietro in loop brevi senza alcun evento (raccolta/asset spinto).

⸻

## Simboli & Legenda
	•	🟡 Monete: '$'
	•	🔵 Dividendo: 'D'
	•	🟣 Leva: 'L'
	•	🟠 Inflazione: 'I'
	•	🔴 Tassa: 'T'
	•	🟦 Asset: 'A' (spingibile; su Goal diventa attivo)
	•	🟩 Goal: 'G' (attiva Asset sovrapposto)
	•	⬛ Muro: '#' (blocco)

⸻

## KPI (sempre visibili)
	•	Valore Netto — capitale cumulato (target del livello).
	•	Flusso €/mossa — entrata netta applicata ad ogni mossa.
	•	Mosse — contatore mosse effettuate.
	•	Obiettivo — traguardo di Valore Netto da raggiungere.
	•	Efficienza — stima % ≈ (Netto/Mosse)/10.
	•	Reputazione ★ — +1 stella quando completi il livello senza chiudere mai in negativo.

Su smartphone è presente anche il pulsante 📊 Report con il riepilogo live (livello, obiettivo, netto, flusso, mosse, efficienza, reputazione).

⸻

## Livelli (Career Mode)
	1.	Risparmio — target 5.000€
	2.	Investimento — 15.000€
	3.	Leva Finanziaria — 30.000€
	4.	Inflazione — 50.000€
	5.	Speculazione — 80.000€
	6.	Diversificazione — 120.000€
	7.	Crisi — 150.000€
	8.	Ripresa — 220.000€
	9.	Bolla — 350.000€
	10.	Tycoon Finale — 1.000.000€

La disposizione è generata da seed fissi, così il layout è stabile tra sessioni.

⸻

## Controlli

Laptop
	•	Frecce: ↑ ↓ ← → per muoverti/spingere Asset
	•	R: ricarica livello
	•	Ctrl/Cmd + Z: Undo ultima mossa
	•	Pulsanti in header: Reset, Undo, 📈 Livelli, 🔊/🔇

Smartphone
	•	PLAY per iniziare (sblocca audio)
	•	D-pad (▲ ◀ ▶ ▼) o Swipe sul canvas
	•	📊 Report per riepilogo in qualsiasi momento

⸻

## PWA: installazione & aggiornamenti
	•	Installabile su iOS/Android/desktop tramite “Aggiungi alla Home/Installa app”.
	•	Aggiornamento automatico: il Service Worker invalida la cache quando cambia la versione (v3.1.0-career).
	•	In index.html i file sono referenziati con query ?v=3.1.0-career.
	•	In sw.js l’identificativo VER è 3.1.0-career.
	•	All’install/attivazione, il SW invia SW_UPDATED e forza il reload della pagina.

Se noti risorse stale: apri l’app, attendi 2 refresh. Non serve svuotare la cache manualmente.

⸻

## Struttura file (essenziali)

/index.html            # UI desktop/mobile, KPI, D-pad, PLAY, Report
/app.js                # Motore Career + anti-grind + Game.nudge + KPI dual
/dual.js               # Adattatore device (auto/desktop/mobile), swipe, bind PLAY
/sw.js                 # Service Worker con cache-busting e auto-reload
/manifest.webmanifest  # Metadati PWA
/icons/icon-192.png
/icons/icon-512.png
/README.md


⸻

## Note di bilanciamento (default)
	•	Monete: +500 Netto
	•	Dividendo: +200 Flusso
	•	Leva: +600 Flusso, −400 Netto
	•	Inflazione: −200 Flusso
	•	Tassa: −800 Netto
	•	Asset attivo: +100 Netto/mossa per un numero limitato di mosse (si “scarica”)
	•	Ogni 7 mosse il Flusso si riduce di 100 (decadimento)

⸻

## Anti-grind (dettaglio)

Non sono conteggiati incassi di Flusso/Asset quando:
	•	ti muovi indietro esattamente rispetto all’ultima direzione, senza raccogliere niente e senza spingere Asset;
	•	esegui un micro-loop A→B→A senza evento economico/spinta.

Lo scopo è evitare che si farmi “a vuoto”.

⸻

## Reset & Progressi
	•	📈 Livelli: salta a un livello (mostra elenco e target).
	•	↺ Restart Career: azzera Livello e Reputazione (conferma richiesta).
	•	I progressi sono salvati in localStorage (cfr.level, cfr.rep, cfr.muted, du.mode).

⸻

## Build/Deploy
	1.	Copia la cartella su un web server statico (HTTPS consigliato).
	2.	Assicurati che i MIME type siano corretti (JS/JSON/PNG/Web Manifest).
	3.	Mantieni coerenti i version query in index.html e il VER in sw.js.
	4.	Al rilascio, incrementa la versione (es. 3.1.1-career) nei tre punti:
	•	index.html → dual.js?v=…, app.js?v=…, sw.js?v=…
	•	sw.js → const VER='…'
	•	(opzionale) <title> per riconoscere la build.

⸻

## License

MIT © 2025 pezzaliAPP

⸻

## Changelog (estratto)
	•	v3.1.0-career
	•	Modalità Career stabile (10 livelli).
	•	D-pad & Swipe su smartphone (iOS safe) via Game.nudge.
	•	KPI sincronizzati su desktop e mobile (Netto/Flusso/Mosse/Obiettivo + Efficienza/★).
	•	Report in-app (📊).
	•	Anti-grind attivo.
	•	PWA con auto-update (SW cache-busting + reload).

⸻

## Troubleshooting
	•	PLAY non parte su iPhone: tocca il canvas o il tasto PLAY una volta (serve per sbloccare l’audio WebKit).
	•	Niente suoni: verifica il tasto 🔊/🔇, volume del dispositivo e modalità silenziosa.
	•	Aggiornamento non si vede: apri l’app e attendi due refresh (il SW installa e forza il reload).
	•	Lag/resize su mobile: usa il selettore Auto/Smartphone.
