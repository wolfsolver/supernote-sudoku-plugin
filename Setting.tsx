import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PluginManager } from 'sn-plugin-lib';
import { saveSettings } from './Storage'; // Import our new storage helper

const Setting = () => {
  const { t, i18n } = useTranslation();

// Updated function to be asynchronous
  const changeLanguage = async (code: string) => {
    console.log('[SUDOKU/Setting]: changing language to', code);
    
    // 1. Update UI immediately
    await i18n.changeLanguage(code);
    
    // 2. Persist choice to the file system
    await saveSettings({ language: code });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>{t('selectLanguage')}:</Text>
        
        <View style={styles.langGrid}>
          {['en', 'it', 'cn', 'jp'].map((code) => (
            <TouchableOpacity 
              key={code} 
              style={[
                styles.langButton, 
                i18n.language === code && styles.activeButton
              ]}
              onPress={() => changeLanguage(code)}
            >
              <Text style={[
                styles.buttonText, 
                i18n.language === code && styles.activeButtonText
              ]}>
                {code.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottone di uscita che usa lo stile del Sudoku */}
      <TouchableOpacity 
        style={styles.exitButton} 
        onPress={() => PluginManager.closePluginView()}
      >
        <Text style={styles.exitButtonText}>{t('exit')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  langButton: {
    width: 120,
    height: 60,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#FFF',
  },
  activeButton: {
    backgroundColor: '#000', // Inverte i colori quando selezionato
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  activeButtonText: {
    color: '#FFF',
  },
  // Stile "Sudoku model" per il tasto chiudi
  exitButton: {
    width: 576, // Come la larghezza della griglia Sudoku
    height: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto', // Lo spinge in fondo
    marginBottom: 20,
  },
  exitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default Setting;