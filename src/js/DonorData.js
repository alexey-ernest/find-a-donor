/**
 * Initialize app's data.
 */

import LocationUtils from './utils/LocationUtils';

export default {

  init: function() {

    LocationUtils.getCurrentLocation();
  }
};
