import { useEffect, useRef, useState } from 'react';

export const useCamera = () => {
  // Указываем, что ref хранит видео-элемент
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: 'user' // Фронтальная камера
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Ждем, пока метаданные загрузятся, чтобы не было черного экрана
          videoRef.current.onloadedmetadata = () => {
             setIsReady(true);
             videoRef.current?.play();
          };
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    startCamera();

    return () => {
      // Останавливаем камеру при выходе
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { videoRef, isReady };
};