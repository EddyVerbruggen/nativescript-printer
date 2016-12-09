import {Observable} from 'data/observable';
import {Printer} from 'nativescript-printer';
import {alert} from "ui/dialogs";
import {ImageSource} from "image-source";
let fs = require("file-system");

export class HelloWorldModel extends Observable {
  private printer: Printer;

  constructor() {
    super();
    this.printer = new Printer();
  }

  public printingSupported() {
    this.printer.isSupported().then((supported) => {
      console.log("supported? " + supported);
      alert(supported ? "Yep!" : "Nope :(");
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printImage(args) {
    let appPath = fs.knownFolders.currentApp().path;
    let imgPath = appPath + "/res/printer.png";
    let imgSrc = new ImageSource();
    imgSrc.loadFromFile(imgPath);

    this.printer.printImage({
      imageSrc: imgSrc
    }).then((success) => {
      alert(success ? "Printed!" : "Not printed");
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printScreen(args) {
    this.printer.printScreen().then((success) => {
      alert(success ? "Printed!" : "Not printed");
    }, (error) => {
      alert("Error: " + error);
    });
  }
}