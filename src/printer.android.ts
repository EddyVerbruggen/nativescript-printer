import { Application, Frame, View } from "@nativescript/core";
import { Utils } from "@nativescript/core"
import { PrinterApi, PrintImageOptions, PrintOptions, PrintPDFOptions, PrintScreenOptions } from "./printer.common";

declare let android, global: any;

const PrintPackageName = useAndroidX() ? global.androidx.print : android.support.v4.print;

function useAndroidX() {
  return global.androidx && global.androidx.appcompat;
}

export class Printer implements PrinterApi {

  private printManager: any; // android.print.PrintManager;

  constructor() {
    this.printManager = Utils.android.getApplicationContext().getSystemService(android.content.Context.PRINT_SERVICE);
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

        let fileDescriptor = android.os.ParcelFileDescriptor.open(file, android.os.ParcelFileDescriptor.MODE_READ_ONLY);
        let pdfRenderer = new android.graphics.pdf.PdfRenderer(fileDescriptor);
        let page = pdfRenderer.openPage(0);

        let bmp = android.graphics.Bitmap.createBitmap(page.getWidth(), page.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        page.render(bmp, null, null, android.graphics.pdf.PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);

        page.close();
        pdfRenderer.close();

        this._printImage(bmp, {}).then(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }

}
