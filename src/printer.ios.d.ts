import { PrinterApi, PrintImageOptions, PrintScreenOptions } from "./printer.common";
export declare class Printer implements PrinterApi {
    private static isPrintingSupported();
    isSupported(): Promise<boolean>;
    private _printImage(image, options?);
    printImage(arg: PrintImageOptions): Promise<boolean>;
    printScreen(arg?: PrintScreenOptions): Promise<boolean>;
}
