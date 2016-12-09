import { ImageSource } from "image-source";
export interface PrintOptions {
    showsNumberOfCopies?: boolean;
}
export interface PrintScreenOptions extends PrintOptions {
}
export interface PrintImageOptions extends PrintOptions {
    imageSrc: ImageSource;
}
export interface PrinterApi {
    isSupported(): Promise<boolean>;
    printScreen(arg?: PrintScreenOptions): Promise<boolean>;
    printImage(arg: PrintImageOptions): Promise<boolean>;
}
