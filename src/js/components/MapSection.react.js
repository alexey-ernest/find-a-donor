/**
 * Map section component.
 */

// CSS
import styles from '../../sass/modules/map-section.sass';

// React
import React, {Component, PropTypes} from 'react';

// Leaflet
import {divIcon} from 'leaflet';
import {Map, Marker, Popup, CircleMarker, TileLayer, LayersControl, FeatureGroup} from 'react-leaflet';

// Toolbox
import {Snackbar} from 'react-toolbox';

import DonorMarker from './DonorMarker.react';
import DonorRegistrationMarker from './DonorRegistrationMarker.react';
import DonorRegistrationForm from './DonorRegistrationForm.react';
import DonorInfo from './DonorInfo.react';

import DonorAPIUtils from '../utils/DonorAPIUtils';
import DonorConstants from '../constants/DonorConstants';


const DEFAULT_LOCATION = DonorConstants.HomeLocation.lnglat;
const registerDonorIcon = divIcon({
  className: styles['register-donor-icon'],
  iconSize: [48, 48],
  html: '<i class="material-icons">pin_drop</i>',
});

export default class MapSection extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    selectedLocation: null,
    showSnackbar: true,
    isPopupJustClosed: false
  };

  _onMapMoveEnd = (event) => {
    var map = this.refs.map;

    // getting map bounds
    var mapBounds = map.leafletElement.getBounds(),
        sw = mapBounds.getSouthWest(),
        ne = mapBounds.getNorthEast();

    // requesting visible donors data
    var bl = [sw.lng, sw.lat],
        ur = [ne.lng, ne.lat];
    DonorAPIUtils.findDonors(bl, ur);
  };

  _onMapClick = (event) => {
    if (this.state.isPopupJustClosed) {
      // preventing new location pinning just after popup closed
      this.state.isPopupJustClosed = false;
      return;
    }

    var location = [event.latlng.lng, event.latlng.lat];
    this.setState({...this.state,
      selectedLocation: location
    });

    // showing popup
    if (this.refs.newDonorMarker) {
      this.refs.newDonorMarker.leafletElement.openPopup();
    }
  };

  _onMapPopupOpen = (event) => {
  };

  _onMapPopupClose = (event) => {
    this.state.isPopupJustClosed = true;
  };

  _onSnackbarClick = () => {
    this.setState({...this.state,
      showSnackbar: false
    });
  };

  renderDonors(donors) {
    if (!donors || !donors.length) {
      return null;
    }

    var donorMarkers = donors.map(function (donor) {
      return (
        <Marker
          key={donor._id}
          position={[donor.loc[1], donor.loc[0]]}>
          <Popup>
            <DonorInfo donor={donor} />
          </Popup>
        </Marker>
      );
    });

    return (
      <LayersControl.Overlay name='Blood Donors' checked={true}>
        <FeatureGroup color='purple'>
          {donorMarkers}
        </FeatureGroup>
      </LayersControl.Overlay>
    );
  }

  renderDonorRegistration(location) {
    if (!location) {
      return null;
    }

    var key = location[0] + ',' + location[1];
    return (
      <LayersControl.Overlay name='Register as a donor' checked={true}>
        <FeatureGroup color='blue'>
          <Marker
            ref="newDonorMarker"
            key={key}
            icon={registerDonorIcon}
            position={[location[1], location[0]]}
          >
            <Popup
              closeButton={false}
              position={[location[1], location[0]]}
            >
              <DonorRegistrationForm data={this.props.data} location={location} />
            </Popup>
          </Marker>
        </FeatureGroup>
      </LayersControl.Overlay>
    );
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.data.location) {
  //     return;
  //   }

  //   if (this.refs.newDonorMarker) {
  //     this.refs.newDonorMarker.leafletElement.openPopup();
  //   }
  // }

  renderSnackbar(btn, msg, icon) {
    if (!this.props.data.newDonor) {
      return null;
    }

    return (
      <Snackbar
        key="snackbar"
        action={btn}
        active={this.state.showSnackbar}
        icon={icon}
        label={msg}
        timeout={5000}
        onClick={this._onSnackbarClick}
        onTimeout={this._onSnackbarClick}
        type='accept'
      />
    );
  }

  render() {
    // map center location
    var mapCenterLocation = this.props.data.location || DEFAULT_LOCATION;

    // donors
    var donors = this.renderDonors(this.props.data.donors);

    // donor registration
    var donorRegistration = this.renderDonorRegistration(this.state.selectedLocation || this.props.data.location);

    // snackbar
    var snackbar = this.renderSnackbar('OK', 'You\'ve just registered as a donor. Thanks.', 'place');

    return (
      <div>
        <Map
          ref="map"
          onClick={this._onMapClick}
          onPopupOpen={this._onMapPopupOpen}
          onPopupClose={this._onMapPopupClose}
          onMoveEnd={this._onMapMoveEnd}
          center={[mapCenterLocation[1], mapCenterLocation[0]]}
          doubleClickZoom={false}
          animate={false}
          zoom={DonorConstants.HomeLocation.zoom}
        >
          <TileLayer
            url='http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          />
          <TileLayer
            url='http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
          />
          <LayersControl position='topright'>
            {donors}
            {donorRegistration}
          </LayersControl>
        </Map>
        {snackbar}
      </div>
    );
  }

}
