import numpy as np
import cv2, time
from imutils.object_detection import non_max_suppression
from sklearn.cluster import KMeans

def get_optimal_dimension(image):
    H, W = image.shape[:2]
    H, W = np.round(H / 32) * 32, np.round(W / 32) * 32
    return [int(H), int(W)]

def sort_boxes(boxes, k):
    data = np.reshape(
        (boxes[..., 1] + boxes[..., 3]) / 2.0,
        [-1, 1]
    )
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(data)
    
    box_clusters = [[] for _ in range(np.max(kmeans.labels_) + 1)]
    for i, label in enumerate(kmeans.labels_):
        box_clusters[label].append(boxes[i])
    box_clusters = sorted(box_clusters, 
                          key=lambda x: (x[0][1] + x[0][3]) / 2.0)

    for i in range(len(box_clusters)):
        box_clusters[i] = sorted(box_clusters[i],
                                 key=lambda x: (x[0] + x[2]) / 2.0)
            
    return box_clusters
        
def east_detect(image, dimension=[], stretch=1.0, min_confidence=0.5, k=0, view_boxes=False):
    original_image = image.copy()
    if len(image.shape) == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    
    original_dimension = original_image.shape[:2]
    dimension = dimension if dimension else get_optimal_dimension(image)
    H, W = image.shape[:2]
    image = cv2.resize(image, dimension)
    
    print("[INFO] loading EAST text detector...")
    start = time.time()
    layerNames = [
        "feature_fusion/Conv_7/Sigmoid",
        "feature_fusion/concat_3"
    ]
    net = cv2.dnn.readNet("./server/ocr/models/frozen_east_text_detection.pb")
    blob = cv2.dnn.blobFromImage(image, 1.0, dimension[::-1], swapRB=True, crop=False)
    net.setInput(blob)
    scores, geometry = net.forward(layerNames)
    
    end = time.time()
    print("[INFO] text detection took {:.6f} seconds".format(end - start))

    # Convert feature maps into box coordinates
    boxes = []
    confidences = []
    for y in range(0, scores.shape[2]):
        for x in range(0, scores.shape[3]):
            score = scores[0, 0, y, x]
            (offsetX, offsetY) = (x * 4.0, y * 4.0)
            x1, y1, x2, y2 = geometry[0, :4, y, x] * stretch
            angle = geometry[0, 4, y, x]
            cos, sin = np.cos(angle), np.sin(angle)
            
            if score < min_confidence:
                continue
            endX = int(offsetX + (cos * y1) + (sin * x2))
            endY = int(offsetY - (sin * y1) + (cos * x2))
            startX = int(endX - (y1 + y2))
            startY = int(endY - (x1 + x2))
                
            boxes.append([startX, startY, endX, endY])
            confidences.append(score)
                     
    # Wrap up and plot boxes
    boxes = non_max_suppression(np.array(boxes), probs=confidences)
    boxes = sort_boxes(boxes, k)
    
    rH, rW = H / dimension[0], W / dimension[1]
    image_segments = [[] for _ in range(len(boxes))]
    image_copy = original_image.copy()
    for i, _ in enumerate(boxes):
        for j, (startX, startY, endX, endY) in enumerate(boxes[i]):
            startX = int(startX * rW)
            startY = int(startY * rH)
            endX = int(endX * rW)
            endY = int(endY * rH)
            
            image_segments[i].append(original_image[startY: endY, startX: endX])
            if view_boxes:
                cv2.rectangle(image_copy, (startX, startY), (endX, endY), (0, 255, 0), 2)
                cv2.putText(image_copy, str(j + 1), (startX, startY - 10), cv2.FONT_HERSHEY_SIMPLEX,
                            0.8, (0, 0, 255), 3)
        
    if view_boxes:
        ratio = min(800 / original_dimension[0], 1600 / original_dimension[1])
        cv2.imshow("", cv2.resize(image_copy, [0, 0], fx=ratio, fy=ratio))
        cv2.waitKey()
    return image_segments

image = cv2.imread("./server/ocr/sample/test.jpeg")
east_detect(image, k=4, stretch=1.5, min_confidence=0.2, view_boxes=True)
