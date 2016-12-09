var Printer = require("nativescript-printer").Printer;
var printer = new Printer();

// TODO replace 'functionname' with an acual function name of your plugin class and run with 'npm test <platform>'
describe("functionname", function() {
  it("exists", function() {
    expect(printer.functionname).toBeDefined();
  });

  it("returns a promise", function() {
    expect(printer.functionname()).toEqual(jasmine.any(Promise));
  });
});