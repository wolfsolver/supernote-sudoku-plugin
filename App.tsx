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
import config from './PluginConfig.json';

// Language Assets
import en from './en.json';
import it from './it.json';
import cn from './cn.json';

// Map translations and define supported languages
const translations = { en, it, cn };
type Language = 'en' | 'it' | 'cn';

const BG = '#FFFFFF';
const { SudokuNative } = NativeModules;

export default function App() {
  // Application State
  const [lang, setLang] = useState<Language>('en');
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [gameInfo, setGameInfo] = useState({ level: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Translation shortcut
  const t = translations[lang];

  // Startup: verify native bridge and fetch first puzzle
  useEffect(() => {
    console.log("[SUDOKU] App started");
    if (SudokuNative) {
      console.log("[SUDOKU] SUCCESS: SudokuNative native bridge ready.");
    } else {
      console.warn("[SUDOKU] WARNING: Native bridge not found.");
    }
    fetchSudoku();
  }, []);

  // Helper to get formatted timestamp
  const getFormattedDate = () => {
    const now = new Date();
    const date = now.toLocaleDateString('it-IT'); // Keeping DD/MM/YYYY format
    const time = now.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    return `${date} ${time}`;
  }

  // Fetch puzzle from Dosuku API
  const fetchSudoku = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      if (!response.ok) throw new Error();
      const data = await response.json();
      const puzzle = data.newboard.grids[0];
      
      setGrid(puzzle.value);
      setGameInfo({
        level: puzzle.difficulty,
        date: getFormattedDate()
      });
    } catch (e: any) {
      console.error("[SUDOKU] Fetch Error: " + e.message);
      setError(t.errorConn);
    } finally {
      setLoading(false);
    }
  };

  // Export grid to PNG via Kotlin and insert into Supernote Note
  const handleExportToNote = async () => {
    if (!grid || !SudokuNative) {
      console.error("[SUDOKU] Export impossible: missing data or bridge");
      return;
    }

    setLoading(true);
    try {
      console.log("[SUDOKU] Starting native generation...");
      
      // 1. Generate PNG using the custom Android module
      const pathGenerated = await SudokuNative.generateAndSaveSudoku(
        grid, 
        gameInfo.level, 
        gameInfo.date
      );

      console.log("[SUDOKU] Image saved at: " + pathGenerated);

      // 2. Insert the file into the current note
      const res = await PluginNoteAPI.insertImage(pathGenerated);
      
      if (res.success) {
        console.log("[SUDOKU] Insertion completed successfully!");
        PluginManager.closePluginView();
      } else {
        console.error("[SUDOKU] Note API Error: " + res.error?.message);
      }
    } catch (e: any) {
      console.error("[SUDOKU] Native process error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header Buttons */}
      <View style={styles.buttonRow}>
        <Pressable 
          onPress={() => PluginManager.closePluginView()} 
          style={[styles.topButton, { flex: 1, marginRight: 5 }]}
        >
          <Text style={styles.buttonText}>{t.close}</Text>
        </Pressable>

        <Pressable 
          onPress={fetchSudoku} 
          style={[styles.topButton, { flex: 2 }]} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "..." : t.newSudoku}
          </Text>
        </Pressable>
      </View>

      {/* Primary Action Button */}
      <Pressable 
        onPress={handleExportToNote} 
        style={[styles.exportButton, (loading || !grid) && styles.disabledButton]}
        disabled={loading || !grid}
      >
        <Text style={styles.exportButtonText}>
          {loading ? t.processing : t.insertNote}
        </Text>
      </Pressable>

      {/* Connectivity Error Message */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.center}>
        {loading && !grid ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>{t.loadingGrid}</Text>
          </View>
        ) : grid && (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.infoText}>{t.level}: {gameInfo.level.toUpperCase()}</Text>
              <Text style={styles.infoText}>{gameInfo.date}</Text>
            </View>

            {/* Sudoku Grid Rendering */}
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
            
            {/* Footer with Metadata and Dynamic Language Selector */}
            <View style={styles.footerContainer}>
              <Text style={styles.footer}>
                {config.name} v{config.versionName} by {config.author}
              </Text>
              
              <View style={styles.langSelector}>
                {Object.keys(translations).map((l, index) => (
                  <React.Fragment key={l}>
                    <Pressable onPress={() => setLang(l as Language)}>
                      <Text style={[styles.langText, lang === l && styles.activeLang]}>
                        {l.toUpperCase()}
                      </Text>
                    </Pressable>
                    {index < Object.keys(translations).length - 1 && (
                      <Text style={styles.langSeparator}> | </Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
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
    backgroundColor: '#000' 
  },
  exportButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  center: { alignItems: 'center' },
  container: { alignItems: 'center' },
  loadingContainer: { marginTop: 100, alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 18, fontWeight: 'bold' },
  errorContainer: {
    marginTop: 15,
    backgroundColor: '#222222',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignSelf: 'center',
  },
  errorText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: 576, marginBottom: 10 },
  infoText: { fontSize: 16, fontWeight: 'bold' },
  gridBoard: { borderWidth: 3, borderColor: '#000' },
  row: { flexDirection: 'row' },
  cell: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center', borderColor: '#000' },
  cellText: { fontSize: 36, fontWeight: 'bold', color: '#000' },
  footerContainer: { marginTop: 20, alignItems: 'center' },
  footer: { fontSize: 16, fontStyle: 'italic', color: '#666' },
  langSelector: { flexDirection: 'row', marginTop: 10 },
  langText: { fontSize: 16, color: '#666' },
  activeLang: { fontWeight: 'bold', color: '#000', textDecorationLine: 'underline' },
  langSeparator: { fontSize: 16, color: '#666' }
});