import { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from './hooks/useCamera';
import { sendFrameToAnalyze } from './api/videoApi';
import { LevelOne } from './components/levels/LevelOne';
import { LevelTwo } from './components/levels/LevelTwo';
import './App.css';

function App() {
  const { videoRef, isReady } = useCamera();
  const [emotion, setEmotion] = useState<string>('neutral');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ГЛАВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ УРОВНЕЙ
  // 1 = Первый экран, 2 = Второй экран
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // Логика камеры (она общая для всех, не прерывается)
  useEffect(() => {
    if (!isReady) return;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 480; 
      canvasRef.current.height = 360;
    }

    const captureAndSend = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const result = await sendFrameToAnalyze(blob);
        if (result?.emotion) {
          setEmotion(result.emotion.toLowerCase());
        }
      }, 'image/jpeg', 0.7);
    };

    const interval = setInterval(captureAndSend, 1500);
    return () => clearInterval(interval);
  }, [isReady]);

  // Функция рендера нужного уровня
  const renderLevel = useCallback( () => {
    switch (currentLevel) {
      case 1:
        return (
          <LevelOne 
            videoRef={videoRef} 
            emotion={emotion} 
            onNextLevel={() => setCurrentLevel(2)} 
          />
        );
      case 2:
        return (
          <LevelTwo 
            videoRef={videoRef} 
            emotion={emotion} 
            onNextLevel={() => console.log('Finish!')} 
          />
        );
      default:
        return <div>Конец демо</div>;
    } 
  },[currentLevel, emotion, videoRef]);

  return (
    <div className="app-root">
       {/* Здесь можно добавить общий хедер или прогресс-бар */}
       {/* <ProgressBar level={currentLevel} /> */}
       
       {renderLevel()}
    </div>
  );
}

export default App;