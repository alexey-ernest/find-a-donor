/**
 * Map section component.
 */

// CSS
import * as styles from '../../sass/modules/map-section.sass';

import React, {Component, PropTypes} from 'react';

import DonorConstants from '../constants/DonorConstants';
import MapUtils from '../utils/MapUtils';

export default class MapSection extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  componentDidMount() {
    var homeLocation = DonorConstants.HomeLocation;

    // create map
    var map = L.map('map').setView(homeLocation.lnglat, homeLocation.zoom);

    // load ESRI basemap
    L.esri.basemapLayer(homeLocation.basemap).addTo(map);

    // cache map
    MapUtils.set(map);
  }

  componentWillReceiveProps(nextProps) {
    var homeLocation = DonorConstants.HomeLocation;

    // setting current location
    var map = MapUtils.get();
    if (map) {
      map.setView(nextProps.data.location, homeLocation.zoom);

      // add marker
      L.marker(nextProps.data.location).addTo(map)
        .bindPopup('You are here')
        .openPopup();
    }
  }

  render() {
    return (
      <section id="map">
      </section>
    );
  }

}
