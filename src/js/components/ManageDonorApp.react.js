/**
 * Donor managment private component.
 */

// CSS
import styles from '../../sass/modules/manage-donor-app.sass';

 // React
import React, {Component, PropTypes} from 'react';

// Router
import {useRouterHistory, Link} from 'react-router';
import {createHashHistory} from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

import EditDonor from './EditDonor.react';
import DonorAPIUtils from '../utils/DonorAPIUtils';

import {
  DonorStore,
} from '../stores';


const getStateFromStores = () => {
  return {
    donor: DonorStore.get().donor
  };
};

export default class ManageDonorApp extends Component {

  state = getStateFromStores();

  componentDidMount() {
    if (!this.props.params.id) {
      // if id is not specified - go to home
      return appHistory.push('/');
    }

    DonorStore.addChangeListener(this._onChange);

    DonorAPIUtils.getDonor(this.props.params.id);
  }

  componentWillUnmount() {
    DonorStore.removeChangeListener(this._onChange);
  }

  render() {
    return (
      <div className={styles['manage-donor-app']}>
        <div className={styles['edit-donor']}>
          <h1 className={styles['go-to-map']}>
            <Link to={'/'}>Donors on the Map</Link>
          </h1>
          <EditDonor
            donor={this.state.donor}
          />
        </div>
      </div>
    );
  }

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };

};
