import React, { useEffect, useRef, useState } from 'react';
import { MagicMirror } from '../MagicMirror';

interface LevelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  emotion: string;
  onNextLevel: () => void;
}

type Stage = 'intro' | 'calibration_neutral' | 'calibration_happy' | 'success';

export const LevelOne: React.FC<LevelProps> = ({ videoRef, emotion, onNextLevel }) => {
  const [stage, setStage] = useState<Stage>('intro');
  // Для отображения прогресса (0..1)
  const [progress, setProgress] = useState<number>(0);

  // ref, где храним timestamp начала совпадения (ms) или null
  const matchStartRef = useRef<number | null>(null);

  // Конфиг: сколько миллисекунд нужно удерживать эмоцию
  const REQUIRED_HOLD_MS = 2000; // измените под частоту обновления сервера (например 3000)

  // Эффект: наблюдаем за изменениями внешней эмоции и стадии
  useEffect(() => {
    if (stage === 'intro' || stage === 'success') {
      // если мы в интро или уже завершили — сбрасываем прогресс и ref
      matchStartRef.current = null;
      setProgress(0);
      return;
    }

    const targetEmotion = stage === 'calibration_neutral' ? 'neutral' : 'happy';

    // Считаем, что некоторые ответы сервера могут быть вариативны — разрешаем небольшие альтернативы
    const matches =
      targetEmotion === 'happy'
        ? ['happy', 'smile', 'joy', 'lol', 'warm'].includes(emotion)
        : emotion === 'neutral';

    if (matches) {
      // если совпадает и matchStart ещё нет — стартуем
      if (!matchStartRef.current) {
        matchStartRef.current = Date.now();
        setProgress(0);
      }
      // иначе — проверим, дошли ли до порога
      const elapsed = Date.now() - (matchStartRef.current ?? Date.now());
      if (elapsed >= REQUIRED_HOLD_MS) {
        // продвинулись на следующую стадию
        if (stage === 'calibration_neutral') {
          setStage('calibration_happy');
        } else if (stage === 'calibration_happy') {
          setStage('success');
        }
        matchStartRef.current = null;
        setProgress(0);
      } else {
        // частичный прогресс — но не форсируем лишний рендер часто; обновляем progress каждые 100ms через второй эффект
      }
    } else {
      // если не совпадает — сбрасываем
      matchStartRef.current = null;
      setProgress(0);
    }
    // зависит только от внешней эмоции и стадии
  }, [emotion, stage]);

  // Эффект: пока идёт удержание — обновляем progress каждые 100ms (для UI)
  useEffect(() => {
    let timer: number | undefined;
    if (matchStartRef.current) {
      timer = window.setInterval(() => {
        const start = matchStartRef.current;
        if (!start) {
          setProgress(0);
          return;
        }
        const p = Math.min(1, (Date.now() - start) / REQUIRED_HOLD_MS);
        setProgress(p);
      }, 100);
    } else {
      // если удерживания нет — обнуляем прогресс
      setProgress(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
    // пересчитываем, когда меняется стадия или референс старт/стоп (через emotion -> matchStartRef меняется)
  }, [emotion, stage]);

  const getMessage = () => {
    switch (stage) {
      case 'calibration_neutral':
        return 'Сделай серьезное лицо...';
      case 'calibration_happy':
        return 'Отлично! А теперь улыбнись!';
      case 'success':
        return 'Калибровка завершена! Система готова.';
      default:
        return '';
    }
  };

  return (
    <div className="level-container">
      <aside className="sidebar">
        <h2>Уровень 1</h2>
        <p style={{ opacity: 0.7, marginTop: '10px' }}>
          <b>Статус:</b> {stage === 'success' ? '✅ Готово' : '⏳ Калибровка...'}
          <br />
          <br />
          Система изучает вашу мимику. Следуйте инструкциям на экране.
        </p>
      </aside>

      <main className="main-content">
        <div className="video-wrapper">
          <video ref={videoRef} muted playsInline className="camera-video" />

          {stage === 'intro' && (
            <div className="intro-overlay">
              <div className="intro-content">
                <div className="intro-mask-wrapper">
                  <MagicMirror currentEmotion="happy" />
                </div>
                <p className="intro-text">
                  Привет! Я твое цифровое зеркало.
                  <br />
                  Давай настроим связь.
                </p>
                <button className="start-button" onClick={() => setStage('calibration_neutral')}>
                  Начать тест
                </button>
              </div>
            </div>
          )}

          {stage !== 'intro' && (
            <div className="dialogue-section">
              <div className="mini-mask-wrapper">
                <MagicMirror currentEmotion={emotion} />
              </div>

              <div className="chat-bubble">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{getMessage()}</span>
                  <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                    Детекция: {emotion} {progress > 0 ? `(Прогресс ${Math.round(progress * 100)}%)` : ''}
                  </span>
                </div>

                {stage === 'success' && (
                  <button className="next-level-btn" onClick={onNextLevel}>
                    Далее →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
