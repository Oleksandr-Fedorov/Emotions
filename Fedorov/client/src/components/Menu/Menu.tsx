import React from 'react';
import './Menu.css'; 

interface MenuProps {
  onStart: () => void;
  onTeam: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onStart, onTeam }) => {
  return (
    /* Замени menu-screen-wrapper на menu-screen, если в CSS у тебя menu-screen */
    <div className="menu-screen"> 
      <div className="menu">
        <div className="menu-background">
          <button onClick={onStart}>New game</button>
          <button onClick={onTeam}>Team</button>
          <button>Setting</button>
        </div>
      </div>
      <div className="mirror"></div>
    </div>
  );
};