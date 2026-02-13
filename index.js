/**
 * index.js
 */
import './i18n'; 
import {AppRegistry, Image, DeviceEventEmitter} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PluginManager } from 'sn-plugin-lib';

// Global flag to catch the click event if the App is not yet mounted
let pendingOpenSettings = false; 

// 1. Registrazione componente
AppRegistry.registerComponent(appName, () => App);

// 2. Inizializzazione obbligatoria
PluginManager.init();

// 3. Registrazione pulsante toolbar
PluginManager.registerButton(1, ['NOTE'], {
  id: 100,
  name: 'Sudoku',
  icon: Image.resolveAssetSource(require('./assets/sudoku.png')).uri,
  showType: 1,
});

PluginManager.registerButtonListener({
      onButtonPress(event) {
        console.log('[SUDOKU]: Main button pressed, event id:', event.id);
        pendingOpenSettings = false; // Reset the boot flag
		DeviceEventEmitter.emit('showGame');
        console.log('[SUDOKU]: Main button pressed. emit showGame done');
      },
    });

console.log('[SUDOKU]: Setting up Config Button');
PluginManager.registerConfigButton();
console.log('[SUDOKU]: Setting up Config Button. Done');

console.log('[SUDOKU]: Setting up Config Listener');
PluginManager.registerConfigButtonListener({
	onClick() {
	  console.log('[SUDOKU]: In Config Listener');
	  pendingOpenSettings = true; // Segnamo che è stato cliccato
	  DeviceEventEmitter.emit('openSettings');
	  console.log('[SUDOKU]: set openSettings Done');
	},
});
console.log('[SUDOKU]: Setting up Config Listener. Done');
  
console.log('[SUDOKU]: Config setup completed');

// 5. Listener Lingua
PluginManager.registerLangListener((lang) => {
  console.log(`[SUDOKU]: registerLangListener: ${lang}`);
  DeviceEventEmitter.emit('systemLanguageChanged', lang);
  console.log('[SUDOKU]: registerLangListener. emit systemLanguageChanged done');
});


// Esportiamo una funzione per permettere ad App.tsx di controllare
export const checkPendingSettings = () => {
  const value = pendingOpenSettings;
  pendingOpenSettings = false; // Reset after check
  console.log(`[SUDOKU]: pendingOpenSettings: ${value}. Reseted`);
  return value;
};