/**
 * Common validation regexes
 */

/**
 * Regular expressions.
 */
var PATTERNS = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^(?:\+|00)\d{1,2}\s*\d{3}\s*\d{4}\s*\d{3}$/
};

/**
 * Blood groups.
 */
var BLOOD_GROUPS = {};
['0', 'A', 'B', 'AB'].forEach(function (g) {
  ['-', '+'].forEach(function (f) {
    BLOOD_GROUPS[g + f] = null;
  });
});

module.exports = {

  /**
   * Validates a donor data.
   * I use primitive lightweight validation to share it with front-end.
   *
   * @param      {Object}   donor   Donor data.
   * @return     {boolean}  True if the data is correct.
   */
  validateDonor: function (donor) {
    var errors = {};

    if (!donor.firstName || donor.firstName.trim() === '') {
      errors['firstName'] = 'First Name field required';
    }
    if (!donor.lastName || donor.lastName.trim() === '') {
      errors['lastName'] = 'Last Name field required';
    }
    if (!donor.contactNumber || donor.contactNumber.trim() === '' || !PATTERNS.phone.test(donor.contactNumber)) {
      errors['contactNumber'] = 'Contact Number field is not specified or invalid: ' + donor.contactNumber;
    }
    if (!donor.emailAddress || donor.emailAddress.trim() === '' || !PATTERNS.email.test(donor.emailAddress)) {
      errors['emailAddress'] = 'Email Address field is not specified or invalid: ' + donor.emailAddress;
    }
    if (!donor.bloodGroup || donor.bloodGroup.trim() === '' || !(donor.bloodGroup in BLOOD_GROUPS)) {
      errors['bloodGroup'] = 'Blood Group field is not specified or invalid: ' + donor.bloodGroup;
    }

    return errors;
  }

};
