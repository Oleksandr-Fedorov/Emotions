import { useCallback, useState,useEffect } from 'react';
import { useCamera } from './hooks/useCamera';
import { LevelOne } from './components/levels/LevelOne';
import { LevelTwo } from './components/levels/LevelTwo';
import { LevelThree } from './components/levels/LevelThree';
import './App.css';

function App() {
 const { videoRef } = useCamera();
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [health, setHealth] = useState<number>(10); // Старт с 10

  const changeHealth = useCallback((amount: number) => {
    setHealth(prev => {
      const newHealth = prev + amount;
      return Math.min(100, Math.max(0, newHealth)); // Ограничение 0 - 100
    });
  }, []);

  // Следим за состоянием игры
  useEffect(() => {
    if (health >= 100) {
      alert("ПОЗДРАВЛЯЕМ! Вы достигли 100 очков и победили! 🎉");
      resetGame();
    } else if (health <= 0) {
      alert("ИГРА ОКОНЧЕНА. Здоровье упало до 0. 💀");
      resetGame();
    }
  }, [health]);

  const resetGame = () => {
    setHealth(10);
    setCurrentLevel(1);
  };

  const renderLevel = useCallback(() => {
    const commonProps = { videoRef, health, onHealthChange: changeHealth };

    switch (currentLevel) {
      case 1:
        return (
          <LevelOne 
            {...commonProps} 
            onNextLevel={() => {
              changeHealth(20); // +20 при завершении 1 уровня
              setCurrentLevel(2);
            }} 
          />
        );
      case 2:
        return (
          <LevelTwo 
            {...commonProps} 
            onNextLevel={() => setCurrentLevel(3)} 
          />
        );
      case 3:
        return (
          <LevelThree 
            {...commonProps} 
            onNextLevel={() => console.log('Endless finish')} 
          />
        );
      default:
        return <div>Конец демо</div>;
    }
  }, [currentLevel, videoRef, health, changeHealth]);


  return (
    <div className="app-root">
      {/* СЛОЙ 1: Только камера. Он всегда один и тот же. */}
      <div className="persistent-layer video-only-layer">
        <div className="level-container">
          <aside className="sidebar-placeholder" /> {/* Пустое место под сайдбар */}
          <main className="main-content">
            <div className="video-wrapper no-frame">
              <video 
                ref={videoRef} 
                muted playsInline autoPlay 
                className="camera-video" 
              />
            </div>
          </main>
        </div>
      </div>

      {/* СЛОЙ 2: Интерфейс уровней. Рендерится ПОВЕРХ видео. */}
      <div className="persistent-layer ui-layer">
        <div className="health-bar-container">
          <div className="health-label">SMILE ENERGY</div>
          <div className="health-track">
            <div 
              className="health-fill" 
              style={{ width: `${health}%` }} // Теперь шкала на 100%
            />
          </div>
          <div className="health-value">{health}/100</div>
        </div>
        {renderLevel()}
      </div>
    </div>
  );
}

export default App;