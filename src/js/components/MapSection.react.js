/**
 * Map section component.
 */

// CSS
import * as styles from '../../sass/modules/map-section.sass';

import React, {Component, PropTypes} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import DonorRegistrationForm from './DonorRegistrationForm.react';
import DonorConstants from '../constants/DonorConstants';


var DEFAULT_LOCATION = DonorConstants.HomeLocation.lnglat;

export default class MapSection extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    var location = this.props.data.location || DEFAULT_LOCATION;
    return (
      <Map center={location} zoom={DonorConstants.HomeLocation.zoom}>
        <TileLayer
          url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
        />
        <Marker position={location}>
          <Popup>
            <DonorRegistrationForm donor={{}} />
          </Popup>
        </Marker>
      </Map>
    );
  }

}
