// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
  'facebookAuth' : {
    'clientID'      : 1415482155376787, // your App ID
    'clientSecret'  : '0494a9c872e7f47c83edb08d349d2ec0', // your App Secret
    'callbackURL'   : '/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'     : 'xIZx0gYClCCAZ9NAVUKkg',
    'consumerSecret'  : 'DPFYPRaMLWNRCkglTw28xEFqFpkXAFNghwefU9jhPrQ',
    'callbackURL'     : '/auth/twitter/callback'
  }
};
