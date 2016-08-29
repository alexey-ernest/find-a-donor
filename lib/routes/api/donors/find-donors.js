/**
 * @fileOverview Find donors middleware.
 */

var debug = require('debug')('find-a-donor:api:find-donors');
var Donor = require('../../../models/donor');

/**
 * Find donors middleware.
 *
 * @param      {Request}   req     The request object.
 * @param      {Response}  res     The response object.
 * @param      {Function}  next    The next callback.
 */
module.exports = function (req, res, next) {
  var longitude = req.params.longitude;
  var latitude = req.params.latitude;
  var distance = req.params.distance;

  Donor.findDonors(longitude, latitude, distance, function (err, data) {
    if (err) return next(err);
    res.send(data);
  });
};
