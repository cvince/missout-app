// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
  'facebookAuth' : {
    'clientID'    : process.env.FB_APP_ID, // your App ID
    'clientSecret'  : process.env.FB_APP_SECRET, // your App Secret
    'callbackURL'   : 'http://localhost:8888/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'     : process.env.TW_APP_KEY,
    'consumerSecret'  : process.env.TW_APP_SECRET,
    'callbackURL'     : 'http://localhost:8888/auth/twitter/callback'
  }
};
