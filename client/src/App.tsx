import { useState } from 'react';
import { useCamera } from './hooks/useCamera';
import { Registration } from './components/Registration/Registration';
import { Menu } from './components/Menu/Menu';
import { Team } from './components/Team/Team';
import { GameLayout } from './components/GameLayout';
import './App.css';

// Типизируем возможные экраны
type Screen = 'REGISTRATION' | 'MENU' | 'GAME' | 'TEAM';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('REGISTRATION');
const { videoRef } = useCamera();
  return (
    <>
      {currentScreen === 'REGISTRATION' && (
        <Registration onConfirm={() => setCurrentScreen('MENU')} />
      )}

      {currentScreen === 'MENU' && (
        <Menu 
        videoRef={videoRef}
          onStart={() => setCurrentScreen('GAME')} 
          onTeam={() => setCurrentScreen('TEAM')} 
        />
      )}

      {currentScreen === 'GAME' && (
        <GameLayout    videoRef={videoRef} onGameOver={() => setCurrentScreen('MENU')} />
      )}

      {currentScreen === 'TEAM' && (
        <Team onConfirm={() => setCurrentScreen('MENU')} />
      )}
    </>
  );
}

export default App;