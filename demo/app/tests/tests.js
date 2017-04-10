var Printer = require("nativescript-printer").Printer;
var printer = new Printer();

describe("isSupported", function () {
  it("exists", function () {
    expect(printer.isSupported).toBeDefined();
  });

  it("returns a promise", function () {
    expect(printer.isSupported()).toEqual(jasmine.any(Promise));
  });

  it("expects options to be passed in", function (done) {
    printer.isSupported().then(
        function (supported) {
          // very unlikely to not be true, so:
          expect(supported).toBe(true);
          done();
        },
        function () {
          fail("Should have resolved");
        }
    )
  });
});

describe("printScreen", function () {
  it("exists", function () {
    expect(printer.printScreen).toBeDefined();
  });

  it("returns a promise", function () {
    expect(printer.printScreen()).toEqual(jasmine.any(Promise));
  });
});

describe("printImage", function () {
  it("exists", function () {
    expect(printer.printImage).toBeDefined();
  });

  it("returns a promise", function () {
    expect(printer.printImage({})).toEqual(jasmine.any(Promise));
  });
});