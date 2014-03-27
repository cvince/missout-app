module.exports = function (Schema, mongoose) {
  var UserSchema = new Schema({
    local         : {
      email       : String,
      password    : String
    },
    facebook      : {
      id          : String,
      token       : String,
      email       : String,
      name        : String
    },
    twitter       : {
      id          : String,
      token       : String,
      displayName : String,
      username    : String
    },
    org           : { type: Schema.ObjectId },
    loc           : { type: {type: String}, coordinates: [] },
    lastLoc       : { type: Date },
    session       : { type: String }
  });
  return mongoose.model('User', UserSchema);
};