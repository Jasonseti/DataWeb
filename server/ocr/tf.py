from sklearn.cluster import KMeans
from tf_model import OCR
import tensorflow as tf
import numpy as np
import cv2

def show_image(image):
    ratio = min(800 / image.shape[0], 1600 / image.shape[1])
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
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )
    boxes = []
    for contour, hierarchy in zip(contours, hierarchies[0]):
        pass_area_limit = 1000 < cv2.contourArea(contour) < 4e5
        shape_is_closed = hierarchy[2] < 0 and hierarchy[3] < 0
        shape_is_squarish = np.divide(
            cv2.arcLength(contour, closed=True),
            np.sqrt(cv2.contourArea(contour))
        ) < 6.9
        if pass_area_limit and shape_is_closed and shape_is_squarish:
            # boxes in x1, y1, x2, y2 format
            x, y, w, h = cv2.boundingRect(contour)
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
    
def segment_and_read_image(model, image, box_clusters, view_segments=False):
    def segment_image(image, box):
        x1, y1, x2, y2 = box
        cropped_image = image[y1: y2, x1: x2]
        
        if view_segments:
            cv2.rectangle(image_copy, (x1, y1), (x2, y2), 
                          (0, 255, 0), 10, cv2.LINE_AA)
            
        return cropped_image
    
    def find_letters(image, offset):
        contours, hierarchies = cv2.findContours(
            image,
            cv2.RETR_TREE,
            cv2.CHAIN_APPROX_SIMPLE
        )
        
        letter_boxes = []
        for contour, hierarchy in zip(contours, hierarchies[0]):
            if cv2.contourArea(contour) > 100 and hierarchy[3] > -1:
                # boxes in x, y, w, h format
                letter_boxes.append(cv2.boundingRect(contour))
        letter_boxes = sorted(letter_boxes, key=lambda x: x[0])

        cropped_letters = []
        offset_x, offset_y = offset
        for i, letter_box in enumerate(letter_boxes):
            x, y, w, h = letter_box
            cropped_letters.append(image[y: y + h, x: x + w])
            
            if view_segments:
                cv2.rectangle(image_copy, (offset_x + x, offset_y + y), (offset_x + x + w, offset_y + y + h), 
                              (255, 0, 0), 4)
                cv2.putText(image_copy, str(i + 1), (offset_x + x, offset_y + y + 10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
        
        return cropped_letters
    
    def predict_letters(letters, offset):
        letters = np.array([cv2.resize(letter, [28, 28]) for letter in letters])
        text = model.predict(letters, invert=True) if len(letters) > 0 else ""
        text = "".join(text)
        
        if view_segments:
            offset_x, offset_y = offset
            cv2.putText(image_copy, text, (offset_x, offset_y + 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 2.0, (0, 0, 255), 3)
            
        return text
    
    # Segment and read image by cluster hierarchy
    transcript = [[] for _ in range(len(box_clusters))]
    if view_segments:
        image_copy = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    for i, boxes in enumerate(box_clusters):
        for box in boxes:
            cropped_image = segment_image(image, box)
            cropped_letters = find_letters(cropped_image, offset=box[:2])
            
            text = predict_letters(cropped_letters, offset=box[:2])
            transcript[i].append(text)
        
    if view_segments:
        show_image(image_copy)
    return transcript

def ocr(image, view_segments=False):
    image = np.array(image)
    image = preprocess_image(image)
    
    boxes = find_boxes(image)
    box_clusters = cluster_and_sort_boxes(boxes, k=4)
    
    transcript = segment_and_read_image(
        OCR, image, box_clusters, view_segments=view_segments
    )
    
    return transcript

image = cv2.imread("./server/ocr/sample/test.jpeg")
transcript = ocr(image, view_segments=True)
print(transcript)