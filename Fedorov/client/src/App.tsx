import { useState } from 'react';
import { Registration } from './components/Registration/Registration';
import { Menu } from './components/Menu/Menu';
import { GameLayout } from './components/GameLayout';
import './App.css';

// Типизируем возможные экраны
type Screen = 'REGISTRATION' | 'MENU' | 'GAME';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('REGISTRATION');

  return (
    <>
      {currentScreen === 'REGISTRATION' && (
        <Registration onConfirm={() => setCurrentScreen('MENU')} />
      )}

      {currentScreen === 'MENU' && (
        <Menu 
          onStart={() => setCurrentScreen('GAME')} 
          onTeam={() => alert('Команда разработки')} 
        />
      )}

      {currentScreen === 'GAME' && (
        <GameLayout onGameOver={() => setCurrentScreen('MENU')} />
      )}
    </>
  );
}

export default App;