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

import DonorMarker from './DonorMarker.react';
import DonorRegistrationMarker from './DonorRegistrationMarker.react';
import DonorRegistrationForm from './DonorRegistrationForm.react';
import DonorInfo from './DonorInfo.react';

import DonorAPIUtils from '../utils/DonorAPIUtils';
import DonorConstants from '../constants/DonorConstants';


const DEFAULT_LOCATION = DonorConstants.HomeLocation.lnglat;

export default class MapSection extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    new_donor: null,
    showPopup: false,
    showSnackbar: false,
    currentDonor: null
  };

  renderDonors(donors) {
    return (
      <MarkerLayer
        markers={donors}
        longitudeExtractor={d => d.loc[0]}
        latitudeExtractor={d => d.loc[1]}
        markerComponent={DonorMarker}
        propsForMarkers={{
          onClick: this._onDonorMarkerClick
        }}
      />
    );
  }

  renderDonorPopup(donor) {
    var loc = [donor.loc[1], donor.loc[0]];
    return (
      <Popup
        key={donor._id}
        position={loc}
      >
        <DonorInfo donor={donor} />
      </Popup>
    );
  }

  renderMyPopup(location) {
    return (
      <Popup
        key={location[0] + ',' + location[1]}
        position={location}
      >
        <DonorRegistrationForm data={this.props.data} />
      </Popup>
    );
  }

  renderMyMarker(location) {
    return (
      <MarkerLayer
        markers={[location]}
        longitudeExtractor={m => m[1]}
        latitudeExtractor={m => m[0]}
        markerComponent={DonorRegistrationMarker}
        propsForMarkers={{
          onClick: this._onMarkerClick
        }}
      />
    );
  }

  renderSnackbar(btn, msg, icon) {
    return (
      <Snackbar
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
    var location = this.props.data.location || DEFAULT_LOCATION;

    // donors
    var donors;
    if (this.props.data.donors) {
      donors = this.renderDonors(this.props.data.donors);
    }

    var donorPopup;
    if (this.state.currentDonor) {
      donorPopup = this.renderDonorPopup(this.state.currentDonor);
    }

    // my popup
    var myPopup;
    if (!this.props.data.new_donor && this.state.showPopup) {
      myPopup = this.renderMyPopup(location);
    }

    // my marker
    var myMarker;
    if (this.props.data.location) {
      myMarker = this.renderMyMarker(this.props.data.location);
    }

    // snackbar
    var snackbar;
    if (!this.state.new_donor && this.props.data.new_donor) {
      // show snackbar if the donor has just registered
      this.state.showSnackbar = true;
      this.state.new_donor = this.props.data.new_donor;

      snackbar = this.renderSnackbar('OK', 'You&#39;ve just registered as a donor. Thanks.', 'place');
    }

    return (
      <Map
        ref="map"
        onClick={this._onMapClick}
        onMoveEnd={this._onMapMoveEnd}
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
        {donors}
        {myMarker}
        {snackbar}
        {myPopup}
        {donorPopup}
      </Map>
    );
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
    DonorAPIUtils.findDonors(bl, ur);
  };

  _onMapClick = (event) => {
    this.setState({...this.state, 'showPopup': false});
    this.setState({...this.state, 'currentDonor': null});
  };

  _onDonorMarkerClick = (donor) => {
    this.setState({...this.state, 'currentDonor': donor});
  };

  _onMarkerClick = (marker) => {
    this.setState({...this.state, 'showPopup': true});
  };

  _onSnackbarClick = () => {
    this.setState({...this.state, 'showSnackbar': false});
  };

}
