# NativeScript Printer plugin

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/EddyVerbruggen/nativescript-printer.svg?branch=master
[build-url]:https://travis-ci.org/EddyVerbruggen/nativescript-printer
[npm-image]:http://img.shields.io/npm/v/nativescript-printer.svg
[npm-url]:https://npmjs.org/package/nativescript-printer
[downloads-image]:http://img.shields.io/npm/dm/nativescript-printer.svg
[twitter-image]:https://img.shields.io/twitter/follow/eddyverbruggen.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/eddyverbruggen

> Think about the environment before printing!

## Installation
From the command prompt go to your app's root folder and execute:

```
tns plugin add nativescript-printer
```

## Demo app
Want to dive in quickly? Check out [the demo](https://github.com/EddyVerbruggen/nativescript-printer/tree/master/demo)! Otherwise, continue reading.

Run the demo app from the root of the project: `npm run demo.ios` or `npm run demo.android`.

### Android screenshots
<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/android/android-select-printer.png" width="375px"/>&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/android/android-printer-options.png" width="375px"/>

### iOS screenshots
<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/ios/ios-select-printer.png" width="375px"/>&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/ios/ios-printing-in-progress.png" width="375px"/>

## API

### `isSupported`
Not all devices support printing, so it makes sense to check the device capabilties beforehand.

##### TypeScript
```typescript
// require the plugin
import {Printer} from "nativescript-printer";

// instantiate the plugin
let printer = new Printer();

printer.isSupported().then((supported) => {
  alert(supported ? "Yep!" : "Nope :'(");
}, (error) => {
  alert("Error: " + error);
});
```

### `printImage`

##### TypeScript
```typescript
// let's load an image that we can print. In this case from a local folder.
let fs = require("file-system");
let appPath = fs.knownFolders.currentApp().path;
let imgPath = appPath + "/res/printer.png";
let imgSrc = new ImageSource();
imgSrc.loadFromFile(imgPath);

printer.printImage({
  imageSrc: imgSrc
}).then((success) => {
  alert(success ? "Printed!" : "Not printed");
}, (error) => {
  alert("Error: " + error);
});
```

### `printScreen`
Prints the current screen contents. Anything off screen will not be printed.

##### TypeScript
```typescript
printer.printScreen().then((success) => {
  alert(success ? "Printed!" : "Not printed");
}, (error) => {
  alert("Error: " + error);
});
```

You can also print a specific portion of the screen, which also enables you to print
views that are larger than the viewport. This is an example of a non-Angular NativeScript app:

**Note**
If the view is either of the following depending on the size of it's contents it would break into multiple pages.

`Label | TextView | HtmlView | WebView`

```xml
  <StackLayout id="printMe">
    <Label text="Print me :)" />
  </StackLayout>

  <Button text="Print" tap="{{ print }}" />
```

```js
  public print(args) {
    printer.printScreen({
      view: args.object.page.getViewById("printMe")
    });
  }
```
