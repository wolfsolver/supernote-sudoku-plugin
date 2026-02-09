# Supernote Sudoku Maker 🧩

Un plugin fluido e performante per dispositivi **Supernote**, progettato per generare puzzle Sudoku istantanei e inserirli direttamente nelle tue note come immagini PNG.

## ✨ Caratteristiche
* **Generazione Infinita**: Recupera puzzle sempre nuovi tramite l'API Dosuku.
* **Rendering Nativo**: Utilizza un modulo **Android Kotlin** personalizzato per disegnare la griglia, garantendo massima nitidezza sui display E-ink.
* **Integrazione Totale**: Inserisce il Sudoku generato direttamente nella pagina della nota corrente con un solo clic.
* **Timestamp**: Ogni puzzle include data e ora di generazione (DD/MM/YYYY hh:mm:ss) per tracciare i tuoi progressi.

## 🛠️ Architettura Tecnica
Il progetto sfrutta un'architettura ibrida per massimizzare le prestazioni sull'hardware Supernote:
1. **Frontend**: React Native (TSX) per un'interfaccia utente reattiva e pulita.
2. **Bridge Nativo**: Un modulo Kotlin (`SudokuNative`) che gestisce:
   - La creazione di una `Bitmap` Android.
   - Il disegno vettoriale della griglia e dei numeri.
   - Il salvataggio efficiente nel filesystem locale (`/storage/emulated/0/Note/...`).
3. **API**: Integrazione con `sn-plugin-lib` per la comunicazione con il sistema operativo del dispositivo.


## Prerequisiti
* **Android SDK** & **JDK 17** (configurata via `JAVA_HOME`).
* Supernote Plugin Toolchain installata.

# 📖 Utilizzo
- Apri una nota sul tuo Supernote.
- Avvia il plugin Sudoku Maker.
- Clicca su NUOVO SUDOKU per caricare una sfida.
- Clicca su INSERISCI NELLA NOTA. Il plugin genererà il PNG, lo salverà e lo posizionerà automaticamente sulla tua pagina.
