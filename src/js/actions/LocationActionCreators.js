/*
 * Location action creators.
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import DonorConstants from '../constants/DonorConstants';

var ActionTypes = DonorConstants.ActionTypes;

export default {

  /**
   * @param      {Array}  latitude and longitude
   */
  receive(latlng) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_LOCATION,
      location: latlng
    });
  },

  /**
   * @param      {Error}  Locating error details.
   */
  receiveError(err) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_LOCATION_ERROR,
      error: err
    });
  }

};
