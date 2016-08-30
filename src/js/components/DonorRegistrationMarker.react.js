/**
 * Donor registration marker component.
 */


// React
import React, {Component, PropTypes} from 'react';

// Toolbox
import Button from 'react-toolbox/lib/button';

const style = {
  marginTop: '-28px',
  marginLeft: '-28px'
};


export default class DonorRegistrationMarker extends Component {

  static propTypes = {
    onClick: PropTypes.func
  };

  render() {
    return (
      <Button
        onClick={this._onClick}
        style={style}
        icon="add_location"
        accent
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
