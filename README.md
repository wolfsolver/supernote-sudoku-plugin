# Supernote Sudoku Maker 🧩

A smooth and high-performance plugin for **Supernote** devices, designed to generate instant Sudoku puzzles and insert them directly into your notes as PNG images.

> **Supernote** is a next-generation E-Ink device designed to provide a natural, distraction-free writing experience, blending the tactile feel of traditional paper with the digital versatility of an Android-based tablet. For more info, visit [supernote.com](https://supernote.com).

## ✨ Features
* **Infinite Generation**: Fetches fresh puzzles anytime via the Dosuku API.
* **Native Rendering**: Utilizes a custom **Android Kotlin** module to draw the grid, ensuring maximum sharpness and clarity on E-ink displays.
* **Seamless Integration**: Inserts the generated Sudoku directly into the current note page with a single click.
* **Timestamped**: Each puzzle includes the exact date and time of generation (DD/MM/YYYY hh:mm:ss) to help you track your progress.
* **Multilingual Support**: Includes a built-in language selector (EN/IT/CN) to adapt the interface to your preference.
  - [ ] prepare crowdin project for transation

### Screenshot
* ![Inside Plugin](https://raw.githubusercontent.com/wolfsolver/supernote-sudoku-plugin/refs/heads/main/screenshot/20260209_174117.png)
* ![Result in Note](https://raw.githubusercontent.com/wolfsolver/supernote-sudoku-plugin/refs/heads/main/screenshot/20260209_174150.png)

## 🛠️ Technical Architecture
The project leverages a hybrid architecture to maximize performance on Supernote hardware:
1. **Frontend**: React Native (TSX) with a custom localization helper for multi-language support.
2. **Native Bridge**: A custom Kotlin module (`SudokuNative`) that handles:
   - Android `Bitmap` creation.
   - Vector drawing of the grid and numbers.
   - Solid background rendering (anti-transparency) for better E-ink visibility.
   - Efficient saving to the local filesystem (`/storage/emulated/0/Note/...`).
3. **API**: Integration with `sn-plugin-lib` for device-level communication and image insertion.

## 📋 Prerequisites
* **Android SDK** & **JDK 17** (configured via `JAVA_HOME`).
* Supernote Plugin Toolchain installed.

## 🚀 How to Use
1. Open a note on your Supernote device.
2. Launch the **Sudoku Maker** plugin.
3. Click **NEW SUDOKU** to load a challenge.
4. Click **INSERT INTO NOTE**. The plugin will generate the PNG, save it, and automatically place it on your current page.

## 🤝 Contributing
Contributions are welcome! If you have ideas for new grid layouts or advanced features, feel free to open an Issue or a Pull Request.

