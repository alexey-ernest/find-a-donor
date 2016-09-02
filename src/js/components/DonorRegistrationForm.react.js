/**
 * Map section component.
 */

// CSS
import styles from '../../sass/modules/donor-registration-form.sass';

// React
import React, {Component, PropTypes} from 'react';

// Toolbox
import {Input, Button, Autocomplete} from 'react-toolbox';

import DonorActionCreators from '../actions/DonorActionCreators';
import Validation from '../../../lib/utils/validation';

const ENTER_KEY_CODE = 13;

export default class DonorRegistrationForm extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    isSubmitted: false,
    firstName: '',
    lastName: '',
    contactNumber: '',
    emailAddress: '',
    bloodGroup: ''
  };

  componentDidMount() {
    this.refs.firstNameInput.getWrappedInstance().focus();
  }

  render() {
    var errors = Validation.validateDonor(this.state);
    var isFormValid = Object.keys(errors).length === 0;
    var isSubmitted = this.state.isSubmitted;
    var groups = Object.keys(Validation.BLOOD_GROUPS);

    return (
      <form
        className={styles['donor-registration-form']}
        onSubmit={this._onSubmit}>
        <h1>Pin your location on the Donor's map</h1>
        <div className={styles.row}>
          <Input
            ref="firstNameInput"
            className={styles.col1}
            type="text"
            label="First Name"
            name="firstName"
            value={this.state.firstName}
            onChange={this._onChange.bind(this, 'firstName')}
            onKeyDown={this._onKeyDown}
            disabled={isSubmitted}
            maxLength={30}
          />
          <Input
            className={styles.col2}
            type="text"
            label="Last Name"
            name="lastName"
            value={this.state.lastName}
            onChange={this._onChange.bind(this, 'lastName')}
            onKeyDown={this._onKeyDown}
            disabled={isSubmitted}
            maxLength={30}
          />
        </div>
        <Input
          type="text"
          label="Contact Number"
          name="contactNumber"
          value={this.state.contactNumber}
          onChange={this._onChange.bind(this, 'contactNumber')}
          onKeyDown={this._onKeyDown}
          disabled={isSubmitted}
        />
        <Input
          type="text"
          label="Email Address"
          name="emailAddress"
          value={this.state.emailAddress}
          onChange={this._onChange.bind(this, 'emailAddress')}
          onKeyDown={this._onKeyDown}
          disabled={isSubmitted}
        />
        <Input
          type="text"
          label="Blood Group (e.g., 0- or A+)"
          name="bloodGroup"
          value={this.state.bloodGroup}
          onChange={this._onChange.bind(this, 'bloodGroup')}
          disabled={isSubmitted}
        />
        <Button
          label="Pin"
          icon="add_location"
          raised primary
          disabled={isSubmitted || !isFormValid}
          onClick={this._onSubmit}
        />
      </form>
    );
  }

  _onChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  _onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._onSubmit();
    }
  };

  _onSubmit = (event) => {
    event.preventDefault();

    this.setState({...this.state, isSubmitted: true});

    var donorData = Object.assign({}, this.state, {
      loc: this.props.data.location
    });

    DonorActionCreators.submitDonorData(donorData);
  };
}
