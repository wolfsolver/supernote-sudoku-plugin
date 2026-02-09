# Supernote Sudoku Maker 🧩

A smooth and high-performance plugin for **Supernote** devices, designed to generate instant Sudoku puzzles and insert them directly into your notes as PNG images.

## ✨ Features
* **Infinite Generation**: Fetches fresh puzzles anytime via the Dosuku API.
* **Native Rendering**: Utilizes a custom **Android Kotlin** module to draw the grid, ensuring maximum sharpness and clarity on E-ink displays.
* **Seamless Integration**: Inserts the generated Sudoku directly into the current note page with a single click.
* **Timestamped**: Each puzzle includes the exact date and time of generation (DD/MM/YYYY hh:mm:ss) to help you track your progress.

## 🛠️ Technical Architecture
The project leverages a hybrid architecture to maximize performance on Supernote hardware:
1. **Frontend**: React Native (TSX) for a clean and responsive user interface.
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

