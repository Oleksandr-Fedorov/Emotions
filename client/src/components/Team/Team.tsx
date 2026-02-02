import React from 'react';
import './Team.css';

interface TeamProps {
  // Упрощаем интерфейс, так как инпутов больше нет
  onConfirm: () => void;
}

export const Team: React.FC<TeamProps> = ({ onConfirm }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Кнопка нажата, переход в меню...");
    onConfirm(); 
  };

  return (
    <div className="main registration-screen">
      <div className="registration">
        {/* ВАЖНО: Используйте тег <form>, чтобы работал onSubmit */}
        <form className="registration-form" onSubmit={handleSubmit}>
          <h1>About the Team</h1>

          <div className="terms-text">
            <p>Sunkoma – Creative, Level Visualization (Figma)</p>

<p>KirillDR – Level Scenarios, Interaction Logic, UX</p>

<p>TheRouxe – Web Animation, Design, Backend, AI / LLM, Engine, Game Architecture</p>

<p>Sasha B. – AI / LLM (Mechanics Ideator, off-stage)</p>

<p>GAE_Ukraine – Initiator, Moderator, Plan B</p>
          </div>

          <div className="registration-form-checkboxes">
            {/* type="submit" заставит форму проверить чекбоксы и вызвать onSubmit */}
            <button type="submit" className="enter-form-team">Return</button>
          </div>
        </form>
      </div>
      <div className="navigation"/>
    </div>
  );
};