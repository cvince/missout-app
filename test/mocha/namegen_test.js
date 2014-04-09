/**
 * Created by tim on 4/9/14.
 */
var chai = require('chai'),
    expect = chai.expect,
    nameGen = require('../../app/tempName.js');

describe('Name Generator', function () {
  it('should generate a temp name', function () {
    var name = nameGen();
    expect(name).to.be.a('string');
  });
  it('should be three words long', function () {
    var name = nameGen();
    name = name.split(' ');
    expect(name).to.be.an('array');
    expect(name.length).to.eql(3);
  });
});