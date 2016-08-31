/**
 * Utilities for working with GEO API.
 */

import LocationActionCreators from '../actions/LocationActionCreators';

export default {

  getCurrentLocation() {

    if ('geolocation' in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(function(position) {
        LocationActionCreators.receive([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      /* geolocation IS NOT available */
      LocationActionCreators.receiveError(new Error('GeoLocation is not available.'));
    }
  }

};
