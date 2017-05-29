import { Observable } from 'data/observable';
import { Printer } from 'nativescript-printer';
import { alert } from "ui/dialogs";
import { ImageSource } from "image-source";
import { View } from "ui/core/view";
import { isAndroid } from "platform";
let fs = require("file-system");
let data = require('./data.json');
declare const UITextView, UIWebView, MKMapView;
export class HelloWorldModel extends Observable {
  private printer: Printer;
  htmlView: string = data.htmlView;
  textView: string = data.textView;
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
      HelloWorldModel.feedback(success);
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printScreen(args) {
    this.printer.printScreen().then((success) => {
      HelloWorldModel.feedback(success);
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printScreenPortion(args) {
    let view: View = args.object.page.getViewById("lines");
    this.printer.printScreen({
      view: view
    }).then((success) => {
      HelloWorldModel.feedback(success);
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printWebView(args) {
    let view: View = args.object.page.getViewById("webView");
    this.printer.printScreen({
      view: view
    }).then((success) => {
      HelloWorldModel.feedback(success);
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printHtmlView(args) {
    let view: View = args.object.page.getViewById("htmlView");
    this.printer.printScreen({
      view: view
    }).then((success) => {
      HelloWorldModel.feedback(success);
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printLabel(args) {
    let view: View = args.object.page.getViewById("labelView");
    this.printer.printScreen({
      view: view
    }).then((success) => {
      HelloWorldModel.feedback(success);
    }, (error) => {
      alert("Error: " + error);
    });
  }

  public printTextView(args) {
    let view: View = args.object.page.getViewById("textView");
    this.printer.printScreen({
      view: view
    }).then((success) => {
      HelloWorldModel.feedback(success);
    }, (error) => {
      alert("Error: " + error);
    });
  }

  private static feedback(success: boolean) {
    // on Android there's no way to know whether or not printing succeeded
    if (!isAndroid) {
      alert(success ? "Printed!" : "Not printed");
    }
  }
}

