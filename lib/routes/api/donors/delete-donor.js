/**
 * @fileOverview Delete a donor by id middleware.
 */

module.exports = function (db) {

  var service = require('../../../services/donor.service')(db);

  return function (req, res, next) {

    service.deleteDonor(req.params.id, function (err) {
      if (err) return next(err);

      res.end();
    });
  };
};
