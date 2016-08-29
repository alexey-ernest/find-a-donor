/**
 * User current location store.
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import DonorConstants from '../constants/DonorConstants';
import EventEmitter from 'events';

var ActionTypes = DonorConstants.ActionTypes;
var CHANGE_EVENT = 'change';

/**
 * Private storage.
 *
 * @type       {Object}
 */
var _data = null;

class LocationStore extends EventEmitter {

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
let store = new LocationStore();

// dispatch token
LocationStore.dispatchToken = AppDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.RECEIVE_LOCATION:
      _data = action.location;
      this.emitChange();
      break;

    case ActionTypes.RECEIVE_LOCATION_ERROR:
      console.error(action.error.message);
      break;

    default:
      // do nothing
  }

}.bind(store));

export default store;
