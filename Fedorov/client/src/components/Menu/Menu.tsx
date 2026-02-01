import React from 'react';
import './Menu.css'; 

interface MenuProps {
  onStart: () => void;
  onTeam: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const Menu: React.FC<MenuProps> = ({ onStart, onTeam, videoRef }) => {
  return (
    <div className="menu-screen"> 
      <div className="menu">
        <div className="menu-background">
          <button onClick={onStart}>New game</button>
          <button onClick={onTeam}>Team</button>
          <button>Setting</button>
        </div>
      </div>
      
      {/* Вместо div.mirror мы создаем контейнер для рамки.
          Внутри мы имитируем структуру игры: Видео + Рамка сверху
      */}
      <div className="menu-frame-container">
         <div className="video-wrapper">
            {/* Слой 1: Рамка (лежит поверх видео благодаря z-index) */}
            <div className="menu-frame-overlay"></div>

            {/* Слой 2: Видео (используем стандартный класс camera-video из App.css) */}
            <video 
              ref={videoRef} 
              muted 
              playsInline 
              autoPlay 
              /* УБИРАЕМ класс menu-video, чтобы сработали отступы 12%/8.5% из App.css */
              className="camera-video" 
            />
         </div>
      </div>
    </div>
  );
};