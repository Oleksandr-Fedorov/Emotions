import React from 'react';

// Импортируем картинки (Vite сам разберется с путями)
import neutralImg from '../assets/masks/neutral.webp';
import happyImg from '../assets/masks/happy.webp';
import warmImg from '../assets/masks/warm.webp';
import lolImg from '../assets/masks/lol.webp';
import sadImg from '../assets/masks/sad.webp';
import angryImg from '../assets/masks/angry.webp';
import shockImg from '../assets/masks/shock.webp';
import doubtImg from '../assets/masks/doubt.webp';

import './MagicMirror.css';

// Описываем, какие эмоции у нас есть
type EmotionType = 'neutral' | 'happy' | 'warm' | 'lol' | 'sad' | 'angry' | 'shock' | 'doubt';

interface MagicMirrorProps {
  currentEmotion: string; // Строка, которая приходит от "мозгов" или кнопок
}

// Словарь: Ключ эмоции -> Файл картинки
const emotionImages: Record<string, string> = {
  neutral: neutralImg,
  happy: happyImg,
  warm: warmImg,
  lol: lolImg,
  sad: sadImg,
  angry: angryImg,
  shock: shockImg,
  doubt: doubtImg,
};

export const MagicMirror: React.FC<MagicMirrorProps> = ({ currentEmotion }) => {
  // Если пришла эмоция, которой нет в списке, показываем neutral
  const activeEmotion = emotionImages[currentEmotion] ? currentEmotion : 'neutral';

  return (
    <>
      {Object.keys(emotionImages).map((emotionKey) => (
        <img
          key={emotionKey}
          src={emotionImages[emotionKey]}
          alt={emotionKey}
          className={`mask-layer ${activeEmotion === emotionKey ? 'visible' : ''}`}
        />
      ))}
    </>
  );
};