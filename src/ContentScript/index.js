import browser from 'webextension-polyfill';

import drawMask from './drawMask';
import { wrap, createCanvas, setDimensions } from './domUtils';
import ImageObserver from './ImageObserver';
import DomMutationObserver from './DomMutationObserver';

const imageObserver = new ImageObserver(onImageInViewport);

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

// wrap all images with relative div and observe if they are within the viewport
[].forEach.call(filteredImages, img => {
  const wrapper = wrap(img);
  imageObserver.observe(wrapper);
});

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
      message: 'detect_faces',
      url: imgEl.src,
      width: imgWidth,
      height: imgHeight
    })
    .then(res => onMessageResponse(res, wrapper, imgWidth, imgHeight));
}

function onMessageResponse(faces, wrapper, imgWidth, imgHeight) {
  // only when we detect faces we add a canvas and draw the masks on it

  if (!faces || !faces.length) return false;

  const canvas = createCanvas(imgWidth, imgHeight);
  const ctx = canvas.getContext('2d');

  setDimensions(wrapper, imgWidth, imgHeight);

  wrapper.appendChild(canvas);

  faces.forEach(({ jawOutline, nose }) => drawMask({ jawOutline, nose }, ctx));
}
