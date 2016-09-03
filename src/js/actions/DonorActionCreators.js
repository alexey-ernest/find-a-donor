/*
 * Donor action creators.
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import DonorConstants from '../constants/DonorConstants';

var ActionTypes = DonorConstants.ActionTypes;

export default {

  /**
   * @param      {Object}  New donor registration data.
   */
  submitDonorData(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.SUBMIT_DONOR_DATA,
      donor: data
    });
  },

  /**
   * @param      {Object}  Newly created donor data.
   */
  receiveNewDonor(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_NEW_DONOR_DATA,
      donor: data
    });
  },

  /**
   * @param      {Object}  Donor.
   */
  receiveDonor(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_DONOR,
      donor: data
    });
  },

  /**
   * @param      {Array}  Array of currently visible donors.
   */
  receiveDonors(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_VISIBLE_DONORS,
      donors: data
    });
  }

};
