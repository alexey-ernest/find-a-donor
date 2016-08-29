/**
 * Global map object.
 *
 */

var _map = null;

export default {

  get() {
    return _map;
  },

  set(map) {
    _map = map;
  }

};
