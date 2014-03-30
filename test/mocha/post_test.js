var superagent = require('superagent'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

describe('Post API controller', function () {
  it('can fetch a user\'s feed', function () {
    superagent.get('http://localhost:3000/api/v1/feed')
      .send({
        lon: 47,
        lat: -122
      })
      .end(function (e, res) {
        expect(e).to.eql(null);
        expect(res.body.length).to.be.above(0);
        done();
      });
  });
});