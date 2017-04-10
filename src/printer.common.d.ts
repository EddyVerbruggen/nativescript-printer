import { ImageSource } from "image-source";
import { View } from "ui/core/view";
export interface PrintOptions {
    showsNumberOfCopies?: boolean;
    showsPageRange?: boolean;
}
export interface PrintScreenOptions extends PrintOptions {
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
