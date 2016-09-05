/**
 * @fileOverview Update donor middleware.
 */

module.exports = function (db) {

  var service = require('../../../services/donor.service')(db);

  return function (req, res, next) {

    service.updateDonor(req.params.id, req.body, function (err, data) {
      if (err) {
        if (err.status === 400) {
          return res.status(400).send(err.errors);
        } else if (err.status === 404) {
          return res.status(404).end();
        }

        return next(err);
      }
      res.send(data);
    });
  }
};
