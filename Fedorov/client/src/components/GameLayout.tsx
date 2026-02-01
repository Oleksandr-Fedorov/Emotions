import React, { useCallback, useState, useEffect } from 'react';

import { LevelOne } from './levels/LevelOne';
import { LevelTwo } from './levels/LevelTwo';
import { LevelThree } from './levels/LevelThree';

interface GameLayoutProps {
  onGameOver: () => void;
  videoRef: React.RefObject<HTMLVideoElement>; // Получаем проп
}

export const GameLayout: React.FC<GameLayoutProps> = ({ onGameOver, videoRef }) => {

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [health, setHealth] = useState<number>(10);

  const changeHealth = useCallback((amount: number) => {
    setHealth(prev => {
      const newHealth = prev + amount;
      return Math.min(100, Math.max(0, newHealth));
    });
  }, []);

  const resetGame = useCallback(() => {
    setHealth(10);
    setCurrentLevel(1);
    onGameOver(); // Возвращаемся в меню
  }, [onGameOver]);

  useEffect(() => {
    if (health >= 100) {
      alert("ПОЗДРАВЛЯЕМ! 🎉");
      resetGame();
    } else if (health <= 0) {
      alert("ИГРА ОКОНЧЕНА. 💀");
      resetGame();
    }
  }, [health, resetGame]);

  const renderLevel = useCallback(() => {
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
        return <div>Конец демо</div>;
    }
  }, [currentLevel, videoRef, health, changeHealth]);

  return (
    <div className="app-root">
      {/* СЛОЙ 1: Видео */}
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

      {/* СЛОЙ 2: Интерфейс */}
      <div className="persistent-layer ui-layer">
        <div className="health-bar-container">
          <div className="health-label">SMILE ENERGY</div>
          <div className="health-track">
            <div className="health-fill" style={{ width: `${health}%` }} />
          </div>
          <div className="health-value">{health}/100</div>
        </div>
        {renderLevel()}
      </div>
    </div>
  );
};