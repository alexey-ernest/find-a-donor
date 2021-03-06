/**
 * Map section component.
 */

// CSS
import styles from '../../sass/modules/map-section.sass';

// React
import React, {Component, PropTypes} from 'react';

// Router
import {useRouterHistory} from 'react-router';
import {createHashHistory} from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

// Leaflet
import {divIcon} from 'leaflet';
import {Map, Marker, Popup, CircleMarker, TileLayer, LayersControl, FeatureGroup} from 'react-leaflet';

// Toolbox
import {Snackbar} from 'react-toolbox';

import DonorRegistrationForm from './DonorRegistrationForm.react';
import DonorInfo from './DonorInfo.react';

import DonorActionCreators from '../actions/DonorActionCreators';
import DonorSocketUtils from '../utils/DonorSocketUtils';
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

  snackbarTimeout = null;

  componentWillReceiveProps(props) {
    if (this.props.data.newDonor && props.data.newDonor &&
        this.props.data.newDonor._id !== props.data.newDonor._id) {
      // new donor registered
      this.setState({...this.state,
        showSnackbar: true
      });
    }
  }

  componentWillUnmount() {
    if (this.snackbarTimeout) {
      clearTimeout(this.snackbarTimeout);
      this.snackbarTimeout = null;
    }
  }

  _onMapMoveEnd = (event) => {
    var map = this.refs.map;

    // getting map bounds
    var mapBounds = map.leafletElement.getBounds(),
        sw = mapBounds.getSouthWest(),
        ne = mapBounds.getNorthEast();

    // requesting visible donors data
    var bl = [sw.lng, sw.lat],
        ur = [ne.lng, ne.lat];
    DonorSocketUtils.findDonors(bl, ur);
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
    appHistory.push('/donor/' + this.props.data.newDonor._id);
  };

  _onSnackbarTimeout = () => {
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

  _onRegistrationSubmit = (donorData) => {
    // setting location data
    var location = this.state.selectedLocation || this.props.data.location;
    donorData.loc = [location[0], location[1]] // lnglat

    DonorActionCreators.submitDonorData(donorData);
  };

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
              <DonorRegistrationForm
                donor={this.props.data.newDonor}
                onSubmit={this._onRegistrationSubmit}
                title="Pin your location on the Donor's map"
                button="Pin"
                buttonIcon="add_location"
              />
            </Popup>
          </Marker>
        </FeatureGroup>
      </LayersControl.Overlay>
    );
  }

  renderRegistrationSnackbar() {
    if (!this.props.data.newDonor) {
      return null;
    }

    if (this.snackbarTimeout) {
      clearTimeout(this.snackbarTimeout);
      this.snackbarTimeout = null;
    }

    // set timeout
    if (this.state.showSnackbar) {
      this.snackbarTimeout = setTimeout(() => {
        this._onSnackbarTimeout();
        this.snackbarTimeout = null;
      }, 20000);
    }

    var msg = 'You\'ve just registered as a donor. You can update your information by clicking the Details button.';
    return (
      <Snackbar
        key="snackbar"
        action='Details'
        active={this.state.showSnackbar}
        icon="place"
        label={msg}
        timeout={20000}
        onClick={this._onSnackbarClick}
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
    var snackbar = this.renderRegistrationSnackbar();

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
