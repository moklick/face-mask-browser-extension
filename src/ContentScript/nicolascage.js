import clm from 'clmtrackr';
import browser from 'webextension-polyfill';

import { wrap, createCanvas } from './domUtils';
import ImageObserver from './ImageObserver';
import DomMutationObserver from './DomMutationObserver';
import faceDeformer from './facedeformer';
import pModel from 'clmtrackr/models/model_pca_20_svm';
import cageMask from './cagemask-positions';

const imageObserver = new ImageObserver(onImageInViewport);
const cageImageSrc = browser.runtime.getURL('assets/cage.jpg');
const cageImage = new Image();

cageImage.onload = () => {
  wrapImages();
};

cageImage.src = cageImageSrc;

function wrapImages() {
  console.log('start...');
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
  const ctracker = new clm.tracker({
    faceDetection: {
      useWebWorkers: false
    }
  });
  ctracker.init(pModel);

  const fd = new faceDeformer();
  const img = new Image();

  img.onload = () => {
    const canvas = createCanvas(imgWidth, imgHeight);
    const dummyCanvas = createCanvas(imgWidth, imgHeight);
    const dummyCtx = dummyCanvas.getContext('2d');
    dummyCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

    ctracker.start(dummyCanvas);
    fd.init(canvas);
    fd.load(cageImage, cageMask, pModel);

    setTimeout(() => {
      const pos = ctracker.getCurrentPosition();
      if (pos) {
        fd.draw(pos);
        wrapper.appendChild(canvas);
      }
      ctracker.stop();
    }, 3000);
  };

  img.src = res.data;
}
