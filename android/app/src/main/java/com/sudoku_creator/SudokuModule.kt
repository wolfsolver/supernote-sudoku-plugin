package com.sudoku_creator

import android.graphics.*
import android.util.Log
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream

class SudokuModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SudokuNative"

    @ReactMethod
    fun generateAndSaveSudoku(gridArray: ReadableArray, difficulty: String, date: String, promise: Promise) {
        try {
            val size = 600
            val bitmap = Bitmap.createBitmap(size, size + 150, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            val paint = Paint()

            // Sfondo Bianco
            canvas.drawColor(Color.WHITE)

            // Configurazione Testo e Linee
            paint.color = Color.BLACK
            paint.isAntiAlias = true
            
            // 1. DISEGNO HEADER
            paint.textSize = 24f
            paint.typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
            canvas.drawText("LIVELLO: ${difficulty.uppercase()}", 40f, 60f, paint)

			// Disegna Data e Ora a destra (allineamento manuale o cambia Align)
			paint.textAlign = Paint.Align.RIGHT
			canvas.drawText(date, 570f, 60f, paint) // 570f è vicino al bordo destro (600)

			// Ripristina l'allineamento per i numeri della griglia dopo
			paint.textAlign = Paint.Align.CENTER			
			
            // 2. DISEGNO GRIGLIA
            val startY = 100f
            val startX = 30f
            val cellSize = 60f

            for (i in 0..9) {
                paint.strokeWidth = if (i % 3 == 0) 5f else 2f
                // Linee Orizzontali
                canvas.drawLine(startX, startY + i * cellSize, startX + 9 * cellSize, startY + i * cellSize, paint)
                // Linee Verticali
                canvas.drawLine(startX + i * cellSize, startY, startX + i * cellSize, startY + 9 * cellSize, paint)
            }

            // 3. INSERIMENTO NUMERI
            paint.textSize = 34f
            paint.textAlign = Paint.Align.CENTER
            
            for (row in 0..8) {
				// Usiamo ?.let per assicurarci che la riga non sia nulla
					gridArray.getArray(row)?.let { rowData ->
						for (col in 0..8) {
							val value = rowData.getInt(col)
							if (value != 0) {
								val x = startX + col * cellSize + cellSize / 2
								val y = startY + row * cellSize + cellSize / 2 + 12f 
								canvas.drawText(value.toString(), x, y, paint)
							}
						}
					}
            }

            // 4. SALVATAGGIO FILE
            val path = "/storage/emulated/0/Note/SudokuImg/sudoku_export.png"
            val file = File(path)
            file.parentFile?.mkdirs()
            
            FileOutputStream(file).use { out ->
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
            }

            promise.resolve(path)
        } catch (e: Exception) {
            promise.reject("ERR_NATIVE_GEN", e.message)
        }
    }
}