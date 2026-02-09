import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { PluginManager, PluginNoteAPI } from 'sn-plugin-lib';

const BG = '#FFFFFF';

// Metadati del plugin (puoi aggiornarli in base al tuo manifest)
const PLUGIN_INFO = {
  name: "Sudoku Maker",
  author: "WolfSolver"
};

export default function App() {
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [gameInfo, setGameInfo] = useState({ level: '', date: '' });
  const [loading, setLoading] = useState(false);

  // 2) Caricamento automatico all'apertura
  useEffect(() => {
    fetchSudoku();
  }, []);

  const fetchSudoku = async () => {
    // 1) Messaggio di caricamento
    setLoading(true);
    console.log("[SUDOKU] Fetching data...");
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      const data = await response.json();
      const puzzle = data.newboard.grids[0];
      
      setGrid(puzzle.value);
      setGameInfo({
        level: puzzle.difficulty,
        date: new Date().toLocaleDateString('it-IT')
      });
      console.log("[SUDOKU] Loaded: " + puzzle.difficulty);
    } catch (e: any) {
      console.error("[SUDOKU] Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

	const testInsertImage = async () => {
	  // Il percorso dove SUPPONIAMO di aver salvato l'immagine
	  // Nota: Usiamo il percorso indicato nell'esempio dell'SDK per sicurezza
	  const pngPath = "/storage/emulated/0/Note/SudokuImg/sudoku_20260101.png";

	  console.log(`[SUDOKU] Tentativo inserimento immagine da: ${pngPath}`);

	  try {
		// Chiamata all'API di Supernote
		const res = await PluginNoteAPI.insertImage(pngPath);

		if (res.success) {
		  console.log("[SUDOKU] Inserimento riuscito!");
		  // Magari chiudiamo il plugin dopo l'inserimento per tornare alla nota
		  PluginManager.closePluginView(); 
		} else {
		  console.error("[SUDOKU] L'API ha risposto con errore:", res.error?.message);
		}
	  } catch (e: any) {
		console.error("[SUDOKU] Eccezione durante insertImage:", e.message);
	  }
	};


  return (
    <View style={styles.root}>
      {/* RIGA 1: CHIUDI */}
      <Pressable onPress={() => PluginManager.closePluginView()} style={styles.topButton}>
        <Text style={styles.buttonText}>CHIUDI APPLICAZIONE</Text>
      </Pressable>

      {/* RIGA 2: NUOVO SUDOKU */}
      <Pressable onPress={fetchSudoku} style={styles.topButton} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "CARICAMENTO..." : "GENERA NUOVO SUDOKU"}</Text>
      </Pressable>

      {/* RIGA 3: TEST */}
      <Pressable onPress={testInsertImage} style={styles.topButton} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "CARICAMENTO..." : "TEST SALVA IMMAGINE"}</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.center}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Caricamento in corso...</Text>
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
                          borderBottomWidth: (i + 1) % 3 === 0 && i < 8 ? 3 : 1, // Linee spesse orizzontali
                          borderRightWidth: (j + 1) % 3 === 0 && j < 8 ? 3 : 1,  // Linee spesse verticali
                        }
                      ]}
                    >
                      <Text style={styles.cellText}>{cell !== 0 ? cell : ''}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            
            {/* 3) e 4) Footer ingrandito con Info Plugin */}
            <Text style={styles.footer}>
              {PLUGIN_INFO.name} by {PLUGIN_INFO.author}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG, padding: 10 },
  topButton: { 
    borderWidth: 2, 
    borderColor: '#000', 
    padding: 15, 
    marginBottom: 10, 
    alignItems: 'center' 
  },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  center: { alignItems: 'center' },
  container: { marginTop: 10, alignItems: 'center' },
  loadingContainer: { marginTop: 50, alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: 576, // 64 * 9
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
    fontSize: 16, // 3) Font ingrandito
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#000'
  }
});