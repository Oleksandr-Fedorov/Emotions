// src/components/levels/LevelTwo.tsx
import React, { useState } from 'react';
import { MagicMirror } from '../MagicMirror';

interface LevelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  emotion: string;
  onNextLevel: () => void;
}

export const LevelTwo: React.FC<LevelProps> = ({ videoRef, emotion }) => {
  // У этого уровня СВОЕ состояние интро
  const [isIntro, setIsIntro] = useState(true);

  return (
    <div className="level-container fade-in">
      
      {/* ЛЕВАЯ ЧАСТЬ: Теперь здесь Смайлик, а не просто текст */}
      <aside className="sidebar level-2-sidebar">
        <div className="big-emoji">
          {emotion === 'happy' ? '🌟' : '🤔'}
        </div>
        <h3>Уровень 2</h3>
        <p>Следи за смайликом слева.</p>
      </aside>

      <main className="main-content">
        <div className="video-wrapper">
          <video ref={videoRef} muted playsInline className="camera-video" />

          {/* Интро Уровня 2: Маска снова объясняет правила */}
          {isIntro && (
            <div className="intro-overlay">
              <div className="intro-content">
                <div style={{ width: '150px', height: '200px', margin: '0 auto' }}>
                  <MagicMirror currentEmotion="shock" /> {/* Другая эмоция для разнообразия */}
                </div>
                <p>Отлично! Теперь задание сложнее. Попробуй повторить эмоцию смайлика.</p>
                <button className="start-button" onClick={() => setIsIntro(false)}>
                  Понял, поехали
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Рабочая зона Уровня 2 (Маска внизу, но может быть другой дизайн) */}
        {!isIntro && (
          <div className="dialogue-section level-2-dialogue">
            <div className="mini-mask-wrapper">
              <MagicMirror currentEmotion={emotion} />
            </div>
            <div className="chat-bubble">
               <p>Я слежу за тобой... Твоя эмоция: <b>{emotion}</b></p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};