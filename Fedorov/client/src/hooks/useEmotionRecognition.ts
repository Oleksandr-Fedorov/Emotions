import { useEffect, useRef, useState } from 'react';
import { sendFrameToAnalyze } from '../api/videoApi';

export const useEmotionRecognition = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean, // Если false — запросы не идут
  intervalMs: number = 1000 // Частота запросов (1 сек)
) => {
  const [emotion, setEmotion] = useState<string>('');
  // Используем ref для канваса, чтобы не создавать его каждый рендер
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive || !videoRef.current ) return;

    // Инициализация канваса (один раз)
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 640; // Размер для отправки (можно меньше для скорости)
      canvasRef.current.height = 480;
    }

    const captureAndSend = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Рисуем кадр видео на канвас
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Конвертируем в Blob (картинку) и шлем на сервер
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Вызываем твой API
        const result = await sendFrameToAnalyze(blob);
        
        // Обновляем стейт, если сервер ответил
        if (result && result.emotion ) {
          console.log(`Server detected: ${result.emotion}`); // Лог для отладки
          setEmotion(result.emotion.toLowerCase());
        }
      }, 'image/jpeg', 0.8); // 0.8 — качество jpg
    };

    // Запускаем шарманку
    const timerId = setInterval(captureAndSend, intervalMs);

    return () => clearInterval(timerId);
  }, [isActive, videoRef, intervalMs]);

  return emotion;
};