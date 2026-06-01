# VisionAI — Image Caption

Application web de génération automatique de légendes d'images par intelligence artificielle, développée dans le cadre du module Intelligence Artificielle à l'ENSTAB.

---

## Description

VisionAI utilise le modèle **BLIP** (Bootstrapping Language-Image Pre-training) de Salesforce pour analyser une image uploadée et générer automatiquement une description textuelle en anglais. L'utilisateur charge une photo, clique sur un bouton, et obtient une légende produite par un modèle Transformer vision-langage en quelques secondes.

---

## Architecture du modèle

```
Image (PNG / JPG / WEBP)
        │
        ▼
┌─────────────────────────────────┐
│   Image Processor (BLIP)        │
│   Resize 384×384 → pixel_values │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Vision Encoder (ViT-Base)     │
│   Patches 16×16 → embeddings    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Language Decoder (Transformer)│
│   Beam Search (n=4) → tokens    │
└──────────────┬──────────────────┘
               │
               ▼
      "a cat sitting on a table"
```

---

## Technologies utilisées

| Couche | Technologie |
|---|---|
| Modèle IA | Salesforce/blip-image-captioning-base |
| Framework ML | PyTorch 2.6 |
| NLP | HuggingFace Transformers 4.36 |
| Backend | FastAPI + Uvicorn |
| Frontend | HTML5 / CSS3 / JavaScript |
| Templates | Jinja2 |

---

## Installation et exécution

### Prérequis
- Python 3.11
- ~3 Go d'espace disque

### 1. Cloner le projet
```bash
git clone https://github.com/tasnimboudrigua-lang/image-captioning-ai.git
cd image-captioning-ai
```

### 2. Créer l'environnement virtuel
```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac / Linux
```

### 3. Installer les dépendances
```bash
pip install torch==2.6.0 torchvision --index-url https://download.pytorch.org/whl/cpu
pip install transformers==4.36.0 fastapi uvicorn[standard] python-multipart pillow
```

### 4. Lancer l'application
```bash
uvicorn app:app --reload
```

### 5. Ouvrir dans le navigateur
```
http://localhost:8000
```

> Le modèle BLIP (~900 Mo) est téléchargé automatiquement au premier démarrage.

---

## Exemples de résultats

| Image | Légende générée |
|---|---|
| Chien sur la plage | *"a dog running on the beach near the ocean"* |
| Skyline de nuit | *"a city skyline at night with lights reflecting on the water"* |
| Bureau avec ordinateur | *"a desk with a computer monitor and a keyboard on it"* |
| Fleurs dans un vase | *"a vase of flowers sitting on a table next to a window"* |

---

## Structure du projet

```
image-captioning-ai/
├── app.py                  # Backend FastAPI + inférence BLIP
├── requirements.txt        # Dépendances Python
├── Dockerfile              # Déploiement HuggingFace Spaces
├── templates/
│   └── index.html          # Interface utilisateur
├── static/
│   ├── css/style.css       # Feuille de style
│   └── js/main.js          # Logique frontend
```

---
## video demo 
https://www.loom.com/share/8a41b0bc2f524bcc9dcb6de772e1ad62


## Auteur

**Tasnim Boudriga**
Étudiante en 2eme cycle ingénieur specialité technologie avancé - EAN — ENSTAB
École Nationale des Sciences et Technologies Avancées de Borj Cédria

---

## École

Projet réalisé dans le cadre du module Intelligence Artificielle — EAN.
Modèle BLIP : licence Apache 2.0 © Salesforce Research.