import { ImageSource } from "image-source";
import { View } from "ui/core/view";

export interface PrintOptions {
  /**
   * Default false
   * iOS only
   */
  showsNumberOfCopies?: boolean;

  /**
   * Default false
   * iOS only
   */
  showsPageRange?: boolean;
}

export interface PrintScreenOptions extends PrintOptions {
  /**
   * By default the entire screen is printed, but may be limited to a specific view.
   */
  view?: View;
}

export interface PrintImageOptions extends PrintOptions {
  imageSrc: ImageSource;
}

export interface PrinterApi {
  isSupported(): Promise<boolean>;
  printScreen(arg?: PrintScreenOptions): Promise<boolean>;
  printImage(arg: PrintImageOptions): Promise<boolean>;
}