import { alert, isAndroid, ImageSource, knownFolders, Observable, View } from "@nativescript/core";
import { Printer } from "nativescript-printer";

let data = require('./data.json');

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
        let appPath = knownFolders.currentApp().path;
        let imgPath = appPath + "/assets/printer.png";
        console.log(imgPath);
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

    public printPDF(args) {
        this.printer.printPDF({
            // online files are no currently supported
            // pdfPath: "https://www.orimi.com/pdf-test.pdf"
            pdfPath: knownFolders.currentApp().path + "/assets/pdf-test.pdf"
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
