/**
 * @fileOverview Find donors middleware.
 */

module.exports = function (db) {
  var Donor = db.Donor;

  return function (req, res, next) {
    var bl = [req.params.bllng, req.params.bllat];
    var ur = [req.params.urlng, req.params.urlat];

    Donor.findDonors(bl, ur, function (err, data) {
      if (err) return next(err);
      res.send(data);
    });
  };
};
