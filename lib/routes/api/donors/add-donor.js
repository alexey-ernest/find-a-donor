/**
 * @fileOverview Add a donor middleware.
 */

var validation = require('../../../utils/validation');

module.exports = function (db) {
  var Donor = db.Donor;

  return function (req, res, next) {
    var donor = req.body;

    var errors = validation.validateDonor(donor);
    if (Object.keys(errors).length > 0) {
      return res.status(400).send(errors);
    }

    Donor.create({
      firstName: donor.firstName,
      lastName: donor.lastName,
      contactNumber: donor.contactNumber,
      emailAddress: donor.emailAddress,
      bloodGroup: donor.bloodGroup,
      loc: donor.loc
    }, function (err, data) {
      if (err) return next(err);
      res.send(data);
    });
  }
};
