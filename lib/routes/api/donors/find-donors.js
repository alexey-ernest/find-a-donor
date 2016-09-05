/**
 * @fileOverview Find donors middleware.
 */

module.exports = function (db) {

  var service = require('../../../services/donor.service')(db);

  return function (req, res, next) {
    var bl = [req.params.bllng, req.params.bllat];
    var ur = [req.params.urlng, req.params.urlat];

    service.findDonors(bl, ur, function (err, data) {
      if (err) return next(err);

      res.send(data);
    });
  };
};
