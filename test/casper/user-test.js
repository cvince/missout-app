'use strict';
/*global casper*/
/*global App*/

casper.test.begin('Acceptance Test', 5, function suite (test) {

  casper.start('http://localhost:3000/signup', function () {
    test.assertHttpStatus(200, 'Signup page is accessible');
  });

  casper.then(function () {
    test.assertEval(function () {
      var inputs = document.getElementsByTagName('input');
      return (inputs.length === 2);
    }, 'Inputs are present');
  });

  casper.then(function () {
    casper.evaluate(function () {
      var inputs = document.getElementsByTagName('input');
      inputs[0].value = 'test@mail.gov';
      inputs[1].value = 'test-test';
      var form = document.getElementsByTagName('form');
      form[0].submit();
    });
  });

  casper.wait(500);

  casper.then(function () {
    test.assertEval(function () {
      return (typeof App.locator.getLoc === 'function');
    }, 'App object is present');
  });

  casper.then(function () {
    test.assertExists('#message-out', 'User made it to main page');
  });

  casper.then(function () {
    casper.evaluate(function () {
      var position = {
        lat: 47,
        lon: -122,
        accuracy: 30,
        timestamp: Date.now()
      };
      App.locator.setLoc(position);
      App.postman.newFeed(position);
    });
    casper.wait(500);
    test.assertExists('ul', 'Feed is generated');
  });

  casper.run(function () {
    test.done();
  });

});