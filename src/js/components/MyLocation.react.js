/**
 * My location component.
 */

// React
import React, {Component, PropTypes} from 'react';

// Toolbox
import Button from 'react-toolbox/lib/button';

import LocationUtils from '../utils/LocationUtils';

export default class DonorApp extends Component {

  state = {
    location: null,
    isLookingForLocation: false
  };

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    if (!this.state.location ||
        (this.props.data.location && this.state.location !== this.props.data.location)
        ) {
      // new location arrived
      this.state.isLookingForLocation = false;
    }

    this.state.location = this.props.data.location;

    return (
      <Button
        icon="my_location"
        floating mini
        primary
        onClick={this._onClick}
        disabled={this.state.isLookingForLocation}
      />
    );
  }

  _onClick = () => {
    LocationUtils.getCurrentLocation();
    this.setState({...this.state, isLookingForLocation: true});
  }

};
