/**
 * Donor store.
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import DonorConstants from '../constants/DonorConstants';
import DonorAPIUtils from '../utils/DonorAPIUtils';

import EventEmitter from 'events';

var ActionTypes = DonorConstants.ActionTypes;
var CHANGE_EVENT = 'change';

/**
 * Private storage.
 *
 * @type       {Object}
 */
var _data = {
  new_donor: null,
  donors: []
};

class DonorStore extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /**
   * Adds a change listener.
   *
   * @param      {function}  callback  The callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * Removes a change listener.
   *
   * @param      {Function}  callback  The callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  get() {
    return _data;
  }
}

// single instance
let store = new DonorStore();

// dispatch token
DonorStore.dispatchToken = AppDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.SUBMIT_DONOR_DATA:
      DonorAPIUtils.registerDonor(action.donor);
      break;

    case ActionTypes.RECEIVE_NEW_DONOR_DATA:
      _data.new_donor = action.donor;
      this.emitChange();
      break;

    case ActionTypes.RECEIVE_VISIBLE_DONORS:
      _data.donors = action.donors;
      this.emitChange();
      break;

    default:
      // do nothing
  }

}.bind(store));

export default store;
