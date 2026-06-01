# ── Dockerfile pour Hugging Face Spaces ──────────────────────────────────────
# Base : Python 3.11 slim (léger, compatible avec PyTorch CPU)
FROM python:3.11-slim

# Répertoire de travail dans le conteneur
WORKDIR /app

# Installation des dépendances système nécessaires à Pillow et à PyTorch
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copie et installation des dépendances Python en premier
# (permet de profiter du cache Docker si requirements.txt n'a pas changé)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du reste du code source
COPY . .

# Hugging Face Spaces expose le port 7860 par convention
EXPOSE 7860

# Lancement de l'application FastAPI via Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
