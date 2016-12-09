import {PrinterApi, PrintOptions, PrintImageOptions, PrintScreenOptions} from "./printer.common";
import {DeviceType} from "ui/enums";
import {device} from "platform";
import * as frame from "ui/frame";
import * as utils from "utils/utils";

declare let NSClassFromString, UIPrintInteractionController, CGRectMake, UIPrintInfo, UIPrintInfoOutputGeneral, UIApplication,
    UIGraphicsBeginImageContextWithOptions, UIGraphicsGetImageFromCurrentImageContext, UIGraphicsEndImageContext, UIImagePNGRepresentation: any;

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

  private _printImage(image: any /* UIImage */, options?: PrintOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (!Printer.isPrintingSupported()) {
        reject("Printing is not supported on this device - better check isSupported() beforehand");
        return;
      }

      try {
        const controller = UIPrintInteractionController.sharedPrintController;
        controller.showsNumberOfCopies = options && options.showsNumberOfCopies;

        let printInfo = UIPrintInfo.printInfo();
        printInfo.outputType = UIPrintInfoOutputGeneral;
        printInfo.jobName = "MyPrintJob"; // TODO appname, etc
        controller.printInfo = printInfo;
        controller.printingItem = image;

        let callback = function (controller, success, error) {
          resolve(success);
        };

        if (device.deviceType == DeviceType.Tablet) {
          let view = utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController.view;
          let theFrame = frame.topmost().currentPage.frame;
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
        // let view = utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController.view;
        let view = frame.topmost().currentPage.content;

        UIGraphicsBeginImageContextWithOptions(view.ios.frame.size, false, 0);
        view.ios.drawViewHierarchyInRectAfterScreenUpdates(CGRectMake(0, 0, view.ios.frame.size.width, view.ios.frame.size.height), true);
        let imageFromCurrentImageContext = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        let img = UIImagePNGRepresentation(imageFromCurrentImageContext);

        this._printImage(img, arg).then(resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }
}