import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MagicMirror } from '../MagicMirror';
import { useEmotionRecognition } from '../../hooks/useEmotionRecognition';

interface LevelProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onNextLevel: () => void;
}

const TIME_LIMIT = 5.0; // Секунд на раунд
const EMOTIONS_POOL = ['happy', 'angry', 'surprise', 'neutral', 'sad'];

const EMOJI_MAP: Record<string, string> = {
  happy: '😃',
  angry: '😡',
  surprise: '😲',
  neutral: '😐',
  sad: '😢'
};

export const LevelThree: React.FC<LevelProps & { onHealthChange: (n: number) => void }> = ({ videoRef,  onHealthChange }) => {
  // --- STATE ---
  const [isPlaying, setIsPlaying] = useState(false); 
  const [targetEmotion, setTargetEmotion] = useState<string>('happy');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [roundResult, setRoundResult] = useState<'success' | 'fail' | null>(null);

  const timerRef = useRef<number | null>(null);

  // Анализ работает только во время активной игры без паузы на результат
  const isAnalyzing = isPlaying && roundResult === null;
  const detectedEmotion = useEmotionRecognition(videoRef, isAnalyzing, 200);

  // --- ЛОГИКА ---

  const pickNextEmotion = useCallback((current: string) => {
    let next = current;
    while (next === current) {
      const idx = Math.floor(Math.random() * EMOTIONS_POOL.length);
      next = EMOTIONS_POOL[idx];
    }
    return next;
  }, []);

  const nextRound = useCallback((result: 'success' | 'fail') => {
    if (result === 'success') {
      setScore(s => s + 1);
      onHealthChange(5); // +10 здоровья за успех
    }
    else {
      onHealthChange(-5); // -10 здоровья за провал
    }

    setRoundResult(result);

    // Пауза 1 секунда для визуального фидбека (как в LevelOne/Two)
    setTimeout(() => {
      setTargetEmotion(prev => pickNextEmotion(prev));
      setTimeLeft(TIME_LIMIT);
      setRoundResult(null); 
    }, 1000);
  }, [pickNextEmotion, onHealthChange]);

  const handleStart = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(TIME_LIMIT);
    setTargetEmotion(pickNextEmotion(''));
  };

  // --- ТАЙМЕР ---
  useEffect(() => {
    if (isPlaying && roundResult === null) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            if (timerRef.current) clearInterval(timerRef.current);
            nextRound('fail');
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, roundResult, nextRound]);

  // --- ПРОВЕРКА ЭМОЦИЙ ---
  useEffect(() => {
    if (!isAnalyzing) return;

    let isMatch = false;
    // Упрощенная логика маппинга под ваши категории (positive/negative/neutral)
    if (targetEmotion === 'happy' && detectedEmotion === 'positive') isMatch = true;
    else if (targetEmotion === 'angry' && detectedEmotion === 'negative') isMatch = true;
    else if (targetEmotion === 'sad' && detectedEmotion === 'negative') isMatch = true;
    else if (targetEmotion === 'surprise' && detectedEmotion === 'positive') isMatch = true;
    else if (targetEmotion === 'neutral' && detectedEmotion === 'neutral') isMatch = true;

    if (isMatch) {
      nextRound('success');
    }
  }, [detectedEmotion, targetEmotion, isAnalyzing, nextRound]);

  return (
    <div className="level-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
       <h2 style={{fontSize: '4rem', textAlign: 'center'}}>Level 3</h2>
        <div className="score-badge" style={{  fontSize: '3rem', color: '#646cff' }}>
          Score: <b>{score}</b>
        </div>

        <div style={{ marginTop: '20px' }}>
          {/* Отображение текущей задачи в сайдбаре */}
          <div style={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            color: roundResult === 'success' ? '#4caf50' : roundResult === 'fail' ? '#f44336' : 'white',
            fontSize: '3rem'
          }}>
            {roundResult === 'success' ? '✅ ' : roundResult === 'fail' ? '❌ ' : '👉 '}
            Show: {EMOJI_MAP[targetEmotion]}
          </div>

          {/* Визуальный таймер */}
          {isPlaying && roundResult === null && (
            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: '#333', 
              borderRadius: '4px', 
              marginTop: '15px',
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${(timeLeft / TIME_LIMIT) * 100}%`, 
                height: '100%', 
                background: timeLeft < 2 ? '#f44336' : '#646cff',
                transition: 'width 0.1s linear'
              }} />
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="video-wrapper">
          
          {/* 1. ИНТРО */}
          {!isPlaying && (
            <div className="intro-overlay">
              <div className="intro-content">
                <div className="intro-mask-wrapper">
                  <MagicMirror currentEmotion="happy" />
                </div>
                <p className="intro-text">
                  <b>Time Mode</b><br/>
                  Show the emotion before time runs out!
                </p>
                <button className="start-button" onClick={handleStart}>
                  Let's Go!
                </button>
              </div>
            </div>
          )}

          {/* 2. ИГРА (ДИАЛОГОВАЯ СЕКЦИЯ) */}
          {isPlaying && (
            <div className="dialogue-section">
              <div className="mini-mask-wrapper">
                {/* Если успех/провал — фиксируем маску, иначе — зеркалим игрока */}
                <MagicMirror 
                  currentEmotion={
                    roundResult === 'success' ? 'happy' : 
                    roundResult === 'fail' ? 'sad' : 
                    detectedEmotion
                  } 
                />
              </div>
              <div className="chat-bubble">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3>
                    {roundResult === 'success' ? "Excellent! +1 point" : 
                     roundResult === 'fail' ? "Oops! Time's up" : 
                     <>Show {EMOJI_MAP[targetEmotion]} ({targetEmotion})</>}
                  </h3>
                  
                  {roundResult === null && (
                    <p style={{ opacity: 0.6, fontSize: '0.9em', margin: 0 }}>
                      Remaining: <b>{timeLeft.toFixed(1)}s</b>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};