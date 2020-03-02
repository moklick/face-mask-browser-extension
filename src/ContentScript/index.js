import ml5 from 'ml5';
import browser from 'webextension-polyfill';

import drawMask from './drawMask';
import { wrap, createCanvas, setDimensions } from './domUtils';
import ImageObserver from './ImageObserver';
import DomMutationObserver from './DomMutationObserver';

const faceapi = ml5.faceApi(
  {
    withLandmarks: true,
    withDescriptors: false,
    minConfidence: 0.7
  },
  onModelLoaded
);

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

  faceapi.detect(img, (err, results) => {
    if (err || !results.length) {
      return false;
    }

    // only when we detect faces we add a canvas and draw the masks on it
    const canvas = createCanvas(imgWidth, imgHeight);
    const ctx = canvas.getContext('2d');
    setDimensions(wrapper, imgWidth, imgHeight);
    wrapper.appendChild(canvas);
    results.forEach(res => drawMask(res.parts, ctx));
  });
}
