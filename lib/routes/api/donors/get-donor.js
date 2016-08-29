/**
 * @fileOverview GET a donor middleware.
 */

module.exports = function (db) {
  var Donor = db.Donor;

  return function (req, res, next) {
    Donor.findById(req.params.id, function (err, donor) {
      if (err) return next(err);

      if (!donor) {
        return res.status(404).end();
      }

      res.send(donor);
    });
  };
};
