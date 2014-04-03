var superagent = require('superagent'),
  chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

describe('Post API controller', function () {
  it('can fetch a user\'s feed', function () {
    superagent.post('http://localhost:3000/api/v1/feed')
      .send({
        lon: 47,
        lat: -122
      })
      .end(function (e, res) {
        expect(e).to.eql(null);
        //var data = JSON.parse(res.body);
        //expect(res.body.length).to.be.above(0);
        //expect(data[0].body).to.be.a('String');
        //done();
      });
  });
});