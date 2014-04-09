var Post = require('../models/post');
var nameGen = require ('../tempName.js');

function _dissectComments(post){

  var commentsFeed = post.comments;

  var authors = [];

  for(var i = 0; i<commentsFeed.length; i++){
    authors.push(String(commentsFeed[i].author));
  }

  return authors;
}

module.exports = function (app) {
  app.post('/api/v1/comments/:id', function (req, res) {
    var authorId = req.user._id;
    req.body.author = authorId;
    var postId = req.params.id;
    console.log('Author: ' + authorId);
    Post.findById(postId, function (err, post) {

      console.log('Does ' + authorId + ' equal ' + post.author + '?');
      if (String(authorId) == String(post.author)) {
        console.log('They are equal');
        req.body.tempname = post.tempname;
      } else {
        var authors = _dissectComments(post);
        var authIndex = authors.indexOf(String(authorId));
        console.log('AuthIndex returned ' + authIndex);
        console.log('Post authors: '+String(authors));
        if (authIndex >= 0) {
          req.body.tempname = post.comments[authIndex].tempname;
        } else {
          req.body.tempname = nameGen();
        }
      }
      post.comments.push(req.body);
      post.save(function (err, post) {
        console.log(post);
      });
      if (err) {
        res.send(err);
      }else{
        res.redirect('/')
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
      res.redirect('/')
    });
  });
};


//


