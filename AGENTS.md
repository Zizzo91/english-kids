# English Kids — Impara l'inglese giocando!

## Descrizione
Web app per bambini di 4+ anni per imparare vocaboli inglesi. Singolo `index.html` (HTML+CSS+JS vanilla, zero dipendenze), stesso approccio di `Toy Story Memory`. La parola viene mostrata con un'immagine animata e pronunciata con voce sintetica (Web Speech API `en-US`, lenta). Il bambino la ripete ad alta voce, poi preme il pulsante per rivelarla. Livelli progressivi fino alle combinazioni (es. **RED CAR**).

## File
- `index.html` — App completa (HTML+CSS+JS vanilla)
- `assets/img/` — Opzionale: metti `<parola>.png` (es. `cat.png`, `dog.png`, `car.png`) per usare le tue immagini al posto di quelle online. Cascata: `assets/img/<id>.png` → Twemoji CDN → emoji nativa.
- `assets/audio/` — Riservato per futuri audio personalizzati (non usato nell'MVP)

## Modalità (per livello)
1. **Impara 📖** — l'immagine appare con animazione e la voce pronuncia la parola. Pulsante 🔊 per riascoltare, frecce ◀️▶️, "Continua" passa alla modalità Dimmi tu.
2. **Dimmi tu 🎓** — stessa immagine, il genitore chiede "come si dice?", il bambino dice la parola ad alta voce e preme **Dimmi! 🎤** → la parola appare + la voce la ripete. Completando l'ultima carta → vittoria (confetti + stelle).
3. **Ascolta 👂** — mini-competenza: "Tocca il CAT" con 3 immagini. Feedback verde/rosso + suono.

## Livelli
| # | Categoria | Contenuto |
|---|-----------|-----------|
| 1 | Colori 🎨 | 21 chip: red, blue, green, yellow, orange, purple, pink, black, gray, brown, light blue, fuchsia, white, gold, silver, turquoise, lime, navy, coral, lavender, maroon |
| 2 | Numeri 🔢 | one → twenty (cifra grande + pallini del numero; a due cifre il carattere è più piccolo) |
| 3 | Animali 🐾 | cat, dog, bird, fish, horse, rabbit, duck, cow |
| 4 | Cibo 🍎 | apple, banana, bread, milk, cheese, egg, cake, ice cream |
| 5 | Famiglia 👨‍👩‍👧‍👦 | mom, dad, baby, brother, sister, grandma, grandpa, family |
| 6 | Combinazioni 🌈 | red car, blue bird, yellow duck, green apple, black dog, purple fish (emoji + chip colore) |

Avanzamento salvato in `localStorage` (`ek_max` = ultimo livello completato). **Tutti i livelli sono sempre sbloccati** (`isUnlocked()` restituisce sempre `true`): i completati mostrano ✓ (badge "Rigioca ✓"), gli altri "Gioca ▶". **Azzera progressi**: bottone 🔄 nel pannello impostazioni della Home (riporta `ek_max` a `-1`, toglie i ✓).

## Dati vocabolario (in index.html)
- `COLORS` (esagoni), `NUM_MAP` (cifra per i numeri), `ITEMS` (id, parola, emoji, codepoint Twemoji), `LEVELS` (6 livelli).
- Card semplici = stringhe (id); card composte = oggetti `{t:'compound', a:<colore>, b:<oggetto>}`.
- `cardVisualHtml()` restituisce il visual giusto per tipo: immagine / chip colore / numero / composto.
- Immagini: `assets/img/<id>.png` → `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/<tx>.png` → emoji. Fallback gestito con `onerror` (`nextImgStep()`).

## Audio / Voci
- Pronuncia: `speak()` usa `speechSynthesis` con voci inglesi. `pickVoice()` sceglie automaticamente la migliore con un punteggio di qualità (`voiceScore()`: preferisce voci premium/natural/neural/Google/Microsoft e nomi noti come Samantha/Aria/Jenny; esclude quelle "compact/legacy/Eddy").
- **Pronuncia forzata (`PRON`)**: alcune parole vengono lette male dal TTS. `cardSpeakText()` usa `PRON` per correggerle (es. `nineteen` → `nine-TEEN`, uguale per tutti i numeri 13–19: le maiuscole+trattino fanno stressare la sillaba giusta).
- **Pannello impostazioni in Home 🎙️**: selettore voce (tutte le voci inglesi disponibili nel browser, la consigliata ha ⭐) + velocità (lenta/media/normale) + bottone "▶️ Prova la voce". Scelte salvate in `localStorage` (`ek_voice`, `ek_rate`).
- Se la voce selezionata non esiste più, si torna automaticamente a "Migliore".
- Schermata iniziale e quando si cambia modalità (Impara → Dimmi tu) pronuncia frasi guida ("Now you say it!").
- Effetti: Web Audio oscillator per corretto/errore/vittoria (come Toy Story Memory). Vibrazione su risposta giusta/sbagliata.
- Muto: bottone 🔊 in alto (salvato in `ek_muted`).

## Come usare
Apri `index.html` nel browser (funziona anche da `file://`). Scegli un livello, tocca i pulsanti grandi. Online usa immagini emoji ad alta risoluzione (Twemoji CDN); offline c'è il fallback emoji nativa.

## Architettura (in index.html)
- Data: `COLORS`, `NUM_MAP`, `ITEMS`, `LEVELS`
- Stato: `curLevel`, `curMode` (learn|quiz|listen), `curIdx`, `quizRevealed`, `learningSeq`/`quizSeq`/`listenSeq`
- UI: `renderHome()`, `initLevel()`, `enterMode()`, `renderLearn()`, `renderQuiz()`, `renderListen()`, `listenPraise()`, `completeLevel()`, `showConfetti()`
- Progresso: `getMaxDone()` / `saveDone()` / `isUnlocked()` / `isDone()`
- Export debug: `window.EK`

## Note MVP e idee future
- MVP v1: pulsante interattivo al posto del riconoscimento vocale (scelta: più affidabile a 4 anni).
- Da migliorare: immagini reali per le combinazioni (foto di una macchina rossa vera), più livelli, modalità "dì la parola" con microfono (Web Speech Recognition), audio registrati nella voce del genitore in `assets/audio/`.