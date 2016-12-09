import {PrinterApi, PrintOptions, PrintImageOptions, PrintScreenOptions} from "./printer.common";
import * as frame from "ui/frame";
import * as utils from "utils/utils";
let application = require("application");

declare let android;

export class Printer implements PrinterApi {

  private printManager: any; // android.print.PrintManager;

  constructor() {
    this.printManager = utils.ad.getApplicationContext().getSystemService(android.content.Context.PRINT_SERVICE);
    console.log("--- this.printManager: " + this.printManager)
  }

  private static isPrintingSupported(): boolean {
    return android.support.v4.print.PrintHelper.systemSupportsPrint();
  }

  public isSupported(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(Printer.isPrintingSupported());
      } catch (e) {
        reject(e);
      }
    });
  }

  private _printImage(image: any /* Image */, options?: PrintOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (!Printer.isPrintingSupported()) {
        reject("Printing is not supported on this device - better check isSupported() beforehand");
        return;
      }

      try {
        let callback = function (success) {
          resolve(success);
        };

        // see https://developer.android.com/training/printing/photos.html
        let PrintHelper = android.support.v4.print.PrintHelper;
        let printHelper = new PrintHelper(application.android.foregroundActivity);
        printHelper.setScaleMode(PrintHelper.SCALE_MODE_FIT);
        let jobName = "MyPrintJob"; // TODO custom name
        printHelper.printBitmap(jobName, image);

        // there's no way to know whether the user printed or canceled, so returning true
        callback(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  public printImage(arg: PrintImageOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this._printImage(arg.imageSrc.android, arg).then(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  public printScreen(arg?: PrintScreenOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let view = frame.topmost().currentPage.content;
        view.android.setDrawingCacheEnabled(true);
        let bmp = android.graphics.Bitmap.createBitmap(view.android.getDrawingCache());
        view.android.setDrawingCacheEnabled(false);
        // let source = new ImageSource();
        // source.setNativeSource(bmp);
        this._printImage(bmp, arg).then(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }
}