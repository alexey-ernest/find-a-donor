/**
 * @fileOverview GET a donor middleware.
 */

module.exports = function (db) {

  var service = require('../../../services/donor.service')(db);

  return function (req, res, next) {
    service.getDonor(req.params.id, function (err, donor) {
      if (err) return next(err);

      if (!donor) {
        return res.status(404).end();
      }

      res.send(donor);
    });
  };
};
