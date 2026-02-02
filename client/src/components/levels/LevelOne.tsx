import React, { useEffect, useState } from 'react';
import { MagicMirror } from '../MagicMirror';
import { useEmotionRecognition } from '../../hooks/useEmotionRecognition';

interface LevelProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onNextLevel: () => void;
}

// НАСТРОЙКА: Единственная цель уровня
const TARGET_TASK = {
  label: 'Just Smile! 😃',
  // Разрешаем разные варианты радости, чтобы было легче
  allowed: ['positive'] 
};

export const LevelOne: React.FC<LevelProps> = ({ videoRef, onNextLevel }) => {
  const [isIntro, setIsIntro] = useState(true);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  // Флаг для красивого перехода (галочка перед финалом)
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Анализируем, только если идет игра (не интро, не финал, не момент перехода)
  const isAnalyzing = !isIntro && !isLevelComplete && !isTransitioning;
  
  // Частота 500мс для быстрой реакции
  const detectedEmotion = useEmotionRecognition(videoRef, isAnalyzing, 500);

  useEffect(() => {
    if (!isAnalyzing) return;

    // Проверяем совпадение
    const isMatch = TARGET_TASK.allowed.includes(detectedEmotion);
    
    // Как только совпало (таймеры не нужны, так как это единственный шаг)
    if (isMatch) {
      // 1. Показываем визуальный успех ("Супер!")
      setIsTransitioning(true);

      // 2. Ждем 0.5-1 сек, чтобы игрок успел порадоваться галочке, и завершаем уровень
      setTimeout(() => {
        setIsLevelComplete(true);
        setIsTransitioning(false);
      }, 1000); 
    }
  }, [detectedEmotion, isAnalyzing]);

  return (
    <div className="level-container">
      {/* САЙДБАР: Теперь он виден и не перекрывается видео */}
      <aside className="sidebar">
        <h2 style={{fontSize: '4rem', textAlign: 'center'}}>Level 1</h2>
        <div >
          <div style={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            color: isTransitioning || isLevelComplete ? '#4caf50' : 'white',
            fontSize: '3rem'
          }}>
            {isTransitioning || isLevelComplete ? '✅ ' : ''}
            {TARGET_TASK.label}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="video-wrapper">
          {/* Здесь видео НЕТ. Оно просвечивает из нижнего слоя через рамку. */}

          {/* 1. ИНТРО */}
          {isIntro && (
            <div className="intro-overlay">
              <div className="intro-content">
                <div className="intro-mask-wrapper">
                  <MagicMirror currentEmotion="happy" />
                </div>
                <p className="intro-text">
                  Welcome to Level 1!<br/>
                  To complete this level, simply show a big smile to the camera.<br/>
                </p>
                <button className="start-button" onClick={() => setIsIntro(false)}>
                  Let's Go!
                </button>
              </div>
            </div>
          )}

          {/* 2. ИГРА */}
          {!isIntro && !isLevelComplete && (
            <div className="dialogue-section">
              <div className="mini-mask-wrapper">
                <MagicMirror currentEmotion={isTransitioning ? 'happy' : detectedEmotion} />
              </div>
              <div className="chat-bubble">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3>{isTransitioning ? "Excellent! 👍" : TARGET_TASK.label}</h3>
                  {!isTransitioning && (
                    <p style={{ opacity: 0.6, fontSize: '0.9em', margin: 0 }}>
                      See: <b style={{ textTransform: 'uppercase' }}>{detectedEmotion}</b>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. ФИНАЛ */}
          {isLevelComplete && (
            <div className="intro-overlay">
              <div className="intro-content">
                <div className="intro-mask-wrapper">
                  <MagicMirror currentEmotion="happy" />
                </div>
                <h2>Level Complete! 🎉</h2>
                <p className="intro-text">Excellent smile! (+10 points)</p>
                <button className="start-button" onClick={onNextLevel}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};