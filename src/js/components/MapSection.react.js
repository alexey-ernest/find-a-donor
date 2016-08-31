/**
 * Map section component.
 */

// CSS
import styles from '../../sass/modules/map-section.sass';

import React, {Component, PropTypes} from 'react';
import { Map, Marker, Popup, CircleMarker, TileLayer } from 'react-leaflet';
import MarkerLayer from 'react-leaflet-marker-layer';

import DonorRegistrationMarker from './DonorRegistrationMarker.react';
import DonorRegistrationForm from './DonorRegistrationForm.react';
import DonorConstants from '../constants/DonorConstants';


const DEFAULT_LOCATION = DonorConstants.HomeLocation.lnglat;

export default class MapSection extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    showPopup: false
  };

  render() {
    var location = this.props.data.location || DEFAULT_LOCATION;

    var markers = [{
      position: { lng: location[1], lat: location[0] }
    }];

    var popup;
    if (this.state.showPopup) {
      popup = <Popup
                position={location}
                closeButton={false}
              >
                <DonorRegistrationForm donor={{}} />
              </Popup>;
    }

    var marker;
    if (this.props.data.location) {
      marker = <MarkerLayer
                  markers={markers}
                  longitudeExtractor={m => m.position.lng}
                  latitudeExtractor={m => m.position.lat}
                  markerComponent={DonorRegistrationMarker}
                  propsForMarkers={{
                    onClick: this._onClick
                  }}
                />;
    }

    return (
      <Map
        onClick={this._onMapClick}
        center={location}
        doubleClickZoom={false}
        animate={true}
        zoom={DonorConstants.HomeLocation.zoom}
      >
        <TileLayer
          url='http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        />
        <TileLayer
          url='http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        />
        {marker}
        {popup}
      </Map>
    );
  }

  _onMapClick = (event) => {
    this.setState({...this.state, ['showPopup']: false});
  };

  _onClick = (marker) => {
    console.log('Marker click');
    this.setState({...this.state, ['showPopup']: true});
  };

}
