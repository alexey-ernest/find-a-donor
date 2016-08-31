/**
 * @fileOverview Add a donor middleware.
 */

module.exports = function (db) {
  var Donor = db.Donor;

  return function (req, res, next) {
    var donor = req.body;
    // todo: validate donor model using joi

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
