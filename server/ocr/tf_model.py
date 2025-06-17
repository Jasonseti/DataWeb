import tensorflow as tf
from tensorflow.keras import layers # type: ignore

from matplotlib import pyplot as plt
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
        self._class_names = [str(i) for i in range(10)] + ["-"] + [i for i in string.ascii_lowercase]
        self.train_ds, self.valid_ds = None, None

        self._model_path = model_path
        self.model = self.load_model() 
        self.model = self.model if self.model else \
            self.get_model(input_shape=image_size + [1,], output_length=len(self._class_names))
        # print(self.model.summary())
        self._metrics = [0.0, 0.0]
        
    def get_dataset(self):
        def get_ds_pipeline(digits_image_path, digits_label_path, 
                            letters_image_path, letters_label_path):
            def get_ds(path):
                return idx2numpy.convert_from_file(
                    os.path.join(self._dataset_path, path)
                )
                
            digits_ds = tf.data.Dataset.from_tensor_slices(
                (get_ds(digits_image_path), get_ds(digits_label_path))
            )
            letters_ds = tf.data.Dataset.from_tensor_slices(
                (get_ds(letters_image_path), get_ds(letters_label_path))
            ).map(lambda x, y: (x, y + 10))
            return digits_ds.concatenate(letters_ds) \
                   .map(lambda x, y: (tf.expand_dims(tf.transpose(x), axis=-1), y)) \
                   .shuffle(69420).batch(self._batch_size).prefetch(tf.data.AUTOTUNE)
        
        train_ds = get_ds_pipeline('emnist-mnist-train-images-idx3-ubyte',
                                   'emnist-mnist-train-labels-idx1-ubyte',
                                   'emnist-letters-train-images-idx3-ubyte',
                                   'emnist-letters-train-labels-idx1-ubyte')
        valid_ds = get_ds_pipeline('emnist-mnist-test-images-idx3-ubyte',
                                   'emnist-mnist-test-labels-idx1-ubyte',
                                   'emnist-letters-test-images-idx3-ubyte',
                                   'emnist-letters-test-labels-idx1-ubyte')
        
        # for data in train_ds.take(1):
        #     print(tf.reduce_max(data[1]))
        return train_ds, valid_ds
        
    def get_model(self, input_shape, output_length):
        def ConvBlock(x, filters, kernel_size, strides, padding):
            x = layers.Conv2D(filters, kernel_size, strides=strides, padding=padding)(x)
            x = layers.BatchNormalization()(x)
            x = layers.Activation('relu')(x)
            x = layers.Dropout(0.2)(x)
            return x
        
        inputs = tf.keras.Input(input_shape)
        x = layers.Rescaling(1.0 / 255)(inputs)

        x = layers.Conv2D(64, 3, strides=1, padding='same')(x)
        x = tf.nn.local_response_normalization(x)

        residual = x
        for size in [64, 128, 256, 512]:
            x = ConvBlock(x, size, 3, strides=1, padding='same')
            
            residual = layers.Conv2D(size, 1, strides=1, padding='same')(residual)
            x = layers.add([x, residual])
            residual = x

        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dropout(0.4)(x)
        outputs = layers.Dense(output_length, activation='softmax')(x)

        model = tf.keras.Model(inputs, outputs)
        return model

    def load_model(self):
        model_paths = [path for path in os.listdir(self._model_path) if path[:3] == 'OCR']
        if model_paths:
            return tf.keras.models.load_model(
                os.path.join(self._model_path, model_paths[-1])
            )
    
    def save_model(self):
        _, accuracy = self.test()
        self.model.save(
            os.path.join(self._model_path, "OCR - {:04.1f}%".format(accuracy * 100))
        )
        
    def train(self, learning_rate=1e-3, epochs=1):
        self._metrics[0] = False
        
        if self.train_ds is None:
            self.train_ds, self.valid_ds = self.get_dataset()
        
        self.model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate), 
                           loss='sparse_categorical_crossentropy',
                           metrics=['accuracy'])
        
        self.model.fit(self.train_ds, epochs=epochs)
        self.save_model()
        
    def test(self):
        if self.train_ds is None:
            self.train_ds, self.valid_ds = self.get_dataset()
            
        if not self._metrics[0]:
            loss, accuracy = self.model.evaluate(self.valid_ds)
            self._metrics = [loss, accuracy]
        return self._metrics
        
    def evaluate(self, n=5):
        if self.train_ds is None:
            self.train_ds, self.valid_ds = self.get_dataset()
        
        plt.figure(figsize=(n, n))
        for images, labels in self.valid_ds.take(1):
            predicted_labels = self.predict(images, invert=False)
            true_labels = [self._class_names[label.numpy()] for label in labels]
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
        # Reshape to [28, 28]
        input_image = tf.image.resize(input_image, self._image_size)
        # Trained with black bg format
        if invert:
            input_image = tf.abs(255 - input_image)
        input_image = tf.cast(input_image, dtype=tf.uint8)
        
        logits = self.model(input_image)
        prediction = [self._class_names[i] for i in tf.argmax(logits, axis=-1)]
        return prediction
    

OCR = OCRModel(model_path="server/ocr/models", batch_size=128)
OCR.train(learning_rate=1e-3)
OCR.evaluate(n=10)