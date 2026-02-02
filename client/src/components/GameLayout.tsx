import React, { useCallback, useState, useEffect } from 'react';

import { LevelOne } from './levels/LevelOne';
import { LevelTwo } from './levels/LevelTwo';
import { LevelThree } from './levels/LevelThree';
import './GameLayout.css'; // Не забудь создать/обновить этот файл

interface GameLayoutProps {
  onGameOver: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ onGameOver, videoRef }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [health, setHealth] = useState<number>(10);
  
  // Новое состояние для отслеживания статуса игры
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const changeHealth = useCallback((amount: number) => {
    // Если игра уже закончена, здоровье не меняем
    if (gameStatus !== 'playing') return;

    setHealth(prev => {
      const newHealth = prev + amount;
      return Math.min(100, Math.max(0, newHealth));
    });
  }, [gameStatus]);

  // Функция выхода в меню (вызывается кнопкой в модальном окне)
  const handleExitToMenu = () => {
    setHealth(10);
    setCurrentLevel(1);
    setGameStatus('playing');
    onGameOver(); 
  };

  // Следим за состоянием здоровья
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    if (health >= 100) {
      setGameStatus('won'); // Ставим статус победы
    } else if (health <= 0) {
      setGameStatus('lost'); // Ставим статус поражения
    }
  }, [health, gameStatus]);

  const renderLevel = useCallback(() => {
    // Блокируем управление уровнем, если игра окончена
    if (gameStatus !== 'playing') return null;

    const commonProps = { videoRef, health, onHealthChange: changeHealth };

    switch (currentLevel) {
      case 1:
        return (
          <LevelOne 
            {...commonProps} 
            onNextLevel={() => {
              changeHealth(20);
              setCurrentLevel(2);
            }} 
          />
        );
      case 2:
        return <LevelTwo {...commonProps} onNextLevel={() => setCurrentLevel(3)} />;
      case 3:
        return <LevelThree {...commonProps} onNextLevel={() => console.log('Finish')} />;
      default:
        return <div>Unknown level</div>;
    }
  }, [currentLevel, videoRef, health, changeHealth, gameStatus]);

  return (
    <div className="app-root">
      {/* СЛОЙ 1: Видео (остается на фоне) */}
      <div className="persistent-layer video-only-layer">
        <div className="level-container">
          <aside className="sidebar-placeholder" />
          <main className="main-content">
            <div className="video-wrapper no-frame">
              <video ref={videoRef} muted playsInline autoPlay className="camera-video" />
            </div>
          </main>
        </div>
      </div>

      {/* СЛОЙ 2: Интерфейс игры */}
      <div className="persistent-layer ui-layer">
        
        {/* Показываем шкалу только если игра идет */}
        {gameStatus === 'playing' && (
            <div className="health-bar-container">
            <div className="health-label">SMILE ENERGY</div>
            <div className="health-track">
                <div className="health-fill" style={{ width: `${health}%` }} />
            </div>
            <div className="health-value">{health}/100</div>
            </div>
        )}
        
        {renderLevel()}
      </div>

      {/* СЛОЙ 3: Модальные окна (Финал) */}
      {gameStatus !== 'playing' && (
        <div className="game-over-overlay">
          <div className={`game-over-modal ${gameStatus}`}>
            <div className="modal-icon">
                {gameStatus === 'won' ? '🏆' : '💀'}
            </div>
            <h2>
                {gameStatus === 'won' ? 'YOU WON!' : 'GAME OVER'}
            </h2>
            <p>
                {gameStatus === 'won' 
                    ? 'Your smile charged the system to 100%!' 
                    : 'The smile energy has run out...'}
            </p>
            <button className="modal-button" onClick={handleExitToMenu}>
                Exit to Menu
            </button>
          </div>
        </div>
      )}

    </div>
  );
};