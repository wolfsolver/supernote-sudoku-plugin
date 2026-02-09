import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator, 
  NativeModules 
} from 'react-native';
import { PluginManager, PluginNoteAPI } from 'sn-plugin-lib';

const BG = '#FFFFFF';
const { SudokuNative } = NativeModules;

const PLUGIN_INFO = {
  name: "Sudoku Maker",
  author: "WolfSolver"
};

export default function App() {
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [gameInfo, setGameInfo] = useState({ level: '', date: '' });
  const [loading, setLoading] = useState(false);

  // Caricamento automatico e test bridge nativo
  useEffect(() => {
    console.log("[SUDOKU] App avviata");
    if (SudokuNative) {
      console.log("[SUDOKU] SUCCESS: Bridge nativo SudokuNative pronto.");
    } else {
      console.warn("[SUDOKU] WARNING: Bridge nativo non trovato.");
    }
    fetchSudoku();
  }, []);


const getFormattedDate = () => {
  const now = new Date();
  const date = now.toLocaleDateString('it-IT'); // DD/MM/YYYY
  const time = now.toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  return `${date} ${time}`;
}

  const fetchSudoku = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      const data = await response.json();
      const puzzle = data.newboard.grids[0];
      
      setGrid(puzzle.value);
      setGameInfo({
        level: puzzle.difficulty,
        date: getFormattedDate()
      });
    } catch (e: any) {
      console.error("[SUDOKU] Fetch Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToNote = async () => {
    if (!grid || !SudokuNative) {
      console.error("[SUDOKU] Impossibile esportare: dati o bridge mancanti");
      return;
    }

    setLoading(true);
    try {
      console.log("[SUDOKU] Avvio generazione nativa...");
      
      // 1. Chiamata al modulo Kotlin per generare il PNG
      const pathGenerato = await SudokuNative.generateAndSaveSudoku(
        grid, 
        gameInfo.level, 
        gameInfo.date
      );

      console.log("[SUDOKU] Immagine salvata in: " + pathGenerato);

      // 2. Inserimento dell'immagine nella nota attiva
      const res = await PluginNoteAPI.insertImage(pathGenerato);
      
      if (res.success) {
        console.log("[SUDOKU] Inserimento completato con successo!");
        PluginManager.closePluginView();
      } else {
        console.error("[SUDOKU] Errore API Note: " + res.error?.message);
      }
    } catch (e: any) {
      console.error("[SUDOKU] Errore processo nativo: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* HEADER TASTI */}
      <View style={styles.buttonRow}>
        <Pressable 
          onPress={() => PluginManager.closePluginView()} 
          style={[styles.topButton, { flex: 1, marginRight: 5 }]}
        >
          <Text style={styles.buttonText}>CHIUDI</Text>
        </Pressable>

        <Pressable 
          onPress={fetchSudoku} 
          style={[styles.topButton, { flex: 2 }]} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "..." : "NUOVO SUDOKU"}
          </Text>
        </Pressable>
      </View>

      <Pressable 
        onPress={handleExportToNote} 
        style={[styles.exportButton, loading && styles.disabledButton]}
        disabled={loading || !grid}
      >
        <Text style={styles.exportButtonText}>
          {loading ? "ELABORAZIONE..." : "INSERISCI NELLA NOTA"}
        </Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.center}>
        {loading && !grid ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Generazione griglia...</Text>
          </View>
        ) : grid && (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.infoText}>LIVELLO: {gameInfo.level.toUpperCase()}</Text>
              <Text style={styles.infoText}>{gameInfo.date}</Text>
            </View>

            <View style={styles.gridBoard}>
              {grid.map((row, i) => (
                <View key={`row-${i}`} style={styles.row}>
                  {row.map((cell, j) => (
                    <View 
                      key={`cell-${i}-${j}`} 
                      style={[
                        styles.cell,
                        {
                          borderBottomWidth: (i + 1) % 3 === 0 && i < 8 ? 3 : 1,
                          borderRightWidth: (j + 1) % 3 === 0 && j < 8 ? 3 : 1,
                        }
                      ]}
                    >
                      <Text style={styles.cellText}>{cell !== 0 ? cell : ''}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            
            <Text style={styles.footer}>
              {PLUGIN_INFO.name} v1.0 | {PLUGIN_INFO.author}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG, padding: 15 },
  buttonRow: { flexDirection: 'row', marginBottom: 10 },
  topButton: { 
    borderWidth: 2, 
    borderColor: '#000', 
    padding: 12, 
    alignItems: 'center',
    backgroundColor: '#F0F0F0'
  },
  exportButton: {
    borderWidth: 3,
    borderColor: '#000',
    padding: 18,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  exportButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  center: { alignItems: 'center' },
  container: { alignItems: 'center' },
  loadingContainer: { marginTop: 100, alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 18, fontWeight: 'bold' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: 576, 
    marginBottom: 10 
  },
  infoText: { fontSize: 16, fontWeight: 'bold' },
  gridBoard: { borderWidth: 3, borderColor: '#000' },
  row: { flexDirection: 'row' },
  cell: { 
    width: 64, 
    height: 64, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderColor: '#000' 
  },
  cellText: { fontSize: 36, fontWeight: 'bold', color: '#000' },
  footer: { 
    marginTop: 20, 
    fontSize: 16, 
    fontStyle: 'italic', 
    color: '#666'
  }
});