import pytesseract
import cv2, numpy
        
def preprocess(image):
    if len(image.shape) > 2:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    image = cv2.adaptiveThreshold(image, 255,
	cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 21, 15)
    return image

def plot_boxes(image, config=""):
    boxes = pytesseract.image_to_data(image, config=config, output_type=pytesseract.Output.DICT)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    for i in range(len(boxes['level'])):
        (x, y, w, h) = (boxes['left'][i], boxes['top'][i], boxes['width'][i], boxes['height'][i])
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
        # cv2.putText(image, boxes["text"][i], (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX,
        #             0.8, (0, 0, 255), 3)
        
    ratio = 800 / image.shape[0]
    cv2.imshow('img', cv2.resize(image, [0, 0], fx=ratio, fy=ratio))
    cv2.waitKey(0)

def ocr(image, config="", view_boxes=False):
    # image = preprocess(numpy.array(image))
    text = pytesseract.image_to_string(image, config=config)
    if view_boxes:
        plot_boxes(image, config=config)
    return text

# image = cv2.imread("./server/ocr/sample/calli.webp")
# text = ocr(image, config=r"-l eng --psm 3", view_boxes=True)
# print(text)

# Page segmentation modes:
#   0    Orientation and script detection (OSD) only.
#   1    Automatic page segmentation with OSD.
#   2    Automatic page segmentation, but no OSD, or OCR. (not implemented)
#   3    Fully automatic page segmentation, but no OSD. (Default)
#   4    Assume a single column of text of variable sizes.
#   5    Assume a single uniform block of vertically aligned text.
#   6    Assume a single uniform block of text.
#   7    Treat the image as a single text line.
#   8    Treat the image as a single word.
#   9    Treat the image as a single word in a circle.
#  10    Treat the image as a single character.
#  11    Sparse text. Find as much text as possible in no particular order.
#  12    Sparse text with OSD.
#  13    Raw line. Treat the image as a single text line,
#        bypassing hacks that are Tesseract-specific.