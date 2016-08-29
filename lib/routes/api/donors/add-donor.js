/**
 * @fileOverview Add a donor middleware.
 */

var debug = require('debug')('find-a-donor:api:add-donor');
var Donor = require('../../../models/donor');

/**
 * Add a donor middleware.
 *
 * @param      {Request}   req     The request object.
 * @param      {Response}  res     The response object.
 * @param      {Function}  next    The next callback.
 */
module.exports = function (req, res, next) {
  var donor = req.body;
  // todo: validate donor model using joi

  Donor.create({
    firstName: donor.firstName,
    lastName: donor.lastName,
    contactNumber: donor.contactNumber,
    emailAddress: donor.emailAddress,
    bloodGroup: donor.bloodGroup,
    loc: [donor.longitude, donor.latitude]
  }, function (err, data) {
    if (err) return next(err);
    res.send(data);
  });
};
