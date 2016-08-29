/**
 * @fileOverview Delete a donor by id middleware.
 */

module.exports = function (db) {
  var Donor = db.Donor;

  return function (req, res, next) {
    Donor.remove({ _id: req.params.id }, function (err) {
      if (err) return next(err);

      res.end();
    });
  };
};
