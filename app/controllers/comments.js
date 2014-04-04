var Post = require('../models/post');

module.exports = function (app) {
  app.post('/api/v1/comments/:id', function (req, res) {
    var postId = req.params.id;
    console.log(postId);
    Post.findById(postId, function (err, post) {
      post.comments.push(req.body);
      post.save(function (err, post) {
        res.send(post);
      });
      if (err) {
        res.send(err);
      }
    });
  });
  app.get('/api/v1/comments/:id', function (req, res) {
    var postId = req.params.id;
    Post.findById(postId, function (err, post) {
      console.log(post);
      if (err) {
        res.send(err);
      }
      res.send(post.comments)
    });
  });
};