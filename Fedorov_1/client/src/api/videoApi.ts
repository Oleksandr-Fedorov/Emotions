const API_URL = 'http://localhost:8000'; // Адрес твоего Python сервера

// Описываем, что сервер нам возвращает
interface EmotionResponse {
  emotion: string;
  error?: string;
}

export const sendFrameToAnalyze = async (blob: Blob): Promise<EmotionResponse | null> => {

    // --- ОТЛАДКА НАЧАЛО ---
  console.group('Отправка кадра');
  console.log('Размер (bytes):', blob.size);
  console.log('Тип:', blob.type);
  
  // Создаем ссылку, чтобы открыть картинку в новой вкладке
  const debugUrl = URL.createObjectURL(blob);
  console.log('Посмотреть отправляемую картинку:', debugUrl);
  // --- ОТЛАДКА КОНЕЦ ---

  
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