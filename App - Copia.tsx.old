import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { PluginManager } from 'sn-plugin-lib';
import html2canvas from 'html2canvas';

const BG = '#FFFFFF';

export default function App() {
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [gameInfo, setGameInfo] = useState({ level: '', date: '' });
  
  // Stati per la diagnostica (come nel tuo esempio)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [step, setStep] = useState<'start' | 'fetching' | 'rendering' | 'exporting' | 'done'>('start');
  const [details, setDetails] = useState<string>('Pronto');

  const sudokuRef = useRef<HTMLDivElement>(null);

  const setDiag = (msg: string, currentStep: any, currentStatus: any) => {
    setDetails(msg);
    setStep(currentStep);
    setStatus(currentStatus);
  };

  const fetchSudoku = async () => {
    setDiag("Avvio richiesta API...", 'fetching', 'loading');
    try {
      const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
      if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
      
      const data = await response.json();
      const puzzle = data.newboard.grids[0];

      setGrid(puzzle.value);
      setGameInfo({
        level: puzzle.difficulty,
        date: new Date().toLocaleDateString('it-IT')
      });
      setDiag("Sudoku caricato con successo", 'rendering', 'ok');
    } catch (error: any) {
      setDiag(`Errore fetch: ${error.message}`, 'fetching', 'error');
    }
  };

  const exportImage = async () => {
    if (!sudokuRef.current) {
      setDiag("Errore: Riferimento griglia non trovato", 'exporting', 'error');
      return;
    }

    setDiag("Generazione immagine in corso...", 'exporting', 'loading');
    try {
      const canvas = await html2canvas(sudokuRef.current, {
        backgroundColor: BG,
        scale: 2, // Alta risoluzione per E-ink
        logging: false
      });
      
      const imageData = canvas.toDataURL('image/png');
      
      // Simulazione download (su Supernote apparirà il selettore se supportato)
      const link = document.createElement('a');
      link.download = `sudoku_${gameInfo.level}_${Date.now()}.png`;
      link.href = imageData;
      link.click();

      setDiag("Immagine generata. Controlla i download.", 'done', 'ok');
    } catch (error: any) {
      setDiag(`Errore esportazione: ${error.message}`, 'exporting', 'error');
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.content}>
        <Text style={styles.h1}>Sudoku Maker for Supernote</Text>
        
        {/* Pannello di Diagnostica */}
        <View style={styles.diagBox}>
          <Text style={styles.sectionTitle}>Stato Sistema:</Text>
          <Text style={[styles.badge, status === 'ok' ? styles.badgeOk : status === 'error' ? styles.badgeErr : null]}>
            {status.toUpperCase()} - {step.toUpperCase()}
          </Text>
          <Text style={styles.mono}>{details}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={fetchSudoku} style={styles.button}>
            <Text style={styles.buttonText}>Genera Nuovo Sudoku</Text>
          </Pressable>
        </View>

        {grid && (
          <View style={styles.sudokuContainer}>
            {/* Area di cattura */}
            <div ref={sudokuRef} style={htmlStyles.captureArea}>
              <div style={htmlStyles.header}>
                <span>LIVELLO: {gameInfo.level.toUpperCase()}</span>
                <span>{gameInfo.date}</span>
              </div>
              <div style={htmlStyles.grid}>
                {grid.map((row, i) => 
                  row.map((cell, j) => (
                    <div key={`${i}-${j}`} style={{
                      ...htmlStyles.cell,
                      borderBottom: (i + 1) % 3 === 0 && i < 8 ? '2px solid black' : '1px solid #ccc',
                      borderRight: (j + 1) % 3 === 0 && j < 8 ? '2px solid black' : '1px solid #ccc',
                    }}>
                      {cell !== 0 ? cell : ''}
                    </div>
                  ))
                )}
              </div>
              <div style={htmlStyles.footer}>Supernote Sudoku Plugin</div>
            </div>

            <Pressable onPress={exportImage} style={[styles.button, { backgroundColor: '#000', marginTop: 20 }]}>
              <Text style={styles.buttonText}>Esporta come PNG</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Pressable onPress={() => PluginManager.closePluginView()} style={styles.closeBtn}>
        <Text style={styles.buttonText}>Esci</Text>
      </Pressable>
    </View>
  );
}

// Stili React Native per la UI del plugin
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  content: { flex: 1, padding: 16 },
  h1: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  diagBox: { padding: 10, backgroundColor: '#f0f0f0', borderSize: 1, borderColor: '#ccc', marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  badge: { alignSelf: 'flex-start', padding: 4, borderWidth: 1, fontSize: 10, marginBottom: 5 },
  badgeOk: { borderColor: '#0a0', color: '#0a0' },
  badgeErr: { borderColor: '#a00', color: '#a00' },
  mono: { fontFamily: 'monospace', fontSize: 11 },
  buttonContainer: { flexDirection: 'row', gap: 10 },
  button: { backgroundColor: '#444', padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  sudokuContainer: { marginTop: 20, alignItems: 'center' },
  closeBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#a00', padding: 10, borderRadius: 50 }
});

// Stili HTML puri per html2canvas (garantiscono che l'immagine sia corretta)
const htmlStyles = {
  captureArea: {
    padding: '20px',
    backgroundColor: '#ffffff',
    display: 'inline-block',
    border: '1px solid #eee'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '1px solid black'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 35px)',
    border: '2px solid black'
  },
  cell: {
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: 'white'
  },
  footer: {
    marginTop: '10px',
    textAlign: 'right' as const,
    fontSize: '8px',
    color: '#888'
  }
};