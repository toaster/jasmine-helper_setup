'use strict';

describe("jasmine helper setup", () => {
  const helperSetup = require('..');
  const fs = require('fs');

  let name;
  let content;
  const setup = () => { helperSetup(name, content); };

  const argv = process.argv;

  beforeEach(() => {
    name = "helper_name";
    content = "helper's file content";

    spyOn(fs, 'writeFileSync');
    spyOn(fs, 'mkdirSync');
    spyOn(fs, 'existsSync').and.callFake((path) => {
      return path !== 'spec/helpers/helper_name.js';
    });
    spyOn(fs, 'statSync').and.returnValue({isDirectory: jasmine.createSpy().and.returnValue(true)});

    process.argv = ['interp', '/full/helper/path', 'init'];
  });

  afterEach(() => { process.argv = argv; });

  it("writes the helper file", () => {
    setup();
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync)
        .toHaveBeenCalledWith("spec/helpers/helper_name.js", "helper's file content", null, 0o660);
  });

  describe("when target directory does exist", () => {
    it("does not create it", () => {
      setup();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    describe("but is not a directory", () => {
      beforeEach(() => {
        fs.statSync.and.returnValue({isDirectory: jasmine.createSpy().and.returnValue(false)})
      });

      it("fails", () => {
        expect(setup).toThrow("Helper target directory is not a directory: spec/helpers");
        expect(fs.statSync).toHaveBeenCalledTimes(1);
        expect(fs.statSync).toHaveBeenCalledWith('spec/helpers');
      });
    });
  });

  describe("when target directory does not exist", () => {
    beforeEach(() => {
      name = "sub/folder/helper";
      fs.existsSync.and.callFake((path) => {
        switch(path) {
          case 'spec':
            return true;
          case 'spec/helpers':
            return true;
          case 'spec/helpers/sub':
            return false;
          case 'spec/helpers/sub/folder':
            return false;
          case 'spec/helpers/sub/folder/helper.js':
            return false;
        }
        throw `fs.existsSync called with unexpected argument: ${path}`;
      });
    });

    it("creates every missing part", () => {
      setup();
      expect(fs.mkdirSync.calls.allArgs()).toEqual([
          ['spec/helpers/sub', 0o770],
          ['spec/helpers/sub/folder', 0o770],
      ]);
    });
  });

  describe("when name is empty", () => {
    beforeEach(() => { name = ""; });

    it("fails", () => { expect(setup).toThrow("Helper name must be present.") });
  });

  describe("when name is null", () => {
    beforeEach(() => { name = null });

    it("fails", () => { expect(setup).toThrow("Helper name must be present.") });
  });

  describe("when name is undefined", () => {
    beforeEach(() => { name = undefined });

    it("fails", () => { expect(setup).toThrow("Helper name must be present.") });
  });

  describe("when target path already exists", () => {
    beforeEach(() => { fs.existsSync.and.returnValue(true); });

    it("fails", () => {
      expect(setup).toThrow("Helper file already exists: spec/helpers/helper_name.js");
    });
  });

  describe("when process args are not ['init']", () => {
    beforeEach(() => { process.argv = ['interp', '/full/helper/path', 'init', 'me']; });

    it("fails", () => {
      expect(setup).toThrow("Usage: /full/helper/path init");
    });
  });
});
