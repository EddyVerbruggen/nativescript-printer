import { ImageSource } from "tns-core-modules/image-source";
import { View } from "tns-core-modules/ui/core/view";

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

export interface PrintPDFOptions extends PrintOptions {
  pdfPath: string;
}

export interface PrinterApi {
  isSupported(): Promise<boolean>;

  printScreen(arg?: PrintScreenOptions): Promise<boolean>;

  printImage(arg: PrintImageOptions): Promise<boolean>;

  printPDF(arg: PrintPDFOptions): Promise<boolean>;
}
