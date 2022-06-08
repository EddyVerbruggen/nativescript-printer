import { Application, Frame, View } from "@nativescript/core";
import * as utils from "@nativescript/core/utils/utils";
import { PrinterApi, PrintImageOptions, PrintOptions, PrintPDFOptions, PrintScreenOptions } from "./printer.common";

declare let android, global: any;

const PrintPackageName = useAndroidX() ? global.androidx.print : android.support.v4.print;

function useAndroidX() {
  return global.androidx && global.androidx.appcompat;
}

export class Printer implements PrinterApi {

  private printManager: any; // android.print.PrintManager;

  constructor() {
    this.printManager = utils.ad.getApplicationContext().getSystemService(android.content.Context.PRINT_SERVICE);
  }

  private static isPrintingSupported(): boolean {
    return PrintPackageName.PrintHelper.systemSupportsPrint();
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
        let callback = success => {
          resolve(success);
        };

        // see https://developer.android.com/training/printing/photos.html
        let printHelper = new PrintPackageName.PrintHelper(Application.android.foregroundActivity);
        printHelper.setScaleMode(PrintPackageName.PrintHelper.SCALE_MODE_FIT);
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
          let view: View = Frame.topmost().currentPage.content;
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

  public printPDF(arg: PrintPDFOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let file = new java.io.File(arg.pdfPath);
        if (!file.exists()) {
          reject('File does not exist');
          return;
        }
        let printManager = Application.android.foregroundActivity.getSystemService(android.content.Context.PRINT_SERVICE);
        let jobName = "Print PDF";
        let PrintPDFAdapter = android.print.PrintDocumentAdapter.extend({
          onWrite(pages, destination, cancellationSignal, callback) {
            let input;
            let output;
            try {
              input = new java.io.FileInputStream(new java.io.File(arg.pdfPath));
              output = new java.io.FileOutputStream(destination.getFileDescriptor());
              let buf = new Array.create("byte", 1024);
              let bytesRead;
              while ((bytesRead = input.read(buf)) > 0) {
                output.write(buf, 0, bytesRead);
              }
              callback.onWriteFinished(pages);
            } catch (e){
              console.error(e);
            } finally {
              try {
                input.close();
                output.close();
              } catch (e) {
                console.error(e);
              }
            }
          },
          onLayout(oldAttributes, newAttributes, cancellationSignal, callback, extras){
            try {
              if (cancellationSignal.isCanceled()) {
                callback.onLayoutCancelled();
                return;
              }
              let pdi = new android.print.PrintDocumentInfo.Builder("print_output.pdf").setContentType(android.print.PrintDocumentInfo.CONTENT_TYPE_DOCUMENT).build();
              callback.onLayoutFinished(pdi, true);
            } catch (e) {
              console.error(e);
            }
          },
        });
        let pda = new PrintPDFAdapter();
        let printJob = printManager.print(jobName, pda, null);
        let onFinish = function(status) {
          resolve(status);
          clearInterval(interval);
        }
        let onError = function(status) {
          reject(status);
          clearInterval(interval);
        }
        let interval = setInterval(() => {
          let state = printJob.getInfo().getState();
          if (state === 6) onError("print failed");
          if (state === 7) onError("print cancelled");
          if (state === 5) onFinish("print completed");
        }, 500);
      } catch (e) {
        reject(e);
      }
    });
  }

}
