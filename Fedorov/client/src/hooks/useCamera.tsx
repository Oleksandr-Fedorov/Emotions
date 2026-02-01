import { useEffect, useRef, useState } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            // ЗАПРАШИВАЕМ HD КАЧЕСТВО
            // Это даст картинку четче и в формате 16:9 (широкую),
            // что лучше подходит под современные экраны и твою широкую рамку.
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { videoRef, isReady };
};