FROM python:3.10-slim

WORKDIR /app

# Ставим системные библиотеки для работы с изображениями
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Копируем список библиотек и устанавливаем
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --timeout 1000

# Копируем весь код из текущей папки внутрь контейнера
COPY . .

EXPOSE 8000

# ВАЖНО: Кавычки должны быть двойными, и никакого мусора в конце строки!
CMD ["python", "server.py"]