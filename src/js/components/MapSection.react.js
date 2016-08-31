/**
 * Map section component.
 */

// CSS
import styles from '../../sass/modules/map-section.sass';

// React
import React, {Component, PropTypes} from 'react';

// Leaflet
import { Map, Marker, Popup, CircleMarker, TileLayer } from 'react-leaflet';
import MarkerLayer from 'react-leaflet-marker-layer';

// Toolbox
import { Snackbar } from 'react-toolbox';

import DonorRegistrationMarker from './DonorRegistrationMarker.react';
import DonorRegistrationForm from './DonorRegistrationForm.react';
import DonorConstants from '../constants/DonorConstants';


const DEFAULT_LOCATION = DonorConstants.HomeLocation.lnglat;

export default class MapSection extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    new_donor: null,
    showPopup: false,
    showSnackbar: false
  };

  render() {
    var location = this.props.data.location || DEFAULT_LOCATION;

    var markers = [{
      position: { lng: location[1], lat: location[0] }
    }];

    // popup
    var popup;
    if (!this.props.data.new_donor && this.state.showPopup) {
      popup = <Popup
                position={location}
                closeButton={false}
              >
                <DonorRegistrationForm data={this.props.data} />
              </Popup>;
    }

    // marker
    var marker;
    if (this.props.data.location) {
      marker = <MarkerLayer
                  markers={markers}
                  longitudeExtractor={m => m.position.lng}
                  latitudeExtractor={m => m.position.lat}
                  markerComponent={DonorRegistrationMarker}
                  propsForMarkers={{
                    onClick: this._onMarkerClick
                  }}
                />;
    }

    // snackbar
    var snackbar;
    if (!this.state.new_donor && this.props.data.new_donor) {
      // show snackbar if the donor has just registered
      this.state.showSnackbar = true;
      this.state.new_donor = this.props.data.new_donor;

      snackbar = <Snackbar
                    action='OK'
                    active={this.state.showSnackbar}
                    icon='place'
                    label='You&#39;ve just registered as a donor. Thanks.'
                    timeout={5000}
                    onClick={this._onSnackbarClick}
                    onTimeout={this._onSnackbarClick}
                    type='accept'
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
        {snackbar}
      </Map>
    );
  }

  _onMapClick = (event) => {
    this.setState({...this.state, 'showPopup': false});
  };

  _onMarkerClick = (marker) => {
    this.setState({...this.state, 'showPopup': true});
  };

  _onSnackbarClick = () => {
    this.setState({...this.state, 'showSnackbar': false});
  };

}
