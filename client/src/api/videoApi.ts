const API_URL = 'http://localhost:8000'; 

// Обновляем интерфейс ответа
interface EmotionResponse {
  emotion: string;
  score: number; // <-- Добавили процент
  error?: string;
}

export const sendFrameToAnalyze = async (blob: Blob): Promise<EmotionResponse | null> => {
 //     // --- ОТЛАДКА НАЧАЛО ---
//   // --- ВРЕМЕННЫЙ КОД ДЛЯ ОТЛАДКИ ---
// const debugUrl = URL.createObjectURL(blob);
// const img = document.createElement('img');
// img.src = debugUrl;
// img.style.position = 'fixed';
// img.style.bottom = '10px';
// img.style.right = '10px';
// img.style.width = '200px';
// img.style.border = '5px solid red';
// img.style.zIndex = '9999';
// document.body.appendChild(img);

// // Убираем картинку через 3 секунды, чтобы не засорять экран
// setTimeout(() => document.body.removeChild(img), 3000);
// --------------------------------
//   // --- ОТЛАДКА КОНЕЦ ---
  const formData = new FormData();
  formData.append('file', blob);

  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};