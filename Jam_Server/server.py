from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import traceback

app = Flask(__name__)
CORS(app)

def get_final_answer(dominant_emotion):
    positive = ["happy", "surprise"]
    negative = ["angry", "disgust", "fear", "sad"]

    if dominant_emotion in positive:
        return "positive"
    elif dominant_emotion in negative:
        return "negative"
    else:
        return "neutral"

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        try:
            img_array = np.frombuffer(file.read(), np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError("Image decoding failed")
        except Exception as img_error:
            print(f"❌ Ошибка картинки: {img_error}")
            return jsonify({"emotion": "neutral", "score": 0}), 200

        try:
            results = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
            result = results[0] if isinstance(results, list) else results

            raw_emotion = result['dominant_emotion']
            final_category = get_final_answer(raw_emotion) # positive, negative или neutral
            all_emotions = result['emotion']

            # --- РАСЧЕТ ПРОЦЕНТОВ ---
            # Мы складываем проценты всех эмоций выбранной категории
            total_score = 0
            if final_category == "positive":
                total_score = all_emotions.get('happy', 0) + all_emotions.get('surprise', 0)
            elif final_category == "negative":
                # Сумма всех негативных
                total_score = sum(all_emotions.get(x, 0) for x in ["angry", "disgust", "fear", "sad"])
            else:
                total_score = all_emotions.get('neutral', 0)

            # --- ЛОГ ---
            print(f"📸 Cat: {final_category.upper()} | Score: {total_score:.2f}%")
            # -----------

            return jsonify({
                "emotion": final_category,
                "score": float(total_score)# Возвращаем процент (0-100)
            })

        except Exception as deepface_error:
            print(f"⚠️ Ошибка DeepFace: {deepface_error}")
            return jsonify({"emotion": "neutral", "score": 0}), 200

    except Exception as e:
        print(f"🔥 CRITICAL: {e}")
        return jsonify({"emotion": "neutral", "score": 0}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000, debug=True)