# 😷 Face Mask Browser Extension

An extension that puts masks on faces on the internet (only works for Chrome).

**Beware:** This extension is a proof of concept and really slows down your browser (and also destroys several sites).

## Demo Video

https://twitter.com/moklick/status/1234421465287680000


## Start

You need [Node.js](https://nodejs.org) in order to modify this extension.

If you just want to try it out go to: [How to load the extension](#how-to-load-the-extension)

## Installation

```
npm install
```

### Development

```
npm run dev:chrome
```

### Build

```
npm run build:chrome
```

## How to load the extension

- Type `chrome://extensions` in the address bar
- Enable the `Developer Mode` switch
- Click `Load Unpacked Extension…`
- Select the directory `extenion/chrome` of this repository

## Thanks

This extension is based on the great [web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter) by [Abhijith Vijayan](https://twitter.com/_abhijithv)
