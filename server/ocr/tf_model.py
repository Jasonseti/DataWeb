import tensorflow as tf
from tensorflow.keras import layers # type: ignore

from matplotlib import pyplot as plt
from sklearn.utils import class_weight
import os, string
import idx2numpy
import numpy as np

# Allow Memory Growth
gpu = tf.config.experimental.list_physical_devices('GPU')[0] 
tf.config.experimental.set_memory_growth(gpu, True)
        
class OCRModel:
    def __init__(self, model_path="", batch_size=64, image_size=[28, 28]):
        self._batch_size = batch_size
        self._image_size = image_size
        self._dataset_path = r"C:\Users\Jason Setiono\Jupyter Files\Datasets\Extended MNIST\emnist_source_files"
        self._class_names = list(string.digits + string.ascii_uppercase + string.ascii_lowercase)
        self.train_ds, self.valid_ds = None, None

        self._model_path = model_path
        self.model = self.load_model() 
        self.model = self.model if self.model else \
            self.get_model(input_shape=image_size + [1,], output_length=len(self._class_names))
        # print(self.model.summary())
        self.class_weight = None
        self._metrics = [False, 0.0, 0.0]
        
    def load_dataset(self):
        def get_ds(path):
            return idx2numpy.convert_from_file(
                os.path.join(self._dataset_path, path)
            )
        def get_ds_pipeline(image_path, label_path):
            return tf.data.Dataset.from_tensor_slices(
                (get_ds(image_path), get_ds(label_path))
            ).map(lambda x, y: (
                    tf.expand_dims(tf.transpose(tf.where(x > 127, 255, 0)), axis=-1), 
                    y
                )
            ).shuffle(69420).batch(self._batch_size).prefetch(tf.data.AUTOTUNE)
        
        self.train_ds = get_ds_pipeline('emnist-byclass-train-images-idx3-ubyte',
                                        'emnist-byclass-train-labels-idx1-ubyte')
        self.valid_ds = get_ds_pipeline('emnist-byclass-test-images-idx3-ubyte',
                                        'emnist-byclass-test-labels-idx1-ubyte')
        
        labels = get_ds('emnist-byclass-train-labels-idx1-ubyte')
        self.class_weight = class_weight.compute_class_weight('balanced', classes=np.unique(labels), y=labels)
        self.class_weight = {i : self.class_weight[i] for i in range(len(self.class_weight))}
        
        # for data in self.train_ds.take(1):
        #     print((data[1]))
        
    def get_model(self, input_shape, output_length):
        def ConvBlock(x, filters, kernel_size, strides, padding):
            x = layers.Conv2D(filters, kernel_size, strides=strides, padding=padding)(x)
            x = layers.BatchNormalization()(x)
            x = layers.Activation('relu')(x)
            x = layers.Dropout(0.2)(x)
            return x
        
        inputs = tf.keras.Input(input_shape)
        x = layers.Rescaling(1.0 / 255)(inputs)

        x = layers.Conv2D(32, 3, strides=1, padding='same', activation='relu')(x)
        x = tf.nn.local_response_normalization(x)

        residual = x
        for size in [64, 128]:
            x = ConvBlock(x, size, 3, strides=1, padding='same')
            x = ConvBlock(x, size, 3, strides=1, padding='same')
            x = layers.MaxPooling2D(pool_size=2)(x)
            
            residual = layers.Conv2D(size, 2, strides=2, padding='same', activation='relu')(residual)
            x = layers.add([x, residual])
            residual = x

        x = layers.Conv2D(256, 3, strides=1, padding='same', activation='relu')(x)
        x = layers.Flatten()(x)
        x = layers.Dropout(0.4)(x)
        outputs = layers.Dense(output_length, activation='softmax')(x)

        model = tf.keras.Model(inputs, outputs)
        return model

    def load_model(self):
        model_paths = [path for path in os.listdir(self._model_path)]
        if model_paths:
            return tf.keras.models.load_model(
                os.path.join(self._model_path, model_paths[0])
            )
    
    def save_model(self):
        if self._metrics[0] == False:
            self.update_metrics()
            
        self.model.save(
            os.path.join(self._model_path, "OCR - {:04.1f}%".format(self._metrics[2] * 100))
        )
        
    def train(self, learning_rate=1e-3, epochs=1):
        self._metrics[0] = False
        if self.train_ds is None:
            self.load_dataset()
        
        self.model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate), 
                           loss='sparse_categorical_crossentropy',
                           metrics=['accuracy'])
        
        self.model.fit(self.train_ds, epochs=epochs, class_weight=self.class_weight)
        self.save_model()
        
    def update_metrics(self):
        if self.train_ds is None:
            self.load_dataset()
        
        loss, accuracy = self.model.evaluate(self.valid_ds)
        self._metrics = [True, loss, accuracy]
        
    def evaluate(self, n=5):
        if self.train_ds is None:
            self.load_dataset()
        
        plt.figure(figsize=(n, n))
        for images, labels in self.valid_ds.take(1):
            predicted_labels = self.predict(images, invert=False)
            true_labels = [self._class_names[label] for label in labels]
            plt.suptitle("Predicted Accuracy - {:04.2f}%".format(
                tf.reduce_sum(tf.cast(tf.equal(predicted_labels, true_labels), tf.uint8)) / self._batch_size * 100
            ))
            for i in range(n ** 2):
                plt.subplot(n, n, i + 1)
                plt.imshow(images[i], cmap='gray')
                plt.title(true_labels[i] + " | " + predicted_labels[i], \
                          color='black' if true_labels[i] == predicted_labels[i] else 'red')
                plt.axis('off')
        plt.tight_layout()
        plt.show()
        
    # Expects uint8 format
    def __call__(self, input_image, **kwargs):
        return self.predict(input_image, **kwargs)
    
    def predict(self, input_image, invert=True):
        # Dims to 4
        if len(tf.shape(input_image)) == 3:
            input_image = tf.expand_dims(input_image, axis=-1)
        # Reshape
        if input_image.shape[1] != self._image_size[0]:
            input_image = tf.image.resize(input_image, self._image_size)
        # Trained with black bg format
        input_image = tf.cast(input_image, tf.int32)
        if invert:
            input_image = tf.abs(255 - input_image)
        
        logits = self.model(input_image)
        predictions = [self._class_names[i] for i in tf.argmax(logits, axis=-1)]
        
        # plt.figure()
        # for i, (image, prediction) in enumerate(zip(input_image, predictions)):
        #     plt.subplot(1, len(predictions), i + 1)
        #     plt.imshow(image, cmap='gray')
        #     plt.title(prediction)
        #     plt.axis('off')
        # plt.tight_layout()
        # plt.show()
        return predictions
    

OCR = OCRModel(model_path="server/ocr/models", batch_size=128)
# OCR.train(learning_rate=1e-4)
# OCR.evaluate(n=10)