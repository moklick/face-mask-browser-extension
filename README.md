# 😷 Face Mask Browser Extension

An extension that puts masks on faces on the internet (only works on Chrome).

**Beware:** This extension is a proof of concept and really slows down your browser (and also destroys several sites).

## Demo Video

https://twitter.com/moklick/status/1234421465287680000

## Try it out

In order to try the extension you can load the unpacked version in your Chrome browser by following these steps:

1. Download or clone this repository
2. Type `chrome://extensions` in the address bar
3. Enable the `Developer Mode` switch in the top right corner
4. Click the `Load Unpacked Extension…` utton
5. Select the directory `extenion/chrome` of this repository

## How it works

1. Check site for images and wrap them with a div
2. Observe these wrapped images with [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
3. When an image appears in the viewport, check if there are faces on it using [ml5js face-api](https://learn.ml5js.org/docs/#/reference/face-api)
4. If there are faces add a canvas to the wrapper and draw the masks with this [drawMask function](https://github.com/moklick/face-mask-browser-extension/blob/master/src/ContentScript/drawMask.js)

## Development

You need [Node.js](https://nodejs.org) in order to modify this extension.

## Installation

```
npm install
```

### Start

```
npm run dev:chrome
```


## Thanks

This extension is based on the great [web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter) by [Abhijith Vijayan](https://twitter.com/_abhijithv)
