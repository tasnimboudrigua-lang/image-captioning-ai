import io
import logging
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

MODEL_NAME = "Salesforce/blip-image-captioning-base"
device = "cpu"
logger.info("Chargement...")
processor = BlipProcessor.from_pretrained(MODEL_NAME)
model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME).to(device)
model.eval()
logger.info("OK")

def generate_caption(image: Image.Image) -> str:
    image = image.resize((384, 384)).convert("RGB")
    pixel_values = processor.image_processor(
        images=image,
        return_tensors="pt"
    ).pixel_values.to(device)
    with torch.no_grad():
        ids = model.generate(
            pixel_values=pixel_values,
            max_new_tokens=50,
            num_beams=4,
        )
    return processor.tokenizer.decode(ids[0], skip_special_tokens=True).strip()

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/caption")
async def caption_image(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(400, detail=str(e))
    try:
        logger.info(f"Generation : {file.filename}")
        caption = generate_caption(image)
        logger.info(f"Legende : {caption}")
    except Exception as e:
        logger.error(f"Erreur : {str(e)}")
        raise HTTPException(500, detail=f"Erreur: {str(e)}")
    return JSONResponse({"caption": caption, "filename": file.filename, "device": "cpu"})

@app.get("/health")
async def health():
    return {"status": "ok"}