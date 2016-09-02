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
 * @param      {[Number]}  bottomLeft  Bottom left corner coordinates.
 * @param      {[Number]}  upperRight  Upper right corner coordinates.
 * @param      {Function}  fn          Callback.
 */
donorSchema.statics.findDonors = function (bottomLeft, upperRight, fn) {

  var query = {
    loc: {
      $geoWithin: {
        $box: [
          bottomLeft,
          upperRight
        ]
      }
    }
  };

  this.find(query, fn);
};

module.exports = mongoose.model('Donor', donorSchema);
