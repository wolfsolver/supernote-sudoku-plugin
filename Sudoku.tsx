/**
 * Simple Plugin
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
} from 'react-native';
import { PluginManager, PluginCommAPI, PluginFileAPI } from 'sn-plugin-lib';
import html2canvas from 'html2canvas';

/**
 * Plugin View
 * Displays Hello World text in the center of the screen
 */
function App(): React.JSX.Element {
  const [grid, setGrid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameInfo, setGameInfo] = useState({ level: '', date: '' });
  const [showModal, setShowModal] = useState(true);
  
  // Usiamo un ref per l'elemento DOM da catturare
  const sudokuRef = useRef(null);

  const fetchSudoku = async () => {
    setLoading(true);
    setShowModal(false);
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      const data = await response.json();
      const puzzle = data.newboard.grids[0];

      setGrid(puzzle.value);
      setGameInfo({
        level: puzzle.difficulty,
        date: new Date().toLocaleDateString('it-IT', { 
          day: '2-digit', month: '2-digit', year: 'numeric' 
        })
      });
    } catch (error) {
      console.error("Errore API:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportImage = async () => {
    if (sudokuRef.current) {
      // html2canvas lavora sul DOM reale
      const canvas = await html2canvas(sudokuRef.current, {
        backgroundColor: BG,
        scale: 2 // Migliore qualità per l'e-ink di Supernote
      });
      
      const imageData = canvas.toDataURL('image/png');
      // Qui potresti usare PluginFileAPI per salvare su Supernote
      const link = document.createElement('a');
      link.download = `sudoku_${gameInfo.level}.png`;
      link.href = imageData;
      link.click();
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sudoku Generator</Text>
        <Pressable onPress={() => PluginManager.closePluginView()} style={styles.button}>
          <Text style={styles.buttonText}>Chiudi</Text>
        </Pressable>		
        <Pressable style={styles.button} onClick={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Nuovo Gioco</Text>
        </Pressable>
      </View>

      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scegli Difficoltà</Text>
            <Pressable style={styles.levelBtn} onClick={fetchSudoku}>
              <Text style={styles.levelBtnText}>Genera Sudoku</Text>
            </Pressable>
          </View>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#000" />}

      {grid && (
        <View style={styles.captureWrapper}>
          {/* L'attributo ref e lo stile inline sono per html2canvas */}
          <div ref={sudokuRef} style={{ padding: '20px', backgroundColor: BG }}>
            <div style={styles.infoRow}>
              <span style={styles.infoText}>LIVELLO: {gameInfo.level.toUpperCase()}</span>
              <span style={styles.infoText}>{gameInfo.date}</span>
            </div>
            
            <div style={styles.grid}>
              {grid.map((row, i) => (
                row.map((cell, j) => (
                  <div 
                    key={`${i}-${j}`} 
                    style={{
                      ...styles.cell,
                      borderBottom: (i + 1) % 3 === 0 && i < 8 ? '2px solid black' : '0.5px solid #ccc',
                      borderRight: (j + 1) % 3 === 0 && j < 8 ? '2px solid black' : '0.5px solid #ccc',
                      borderTop: i === 0 ? '2px solid black' : '',
                      borderLeft: j === 0 ? '2px solid black' : '',
                      borderBottomColor: i === 8 ? '2px solid black' : (i + 1) % 3 === 0 ? 'black' : '#ccc',
                      borderRightColor: j === 8 ? '2px solid black' : (j + 1) % 3 === 0 ? 'black' : '#ccc'
                    }}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                ))
              ))}
            </div>
          </div>

          <Pressable style={styles.exportBtn} onClick={exportImage}>
            <Text style={styles.buttonText}>Esporta PNG</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>  
  );
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: BG, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  button: { backgroundColor: '#000', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  modalContent: { backgroundColor: '#fff', padding: 40, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
  levelBtn: { backgroundColor: '#000', padding: 15, borderRadius: 5, marginBottom: 10, width: 200 },
  levelBtnText: { color: '#fff', textAlign: 'center' },

  captureWrapper: { alignItems: 'center', marginTop: 20 },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 10, borderBottom: '1px solid black', paddingBottom: 5 },
  infoText: { fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 40px)',
    gridTemplateRows: 'repeat(9, 40px)',
    backgroundColor: '#fff',
  },
  cell: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000'
  },
  exportBtn: { marginTop: 20, backgroundColor: '#2ecc71', padding: 15, borderRadius: 5 }
});

export default App;
