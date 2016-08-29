
import LocationActionCreators from '../actions/LocationActionCreators';
import MapUtils from './MapUtils';

export default {

  getCurrentLocation() {
    var map = MapUtils.get();

    map.on('locationfound', (e) => {
      LocationActionCreators.receive(e.latlng);
    });
    map.on('locationerror', (e) => {
      LocationActionCreators.receiveError(e);
    });

    map.locate();
  }

};
