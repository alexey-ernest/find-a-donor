/**
 * Donor App main component.
 */

// CSS
import styles from '../../sass/modules/donor-app.sass';

// React
import React, {Component, PropTypes} from 'react';

import MyLocation from './MyLocation.react';

import {
  LocationStore,
  DonorStore,
} from '../stores';

import MapSection from './MapSection.react';

const getStateFromStores = () => {
  return {
    location: LocationStore.get(),
    new_donor: DonorStore.get()
  };
};

export default class DonorApp extends Component {

  state = getStateFromStores();

  componentDidMount() {
    LocationStore.addChangeListener(this._onChange);
    DonorStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    LocationStore.removeChangeListener(this._onChange);
    DonorStore.removeChangeListener(this._onChange);
  }

  render() {
    return (
      <div className={styles['donor-app']}>
        <MapSection data={this.state} />
        <div className={styles['my-location-button']}>
          <MyLocation data={this.state} />
        </div>
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
