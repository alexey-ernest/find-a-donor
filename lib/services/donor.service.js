/**
 * @fileOverview Donor business logic layer.
 */

var validation = require('../utils/validation');

 module.exports = function (db) {
  var Donor = db.Donor;

  return {

    /**
     * Registers a new donor.
     *
     * @param      {Object}    donor   Donor data.
     * @param      {Function}  fn      Callback.
     */
    registerDonor: function (donor, fn) {

      // validate input
      var errors = validation.validateDonor(donor);
      if (Object.keys(errors).length > 0) {
        var err = new Error('Donor validation failed');
        err.status = 400;
        err.errors = errors;
        return fn(err);
      }

      Donor.create({
        firstName: donor.firstName,
        lastName: donor.lastName,
        contactNumber: donor.contactNumber,
        emailAddress: donor.emailAddress,
        bloodGroup: donor.bloodGroup,
        loc: donor.loc
      }, fn);
    },

    /**
     * Updates donor data.
     *
     * @param      {string}    id      Donor id.
     * @param      {object}    data    Donor data.
     * @param      {Function}  fn      Callback.
     */
    updateDonor: function(id, data, fn) {
      // checking if donor exists first
      Donor.findById(id, function (err, donor) {
        if (err) return fn(err);

        if (!donor) {
          err = new Error('Could not find donor with id ' + id);
          err.status = 404;
          return fn(err);
        }

        // validating inputs
        var errors = validation.validateDonor(data);
        if (Object.keys(errors).length > 0) {
          err = new Error('Donor validation failed');
          err.status = 400;
          err.errors = errors;
          return fn(err);
        }

        // updating donor data
        delete data._id;
        Object.assign(donor, data);

        donor.save(fn);
      });
    }
  };

 };
