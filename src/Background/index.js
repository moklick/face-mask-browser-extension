import {
  detectAllFaces,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
  SsdMobilenetv1Options
} from 'face-api.js';
import browser from 'webextension-polyfill';

const minConfidence = 0.7;

const FaceLandmarkModel = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/0.22.1/weights/face_landmark_68_model-weights_manifest.json';
const FaceRecognitionModel = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/0.22.1/weights/face_recognition_model-weights_manifest.json';
const Mobilenetv1Model = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/0.22.1/weights/ssd_mobilenetv1_model-weights_manifest.json';

let modelLoaded = false;
let modelLoading = null;

function loadModel() {
  if (modelLoaded) return;

  modelLoading = modelLoading || Promise.all([
    loadFaceLandmarkModel(FaceLandmarkModel),
    loadFaceRecognitionModel(FaceRecognitionModel),
    loadSsdMobilenetv1Model(Mobilenetv1Model, new SsdMobilenetv1Options({ minConfidence }))
  ]).then(() => {
    console.log('model loaded...');
    modelLoaded = true;
  }).catch(error => {
    modelLoading = null;
    console.error(error);
    throw error;
  });

  return modelLoading;
}

function loadImage({ height, url, width }) {
  return new Promise((resolve, reject) => {
    const img = new Image(width, height);

    img.onerror = reject;
    img.onload = () => {
      return resolve(img);
    };

    img.src = url;
  });
}

browser.runtime.onMessage.addListener(({ height, message, url, width }, sender) => {
  if (message === 'detect_faces') {
    return Promise.all([loadImage({ height, url, width }), loadModel()]).then(([img]) => {
      return detectAllFaces(img).withFaceLandmarks();
    }).then(faces => {
      return faces.map(({ landmarks }) => ({
        jawOutline: landmarks.getJawOutline().map(({ x, y }) => ({ x, y })),
        nose: landmarks.getNose().map(({ x, y }) => ({ x, y }))
      }));
    });
  }
});

loadModel();
