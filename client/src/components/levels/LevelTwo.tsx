import React, { useEffect, useState, useRef } from 'react';
import { MagicMirror } from '../MagicMirror';
import { useEmotionRecognition } from '../../hooks/useEmotionRecognition';

interface LevelProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onNextLevel: () => void;
}

const LEVEL_STEPS = [
  { target: 'neutral', label: ' Make a neutral face  😐', allowed: ['neutral'] },
  { target: 'positive', label: 'Smile with joy! 😃', allowed: ['positive'] },
  { target: 'negative', label: 'Show anger! 😡', allowed: ['negative'] }
];

export const LevelTwo: React.FC<LevelProps & {onHealthChange: (n:number)=>void}> = ({ videoRef, onNextLevel, onHealthChange }) => {
  const [isIntro, setIsIntro] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  // НОВОЕ: Флаг для визуального отображения галочки перед сменой шага
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const lastStepTimeRef = useRef<number>(0);

  // Анализируем только если не интро, не конец и НЕ ПЕРЕХОД
  const isAnalyzing = !isIntro && !isLevelComplete && !isTransitioning;
  
  const detectedEmotion = useEmotionRecognition(videoRef, isAnalyzing, 500);

  useEffect(() => {
    if (!isAnalyzing) return;

    const currentStep = LEVEL_STEPS[stepIndex];
    const isMatch = currentStep.allowed.includes(detectedEmotion);
    
    const now = Date.now();
    const timeSinceLastStep = now - lastStepTimeRef.current;
    const MIN_STEP_DURATION = 3000; 

    // Если эмоция верна И прошло время буфера
    if (isMatch ) {
      if(timeSinceLastStep > MIN_STEP_DURATION || stepIndex === 0)
      {
      onHealthChange(10); // +10 за каждый правильный шаг
      // 1. Включаем режим перехода (появится галочка)
      setIsTransitioning(true);

      // 2. Ждем 0.5 сек, чтобы юзер увидел галочку, и только потом меняем шаг
      setTimeout(() => {
        lastStepTimeRef.current = Date.now(); // Сброс таймера для следующего шага
        
        if (stepIndex + 1 < LEVEL_STEPS.length) {
          setStepIndex((prev) => prev + 1);
          setIsTransitioning(false); // Выключаем переход, снова ищем эмоции
        } else {
          setIsLevelComplete(true);
          setIsTransitioning(false);
        }
      }, 500); // 500мс задержки чисто для визуала
    }}
  }, [detectedEmotion, isAnalyzing, stepIndex, onHealthChange]);

  const handleStart = () => {
      setIsIntro(false);
      lastStepTimeRef.current = Date.now(); 
  };

  return (
    <div className="level-container">
      <aside className="sidebar">
        <h2 style={{fontSize: '4rem', textAlign: 'center'}}>Level 2</h2>
        <div style={{marginTop: '20px'}}>
          {LEVEL_STEPS.map((step, idx) => {
            // ЛОГИКА ГАЛОЧКИ:
            // 1. Если индекс меньше текущего (старые шаги) -> Зеленая
            // 2. Если индекс равен текущему И мы в фазе перехода -> Зеленая (ВОТ ЭТО ЧИНИТ БАГ)
            const isDone = idx < stepIndex || (idx === stepIndex && isTransitioning) || isLevelComplete;
            const isActive = idx === stepIndex && !isTransitioning && !isLevelComplete;

            return (
                <div key={idx} style={{ 
                  
                  opacity: isActive || isDone ? 1 : 0.4, 
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isDone ? '#4caf50' : 'white', // Зеленый если готово
                  marginBottom: '10px',
                  fontSize: '3rem'
                }}>
                  {isDone ? '✅ ' : isActive ? '👉 ' : '⭕ '}
                  {step.label}
                </div>
            );
          })}
        </div>
      </aside>
          
      <main className="main-content">
        <div className="video-wrapper">
          {isIntro && (
            <div className="intro-overlay">
              <div className="intro-content">
                <div className="intro-mask-wrapper"><MagicMirror currentEmotion="happy" /></div>
                <p className="intro-text">You need to perform 3 emotions.<br/>How ever you show the right emotion — you'll immediately move to the next step.</p>
                <button className="start-button" onClick={handleStart}>Let's Go!</button>
              </div>
            </div>
          )}

          {!isIntro && !isLevelComplete && (
            <div className="dialogue-section">
              <div className="mini-mask-wrapper">
                {/* Если переход - показываем счастливую маску (опционально) */}
                <MagicMirror currentEmotion={isTransitioning ? 'happy' : detectedEmotion} />
              </div>
              <div className="chat-bubble">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h3>{isTransitioning ? "Excellent! 👍" : LEVEL_STEPS[stepIndex].label}</h3>
                    {!isTransitioning && (
                        <p style={{opacity: 0.6, fontSize: '0.9em', margin: 0}}>
                        See: <b style={{textTransform: 'uppercase'}}>{detectedEmotion}</b>
                        </p>
                    )}
                </div>
              </div>
            </div>
          )}

          {isLevelComplete && (
            <div className="intro-overlay">
              <div className="intro-content">
                <div className="intro-mask-wrapper"><MagicMirror currentEmotion="happy" /></div>
                <h2>Level Complete! 🎉</h2>
                <button className="start-button" onClick={onNextLevel}>Next →</button>
              </div>
            </div>
          )}
        </div>
      </main>
        </div>

  );
};