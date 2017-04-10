# NativeScript Printer plugin

> Think about the environment before printing!

## Installation
From the command prompt go to your app's root folder and execute:

```
tns plugin add nativescript-printer
```

## Demo app
Want to dive in quickly? Check out [the demo](demo)! Otherwise, continue reading.

Run the demo app from the root of the project: `npm run demo.ios` or `npm run demo.android`.

### Android screenshots
<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/android/android-select-printer.png" width="375px"/>

<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/android/android-printer-options.png" width="375px"/>

### iOS screenshots
<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/ios/ios-select-printer.png" width="375px"/>

<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-printer/master/screenshots/ios/ios-printing-in-progress.png" width="375px"/>

## API

### `isSupported`
Not all devices support printing, so it makes sense to check the device capabilties beforehand.

##### TypeScript
```js
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
```js
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
```js
printer.printScreen().then((success) => {
  alert(success ? "Printed!" : "Not printed");
}, (error) => {
  alert("Error: " + error);
});
```

## Future work
Depending on demand (open an issue!) we could add support for printing other things, like PDF's.
