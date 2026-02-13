import './i18n'; // Initialize i18n
import React, { useState, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useTranslation } from 'react-i18next';
import Sudoku from './Sudoku';
import Setting from './Setting';
import { loadSettings } from './Storage';
import { checkPendingSettings } from './index'; // Importa la funzione

const App = () => {
  console.log('[SUDOKU/App]: started');
	
//  const [currentView, setCurrentView] = useState('GAME');
//  const { i18n } = useTranslation();

  const { i18n, ready } = useTranslation(); // 'ready' è fondamentale
  if (!ready) {
    return <View style={{flex:1, backgroundColor:'#fff'}} />; // Schermata bianca di attesa
  }

// Check if the gear was clicked during the boot sequence
  const [currentView, setCurrentView] = useState(
    checkPendingSettings() ? 'SETTING' : 'GAME'
  );

  useEffect(() => {	  

	const initLang = async () => {
      const settings = await loadSettings();
      if (settings && settings.language) {
        console.log('[SUDOKU/App]: Restoring language from storage:', settings.language);
        i18n.changeLanguage(settings.language);
      }
    };  
	initLang();
  
    // 1. Listen for Settings gear click
    const settingsSub = DeviceEventEmitter.addListener('openSettings', () => {
      console.log('[SUDOKU/App]: opensetting');
      setCurrentView('SETTING');
    });

    // 2. Listen for System Language change
    const langSub = DeviceEventEmitter.addListener('systemLanguageChanged', (sysLang) => {
      console.log('[SUDOKU/App]: systemLanguageChanged');
      // Logic: Only update if user hasn't locked the language to Italian manually
      // For now, let's just sync it
      const supported = ['en', 'it', 'cn', 'jp'];
      const target = supported.includes(sysLang) ? sysLang : 'en';
      i18n.changeLanguage(target);
    });

	const gameSub = DeviceEventEmitter.addListener('showGame', () => {
		console.log('[SUDOKU/App]: showGame event received');
		setCurrentView('GAME');
	  });

    return () => {
      console.log('[SUDOKU/App]: systemLanguageChangedsystemLanguageChanged');
      settingsSub.remove();
      langSub.remove();
	  gameSub.remove();
    };
  }, []);

  console.log(`[SUDOKU/App]: returning: ${currentView}`);
  return currentView === 'SETTING' ? <Setting /> : <Sudoku />;
};

export default App;