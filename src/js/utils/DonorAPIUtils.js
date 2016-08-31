/**
 * Utilities for working with Donor API.
 */

import DonorActionCreators from '../actions/DonorActionCreators';

var URL;
if (process.env.NODE_ENV === 'production') {
  URL = '/api/donors';
} else {
  URL = 'http://localhost:8080/api/donors';
}


export default {

  registerDonor: function (donorData) {

    $.post(URL, donorData, function(data) {
      DonorActionCreators.receiveNewDonor(data);
    });
  }

 };
