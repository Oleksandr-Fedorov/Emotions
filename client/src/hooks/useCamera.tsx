import { useRef, useEffect, useState } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 1. Запрашиваем доступ к камере ОДИН раз при запуске приложения
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 } // Можно настроить разрешение
        });
        setStream(currentStream);
      } catch (error) {
        console.error("Ошибка доступа к камере:", error);
      }
    };

    startCamera();

    // Очистка при закрытии всего приложения
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 2. ЭТА ЧАСТЬ ЧИНИТ ПРОБЛЕМУ:
  // Каждый раз, когда App перерисовывается (смена экранов),
  // мы проверяем: есть ли видео-тег и подключен ли к нему поток.
  useEffect(() => {
    if (videoRef.current && stream) {
      // Если у видео еще нет потока или он сбился — назначаем заново
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
        // На всякий случай запускаем воспроизведение, если оно встало на паузу
        videoRef.current.play().catch(e => console.log("Play error:", e));
      }
    }
  }); // Важно: нет массива зависимостей, срабатывает при каждом рендере

  return { videoRef };
};