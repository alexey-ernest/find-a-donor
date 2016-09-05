/**
 * @fileOverview Add a donor middleware.
 */

module.exports = function (db) {

  var service = require('../../../services/donor.service')(db);

  return function (req, res, next) {
    var donor = req.body;

    service.registerDonor(donor, function (err, data) {
      if (err) {
        if (err.status === 400) {
          return res.status(400).send(err.errors);
        }

        return next(err);
      }
      res.send(data);
    });
  }
};
