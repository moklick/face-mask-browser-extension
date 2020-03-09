import * as faceApi from 'face-api.js';
import browser from 'webextension-polyfill';

import drawMask from './drawMask';
import { wrap, createCanvas, setDimensions } from './domUtils';
import ImageObserver from './ImageObserver';
import DomMutationObserver from './DomMutationObserver';

const minConfidence = 0.7;

const Mobilenetv1Model = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/0.22.1/weights/ssd_mobilenetv1_model-weights_manifest.json';
const FaceLandmarkModel = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/0.22.1/weights/face_landmark_68_model-weights_manifest.json';
const FaceRecognitionModel = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/0.22.1/weights/face_recognition_model-weights_manifest.json';

async function load() {
  const SsdMobilenetv1Options = faceApi.SsdMobilenetv1Options({ minConfidence });

  await faceApi.loadSsdMobilenetv1Model(Mobilenetv1Model, SsdMobilenetv1Options);
  await faceApi.loadFaceLandmarkModel(FaceLandmarkModel)
  await faceApi.loadFaceRecognitionModel(FaceRecognitionModel)
}

load().then(onModelLoaded);

const imageObserver = new ImageObserver(onImageInViewport);

function onModelLoaded() {
  console.log('model loaded...');
  const images = document.querySelectorAll('img,picture');
  // if there is a nested image/picture only take the top level dom node
  const filteredImages = [].filter.call(
    images,
    img => img.parentNode.nodeName !== 'PICTURE'
  );

  // check dynamically added nodes
  new DomMutationObserver(() => {
    const wrapper = wrap(mutation);
    imageObserver.observe(wrapper);
  });

  // wrap all images with relaitve div and observe if they are within the viewport
  [].forEach.call(filteredImages, img => {
    const wrapper = wrap(img);
    imageObserver.observe(wrapper);
  });
}

function onImageInViewport(wrapper) {
  if (wrapper.classList.contains('has-mask')) {
    return null;
  }

  wrapper.classList.add('has-mask');
  const imgEl = wrapper.querySelector('img');
  imageObserver.unobserve(wrapper);

  const img = new Image();
  img.onload = () => onImageLoad(imgEl, wrapper);
  img.src = imgEl.src;
}

function onImageLoad(imgEl, wrapper) {
  const imgWidth = imgEl.width || imgEl.naturalWidth;
  const imgHeight = imgEl.height || imgEl.naturalHeight;

  if (imgWidth < 40 || imgHeight < 40) {
    return false;
  }

  // we can't do this operation in the content script because of CORS stuff
  // so we need to send it to the background script
  browser.runtime
    .sendMessage({
      message: 'img_to_dataurl',
      url: imgEl.src,
      width: imgWidth,
      height: imgHeight
    })
    .then(res => onMessageResponse(res, wrapper, imgWidth, imgHeight));
}

async function onMessageResponse(res, wrapper, imgWidth, imgHeight) {
  const img = new Image();
  img.src = res.data;

  const results = await faceApi.detectAllFaces(img).withFaceLandmarks();

  // only when we detect faces we add a canvas and draw the masks on it
  if (!results.length) return;

  const canvas = createCanvas(imgWidth, imgHeight);
  const ctx = canvas.getContext('2d');

  setDimensions(wrapper, imgWidth, imgHeight);

  wrapper.appendChild(canvas);

  results.forEach(({ landmarks }) => drawMask(landmarks, ctx));
}
