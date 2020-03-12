# 😷 Face Mask Browser Extension

An extension that puts masks on faces on the internet (only works on Chrome).

**Beware:** This extension is a proof of concept and really slows down your browser (and also destroys several sites).

## Demo Video

https://twitter.com/moklick/status/1234421465287680000

## Example

![](https://user-images.githubusercontent.com/2857535/76514440-2a6e6900-6458-11ea-99c6-86498c5747d7.png)

## Try it out

In order to try the extension you can load the unpacked version in your Chrome browser by following these steps:

1. Download or clone this repository
2. Type `chrome://extensions` in the address bar
3. Enable the `Developer Mode` switch in the top right corner
4. Click the `Load Unpacked Extension…` utton
5. Select the directory `extension/chrome` of this repository

## How it works

1. Check site for images and wrap them with a div
2. Observe these wrapped images with [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
3. When an image appears in the viewport, check if there are faces on it using [face-api](https://github.com/justadudewhohacks/face-api.js/)
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

* 🙌 [Bjorn Stromberg](https://github.com/bjornstar) for his [very helpful contributions](https://github.com/moklick/face-mask-browser-extension/commits?author=bjornstar) to this extension 
* The code is based on the great [web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter) by [Abhijith Vijayan](https://twitter.com/_abhijithv)
