from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# from pydantic import BaseModel

from PIL import Image
from io import BytesIO
from server.ocr import tesseract
# from server.ocr import transformer

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"]
)

@app.post("/api/read_image")
def read_image(image: UploadFile = File(...)):
    try:
        image = image.file.read()
        image = Image.open(BytesIO(image))
        text = tesseract.ocr(image, config=r"--psm 7")
        del text[-1][1]
        response = { "transcript": text }
        return JSONResponse(content=jsonable_encoder(response), status_code=status.HTTP_200_OK)
    except (HTTPException):
        return HTTPException