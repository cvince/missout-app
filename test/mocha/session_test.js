/**
 * Created by tim on 4/2/14.
 */
var superagent = require('superagent'),
  chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

describe('User', function () {
  var person = superagent.agent();
  it('should get 403 without session', function () {
    person.get('http://localhost:3000/api/v1/posts')
      .end(function (e, res) {
//        res.should.have.status(403);
//        done();
      });
  });
});