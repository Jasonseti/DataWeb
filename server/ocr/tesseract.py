from sklearn.cluster import KMeans
import pytesseract
import numpy as np
import cv2, re

def show_image(image):
    ratio = min(800 / image.shape[0], 800 / image.shape[1])
    cv2.imshow("", cv2.resize(image, [0, 0], fx=ratio, fy=ratio))
    cv2.waitKey()
    
def preprocess_image(image):
    # Threshold
    if len(image.shape) > 2:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    _, image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # Denoise
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
    # Dilate Lines
    image = cv2.dilate(image, np.ones((3, 3), np.uint8), iterations = 1)
    image = cv2.erode(image, np.ones((5, 5), np.uint8), iterations = 1)
    
    return image

def find_boxes(image):
    # Find boxes
    contours, hierarchies = cv2.findContours(
        image,
        cv2.RETR_TREE,
        cv2.CHAIN_APPROX_SIMPLE
    )
    boxes = []
    for contour, hierarchy in zip(contours, hierarchies[0]):
        x, y, w, h = cv2.boundingRect(contour)
        pass_area_limit = 5000 < cv2.contourArea(contour) < 4e5
        shape_is_squarish = 10 * w > h and 10 * h > w
        if pass_area_limit and shape_is_squarish:
            # boxes in x1, y1, x2, y2 format
            boxes.append([x, y, x + w, y + h])
            
    return np.array(boxes)

def cluster_and_sort_boxes(boxes, k):
    # Cluster vertically 
    data = np.reshape(
        (boxes[:, 1] + boxes[:, 3]) / 2.0,
        [-1, 1]
    )
    kmeans = KMeans(n_clusters = k)
    kmeans.fit(data)
    
    # Group boxes by cluster
    box_clusters = [[] for _ in range(np.max(kmeans.labels_) + 1)]
    for i, label in enumerate(kmeans.labels_):
        box_clusters[label].append(boxes[i])
    
    # Sort boxes top left -> bottom right
    box_clusters = sorted(box_clusters, 
                          key=lambda x: (x[0][1] + x[0][3]) / 2.0)
    for i in range(len(box_clusters)):
        box_clusters[i] = sorted(box_clusters[i],
                                 key=lambda x: (x[0] + x[2]) / 2.0)
        
    return box_clusters
    
def segment_and_read_image(image, box_clusters, config="", view_segments=False):
    # Segment and read image by cluster hierarchy
    transcript = [[] for _ in range(len(box_clusters))]
    if view_segments:
        image_copy = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    for i, boxes in enumerate(box_clusters):
        for j, box in enumerate(boxes):
            x1, y1, x2, y2 = box
            cropped_image = image[y1: y2, x1: x2]
            data = pytesseract.image_to_data(
                cropped_image, 
                config=config, 
                output_type=pytesseract.Output.DICT
            )
            text = "".join(data["text"]).replace("\n", "")
            if j in [1, 4, 5]:
                text = text.lower() 
            if j in [0]:
                text = re.sub(r"(\w)([A-Z])", r"\1 \2", text).strip()
                text = text[0].upper() + text[1:]
            if j in [4]:
                text = text if len(text) > 2 else '-'
            transcript[i].append(text)
            
            if view_segments:
                # Draw Tesseract box
                for k in range(len(data['level'])):
                    x, y, w, h = data['left'][k], data['top'][k], data['width'][k], data['height'][k]
                    cv2.rectangle(image_copy, (x1 + x, y1 + y), (x1 + x + w, y1 + y + h), 
                                  (255, 0, 0), 4)
                # Draw grid line
                cv2.rectangle(image_copy, (x1, y1), (x2, y2), 
                              (0, 255, 0), 10, cv2.LINE_AA)
                cv2.putText(image_copy, str(j + 1) + '| ', (x1, y1 + 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
                # Put Tesseract text
                cv2.putText(image_copy, text, 
                            (x1 + 50, y1 + 10), cv2.FONT_HERSHEY_SIMPLEX,
                            1.8, (255, 0, 0), 3)
        
    if view_segments:
        show_image(image_copy)
    return transcript

def ocr(image, config="", view_segments=False):
    image = np.array(image)
    image = preprocess_image(image)
    
    boxes = find_boxes(image)
    box_clusters = cluster_and_sort_boxes(boxes, k=4)
    
    transcript = segment_and_read_image(
        image, box_clusters, 
        config=config, view_segments=view_segments
    )
    
    return transcript

image = cv2.imread("./server/ocr/sample/final.jpeg")
transcript = ocr(image, config=r"--psm 7", view_segments=True)
print(transcript)

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