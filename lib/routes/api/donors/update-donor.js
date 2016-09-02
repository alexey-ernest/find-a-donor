/**
 * @fileOverview Update donor middleware.
 */

var validation = require('../../../utils/validation');

module.exports = function (db) {
  var Donor = db.Donor;

  return function (req, res, next) {
    Donor.findById(req.params.id, function (err, donor) {
      if (err) return next(err);

      if (!donor) {
        return res.status(404).end();
      }

      var donorData = req.body;

      var errors = validation.validateDonor(donorData);
      if (Object.keys(errors).length > 0) {
        return res.status(400).send(errors);
      }

      // updating donor data
      delete donorData._id;
      Object.assign(donor, donorData);

      donor.save(function (err) {
        if (err) return next(err);
        res.send(donor);
      });
    });
  }
};
