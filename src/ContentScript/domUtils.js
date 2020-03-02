export function wrap(imgEl) {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  imgEl.classList.add('maskedimage');

  const parent = imgEl.parentNode;
  parent.insertBefore(wrapper, imgEl);
  wrapper.appendChild(imgEl);

  return wrapper;
}

export function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  return canvas;
}

export function setDimensions(domEl, width, height) {
  domEl.style.width = `${width}px`;
  domEl.style.height = `${height}px`;
}
