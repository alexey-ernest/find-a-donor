/**
 * Donor information component.
 */

// CSS
import styles from '../../sass/modules/donor-info.sass';

// React
import React, {Component, PropTypes} from 'react';

// Toolbox
import {Link} from 'react-toolbox';

export default class DonorInfo extends Component {

  static propTypes = {
    donor: PropTypes.object.isRequired
  };

  state = {
    showPhone: false,
    showEmail: false
  };

  render() {
    var donor = this.props.donor;

    var phone = this.state.showPhone ?
      donor.contactNumber : <a href="#" onClick={this._showPhone}>show</a>;

    var email = this.state.showEmail ?
      donor.emailAddress : <a href="#" onClick={this._showEmail}>show</a>;

    return (
      <ul className={styles['donor-info']}>
        <li>
          <strong>{donor.firstName} {donor.lastName} ({donor.bloodGroup})</strong>
        </li>
        <li>
          <i>Phone:</i> {phone}
        </li>
        <li>
          <i>Email:</i> {email}
        </li>
      </ul>
    );
  }

  _showPhone = () => {
    this.setState({...this.state, showPhone: true});
  };

  _showEmail = () => {
    this.setState({...this.state, showEmail: true});
  };

}
