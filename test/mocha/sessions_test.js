/**
 * Created by tim on 4/2/14.
 */
var request = require('superagent'),
  should = require('should');

describe('User', function () {
  var agent1 = request.agent();
  it('should receive forbidden from posts API', function () {
    agent1.get('http://localhost:3000/api/v1/posts')
      .end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(403);
      });
  });
  it('should receive forbidden from users API', function () {
    agent1.get('http://localhost:3000/api/v1/users')
      .end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(403);
      });
  });
  it('should get session from signup', function () {
    agent1.post('http://localhost:3000/signup')
      .send({
        email: 'test@example.com',
        password: 'testing'
      })
      .end(function (err, res) {
        should.not.exist(err);
        res.should.have.status(200);
      });
  });
});