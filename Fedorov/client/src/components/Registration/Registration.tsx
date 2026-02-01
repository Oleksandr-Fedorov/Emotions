import React from 'react';
import './Registration.css';

interface RegistrationProps {
  // Упрощаем интерфейс, так как инпутов больше нет
  onConfirm: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onConfirm }) => {
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
          <h1>Smile game terms of use</h1>

          <div className="terms-text">
            This game may use your device's camera to recognise facial expressions...
          </div>

          <div className="registration-form-checkboxes">
            <div>
              <input type="checkbox" className="checkbox-user-agreement" required />
              <p>Yes, I agree to these terms</p>
            </div>
            <div>
              <input type="checkbox" className="checkbox-camera-agreement" required />
              <p>Yes, I agree to the use of the camera</p>
            </div>
            {/* type="submit" заставит форму проверить чекбоксы и вызвать onSubmit */}
            <button type="submit" className="enter-form">Send</button>
          </div>
        </form>
      </div>
      <div className="navigation"/>
    </div>
  );
};