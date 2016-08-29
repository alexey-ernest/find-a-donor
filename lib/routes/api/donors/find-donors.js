/**
 * @fileOverview Find donors middleware.
 */

module.exports = function (db) {
  var Donor = db.Donor;

  return function (req, res, next) {
    var longitude = req.params.longitude;
    var latitude = req.params.latitude;
    var distance = req.params.distance;

    Donor.findDonors(longitude, latitude, distance, function (err, data) {
      if (err) return next(err);
      res.send(data);
    });
  };
};
