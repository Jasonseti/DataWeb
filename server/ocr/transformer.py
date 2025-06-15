from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from server.ocr import east
from imutils.object_detection import non_max_suppression

import torch
from tqdm import tqdm
import numpy as np
import cv2


def ocr(image, **kwargs):
    device = torch.device('cpu')
    processor = TrOCRProcessor.from_pretrained('microsoft/trocr-large-handwritten')
    model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-large-handwritten').to(device)
    
    image_segments = east.east_detect(image, **kwargs)
    
    transcript = [[] for _ in range(len(image_segments))]
    for i, _ in enumerate(tqdm(image_segments)):
        for cropped_image in tqdm(image_segments[i], leave=False):
            pixel_values = processor(cropped_image, return_tensors='pt').pixel_values
            generated_ids = model.generate(pixel_values)
            generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            transcript[i].append(generated_text)
            
    return "\n".join([" ".join(t) for t in transcript])

# image = cv2.imread("./server/ocr/sample/receipt.jpg")
# text = ocr(image, k=18, stretch=1.5, min_confidence=0.2, view_boxes=True)
# print(text)
