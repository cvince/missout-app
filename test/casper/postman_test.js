'use strict';
/*global casper*/
/*global App*/

casper.test.begin('Locator', 2, function suite (test) {

  casper.start('http://localhost:3000/signup', function () {
    test.assertHttpStatus(200, 'Page exists');
  });

  casper.evaluate(function () {
    var inputs = document.getElementsByTagName('input');
    inputs[0].value = 'test';
    inputs[1].value = 'test';
    var form = document.getElementsByTagName('form');
    form[0].submit();
  });

  casper.wait(500, function () {
    return true;
  });

  casper.then(function () {
    test.assertEval(function () {
      var post = document.getElementById('message-out');
      if (post) {
        return true;
      }
      return false;
    }, 'User can sign up and log in');
  });

  casper.run(function () {
    test.done();
  });

});