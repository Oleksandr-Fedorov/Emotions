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
      
      {/* Контейнер зеркала */}
      <div className="mirror">
          <video 
            ref={videoRef} 
            muted 
            playsInline 
            autoPlay 
            /* Добавляем второй класс для сброса стилей */
            className="camera-video menu-video" 
          />
      </div>
    </div>
  );
};