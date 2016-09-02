/**
 * Donor registration marker component.
 */

// CSS
import styles from '../../sass/modules/donor-registration-marker.sass';

// React
import React, {Component, PropTypes} from 'react';

// Toolbox
import Button from 'react-toolbox/lib/button';

export default class DonorRegistrationMarker extends Component {

  static propTypes = {
    onClick: PropTypes.func
  };

  render() {
    return (
      <Button
        className={styles['donor-registration-marker']}
        onClick={this._onClick}
        icon="add_location"
        primary
        floating />
    );
  }

  _onClick = (event) => {
    let { onClick } = this.props;
    if (onClick) {
      onClick(this.props.marker);
    }
  };

}
