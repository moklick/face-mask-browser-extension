import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'img_to_dataurl') {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = request.width;
      canvas.height = request.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, request.width, request.height);
      sendResponse({ data: canvas.toDataURL() });
    };
    img.width = request.width;
    img.height = request.height;
    img.src = request.url;

    return true;
  }
});
