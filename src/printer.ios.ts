import { CoreTypes, Device, View, Frame } from "@nativescript/core";
import { PrinterApi, PrintOptions, PrintImageOptions, PrintScreenOptions, PrintPDFOptions } from "./printer.common";

export class Printer implements PrinterApi {

  private static isPrintingSupported(): boolean {
    let controller = NSClassFromString("UIPrintInteractionController");
    if (!controller) {
      return false;
    }
    return UIPrintInteractionController.sharedPrintController &&
        UIPrintInteractionController.printingAvailable;
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

  private _printImage(image: any /* UIImage | NSData | NSURL */, options?: PrintOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (!Printer.isPrintingSupported()) {
        reject("Printing is not supported on this device - better check isSupported() beforehand");
        return;
      }

      try {
        const controller = UIPrintInteractionController.sharedPrintController;
        controller.showsNumberOfCopies = options && options.showsNumberOfCopies;
        controller.showsPageRange = options && options.showsPageRange;

        let printInfo = UIPrintInfo.printInfo();
        printInfo.outputType = UIPrintInfoOutputType.General;
        printInfo.jobName = "MyPrintJob";
        controller.printInfo = printInfo;
        controller.printingItem = image;

        let callback = (controller, success, error) => {
          resolve(success);
        };

        if (Device.deviceType === CoreTypes.DeviceType.Tablet) {
          let view = UIApplication.sharedApplication.keyWindow.rootViewController.view;
          let theFrame: any = Frame.topmost().currentPage.frame;
          controller.presentFromRectInViewAnimatedCompletionHandler(theFrame, view, true, callback);
        } else {
          controller.presentAnimatedCompletionHandler(true, callback);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  private _printView(nativeView: any /* UITextView | WKWebView | MKMapView */, options?: PrintOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (!Printer.isPrintingSupported()) {
        reject("Printing is not supported on this device - better check isSupported() beforehand");
        return;
      }

      try {
        const controller = UIPrintInteractionController.sharedPrintController;
        controller.showsNumberOfCopies = options && options.showsNumberOfCopies;
        controller.showsPageRange = options && options.showsPageRange;

        let printInfo = UIPrintInfo.printInfo();
        printInfo.outputType = UIPrintInfoOutputType.General;
        printInfo.jobName = "MyPrintJob";
        controller.printInfo = printInfo;
        controller.printFormatter = nativeView.viewPrintFormatter();

        let callback = (controller, success, error) => {
          resolve(success);
        };

        if (Device.deviceType === CoreTypes.DeviceType.Tablet) {
          let view = UIApplication.sharedApplication.keyWindow.rootViewController.view;
          let theFrame: any = Frame.topmost().currentPage.frame;
          controller.presentFromRectInViewAnimatedCompletionHandler(theFrame, view, true, callback);
        } else {
          controller.presentAnimatedCompletionHandler(true, callback);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public printImage(arg: PrintImageOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this._printImage(arg.imageSrc.ios, arg).then(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  public printScreen(arg?: PrintScreenOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let view: View;
        let h: number;
        let w: number;

        if (arg && arg.view) {
          view = arg.view;
          h = view.getMeasuredHeight();
          w = view.getMeasuredWidth();
        } else {
          view = Frame.topmost().currentPage.content;
          h = view.ios.frame.size.height;
          w = view.ios.frame.size.width;
        }


        if (view.ios instanceof UITextView || view.ios instanceof WKWebView || view.ios instanceof MKMapView) {
          this._printView(view.ios, arg).then(resolve, reject);
        } else {
          UIGraphicsBeginImageContextWithOptions(view.ios.frame.size, false, 0);
          view.ios.drawViewHierarchyInRectAfterScreenUpdates(CGRectMake(0, 0, w, h), true);
          let imageFromCurrentImageContext = UIGraphicsGetImageFromCurrentImageContext();
          UIGraphicsEndImageContext();
          let img = UIImagePNGRepresentation(imageFromCurrentImageContext);

          this._printImage(img, arg).then(resolve, reject);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public printPDF(arg: PrintPDFOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // note that if we want to also support online files, we could use:
        // let url = NSURL.URLWithString(arg.pdfPath);
        let url = NSURL.fileURLWithPath(arg.pdfPath);
        this._printImage(url, arg).then(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }
}
