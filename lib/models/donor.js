// env
if (!process.env.MONGODB_CONNECTION) {
  console.log('MONGODB_CONNECTION environment variable required.');
  process.exit(1);
}

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION);

var Schema = mongoose.Schema;

var donorSchema = new Schema({
  firstName: String,
  lastName: String,
  contactNumber: String,
  emailAddress: String,
  bloodGroup: String,
  loc: [Number]
});

donorSchema.index({ loc: '2dsphere', bloodGroup: 1 });


// Static methods

/**
 * Finds donors near a point.
 *
 * @param      {number}    longitude  The longitude
 * @param      {number}    latitude   The latitude
 * @param      {number}    distanceM  The distance in meters.
 * @param      {Function}  fn         Callback.
 */
donorSchema.statics.findDonors = function (longitude, latitude, distanceM, fn) {
  if (typeof distanceM === 'function') {
    fn = distanceM;
    distanceM = null;
  }

  if (!distanceM) {
    distanceM = 1000; // 1km by default
  }

  var query = {
    loc: {
      $near: {
        $geometry: {type: 'Point', coordinates : [longitude, latitude]},
        $maxDistance : distanceM
      }
    }
  };

  this.find(query, fn);
};

module.exports = mongoose.model('Donor', donorSchema);
