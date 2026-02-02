import { useEffect, useRef, useState } from 'react';
import { sendFrameToAnalyze } from '../api/videoApi';

export const useEmotionRecognition = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isActive: boolean,
  intervalMs: number = 1000
) => {
  const [emotion, setEmotion] = useState<string>(''); 
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
    }

    const captureAndSend = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const result = await sendFrameToAnalyze(blob);
        
        if (result && result.emotion) {
          const score = result.score || 0; // Получаем процент
          
          console.log(`Server: ${result.emotion} (${score.toFixed(1)}%)`);

          // --- ГЛАВНАЯ ЛОГИКА ---
          if (score > 80) {
            setEmotion(result.emotion.toLowerCase());
          } else {
            // Если уверенность низкая, считаем это нейтральным состоянием
            // Это поможет избежать ложных срабатываний
            setEmotion('neutral');
          }
        }
      }, 'image/jpeg', 0.8);
    };

    const timerId = setInterval(captureAndSend, intervalMs);

    return () => clearInterval(timerId);
  }, [isActive, videoRef, intervalMs]);

  return emotion;
};