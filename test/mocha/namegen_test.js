/**
 * Created by tim on 4/2/14.
 */
var chai = require('chai'),
    expect = chai.expect,
    namegen = require('../../app/modules/namegen'),
    names = require('../../app/modules/names');

describe('List of temp names', function () {
  it('should have a first names array', function () {
    expect(names.firsts).to.be.an('array');
    expect(names.firsts[0]).to.be.a('string');
  });
  it('should have a last names array', function () {
    expect(names.lasts).to.be.an('array');
    expect(names.lasts[0]).to.be.a('string');
  });
});

describe('Tempname Generator', function () {
  it('should exist', function () {
    expect(namegen).to.be.a('function');
  });
  it('should generate a temp name', function () {
    expect(namegen()).to.be.a('string');
  });
  it('should generate 100 unique names', function () {
    var usedNames = [];
    for (var i = 0; i <= 100; i++) {
      usedNames.push(namegen());
    }
    var testName = namegen(usedNames),
        testBool = false;
    for (var name in usedNames) {
      if (testName == name) {
        testBool = true;
      }
    }
    expect(testBool).to.eql(false);
  });
  it('should generate 1000 unique names', function () {
    var usedNames = [];
    for (var i = 0; i <= 1000; i++) {
      usedNames.push(namegen());
    }
    var testName = namegen(usedNames),
      testBool = false;
    for (var name in usedNames) {
      if (testName == name) {
        testBool = true;
      }
    }
    expect(testBool).to.eql(false);
  });
});

