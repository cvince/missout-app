'use strict';


var Post = require('../models/post.js'),
  mongoose = require('mongoose');

module.exports = function (app) {
  /*
   Feed update: expects a coordinate pair in the
   format { lon: 123, lat: 123 } in the request body
   */

  app.post('/api/v1/feed', function (req, res) {
    console.log('hit feed endpoint' + JSON.stringify(req.body));
//    if (!req.isAuthenticated()) {
//      res.send(403);
//    }
    res.setHeader('Content-Type', 'application/json');
    Post.find({ loc: {
                  $near: {
                    type: 'Point',
                    coordinates: [ req.body.lon, req.body.lat ]
                  },
                  $maxDistance: 100000
                }
              },
    function (err, docs) {
      if (err) {
        //console.log(err);
        res.send(err);
      }
      //console.log(docs);
      res.send(docs);
    });
  });
};
