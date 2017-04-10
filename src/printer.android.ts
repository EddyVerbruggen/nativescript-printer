import {PrinterApi, PrintOptions, PrintImageOptions, PrintScreenOptions} from "./printer.common";
import * as frame from "ui/frame";
import * as utils from "utils/utils";
import { View } from "ui/core/view";
let application = require("application");

declare let android;

export class Printer implements PrinterApi {

  private printManager: any; // android.print.PrintManager;

  constructor() {
    this.printManager = utils.ad.getApplicationContext().getSystemService(android.content.Context.PRINT_SERVICE);
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
        let jobName = "MyPrintJob";
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
        let bmp: any;

        if (arg && arg.view) {
          let view: View = arg.view;
          bmp = android.graphics.Bitmap.createBitmap(view.getMeasuredWidth(), view.getMeasuredHeight(), android.graphics.Bitmap.Config.ARGB_8888);
          view.android.draw(new android.graphics.Canvas(bmp));
        } else {
          let view: View = frame.topmost().currentPage.content;
          view.android.setDrawingCacheEnabled(true);
          bmp = android.graphics.Bitmap.createBitmap(view.android.getDrawingCache());
          view.android.setDrawingCacheEnabled(false);
        }

        this._printImage(bmp, arg).then(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }
}