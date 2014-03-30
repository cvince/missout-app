'use strict';

var Post = require('../models/post.js');

module.exports = function (app) {
  /*
  Feed update: expects a coordinate pair in the
  format { lon: 123, lat: 123 } in the request body
   */
  app.get('/api/v1/feed', function (req, res) {
    Post.find({
        loc: {
          $nearSphere: [ req.body.lon, req.body.lat ],
          $maxDistance: 0.01
        }
      },
      function (err, docs) {
        if (err) {
          res.send(err);
        }
        res.send(docs);
      });
  });
};