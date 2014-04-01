'use strict';

var Post = require('../models/post.js');

module.exports = function (app) {
  /*
   Feed update: expects a coordinate pair in the
   format { lon: 123, lat: 123 } in the request body
   */
  app.get('/api/v1/feed', function (req, res) {
    if (!req.isAuthenticated()) {
      res.send(403);
    }
    res.setHeader('Content-Type', 'application/json');
    Post.find({
      loc: {
        $nearSphere: [-122,47],
        $maxDistance: 0.01
      }
    },
    function (err, retObject) {
      if (err) {
        res.send(500, {'error': err});
      } else {
        res.send(JSON.stringify(retObject));
      }
    });
  });
};
