/**
 * Donor App main component.
 */

import React, {Component, PropTypes} from 'react';

import {
  LocationStore
} from '../stores';

import MapSection from './MapSection.react';

const getStateFromStores = () => {
  return {
    location: LocationStore.get()
  };
};

export default class DonorApp extends Component {

  state = getStateFromStores();

  componentDidMount() {
    LocationStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    LocationStore.addChangeListener(this._onChange);
  }

  render() {
    return (
      <div className="donor-app">
        <MapSection data={this.state} />
      </div>
    );
  }

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  }

};
