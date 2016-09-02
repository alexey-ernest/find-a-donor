/**
 * Donor marker component.
 */

// CSS
import styles from '../../sass/modules/donor-marker.sass';

// React
import React, {Component, PropTypes} from 'react';

// Toolbox
import {FontIcon} from 'react-toolbox';

export default class DonorRegistrationMarker extends Component {

  static propTypes = {
    onClick: PropTypes.func
  };

  render() {
    return (
      <FontIcon
        className={styles['donor-marker']}
        onClick={this._onClick}
        value="person_pin_circle"
      />
    );
  }

  _onClick = (event) => {
    let { onClick } = this.props;
    if (onClick) {
      onClick(this.props.marker);
    }
  };

}
