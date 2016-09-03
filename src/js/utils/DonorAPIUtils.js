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

  /**
   * Registers new donor.
   *
   * @param      {Object}  donorData  The donor data.
   */
  registerDonor: function (donorData) {

    $.post(URL, donorData, function(data) {
      DonorActionCreators.receiveNewDonor(data);
    });
  },

/**
  * Get donor by id.
  *
  * @param      {string}  id      Donor id.
  */
  getDonor: function (id) {

    $.get(URL + '/' + id, function(data) {
      DonorActionCreators.receiveDonor(data);
    });
  },

  /**
   * Update donor.
   *
   * @param      {Object}  donorData  The new donor data.
   */
  updateDonor: function (donorData) {

    $.ajax({
      type: 'PUT',
      url: URL + '/' + donorData._id,
      data: donorData,
      success: function(data) {
        DonorActionCreators.receiveDonor(data);
      }
    });
  },

  /**
   * Finds donors in rectangular area defined by bottom-left and upper-right corners.
   *
   * @param      {[Number]}  bl      Bottom left corner coordinates.
   * @param      {[Number]}  ur      Upper right corner coordinates.
   */
  findDonors: function (bl, ur) {
    $.get(URL + '/find/' + bl[0] + ',' + bl[1] + '/' + ur[0] + ',' + ur[1], function (data) {
      DonorActionCreators.receiveDonors(data);
    });
  }

 };
