/**
 * Edit donor component.
 */

 // React
import React, {Component, PropTypes} from 'react';

// Toolbox
import {Card, CardTitle, CardText} from 'react-toolbox';

import DonorRegistrationForm from './DonorRegistrationForm.react';
import DonorAPIUtils from '../utils/DonorAPIUtils';

export default class EditDonor extends Component {

  static propTypes = {
    donor: PropTypes.object,
    onDelete: PropTypes.func
  };

  state = {
    submitted: false,
    button: 'Save'
  };

  componentWillReceiveProps(props) {
    if (this.state.submitted) {
      // get new donor data after submittion
      this.setState({...this.state,
        submitted: false,
        button: 'Saved'
      });
    }
  }

  render() {
    return (
      <Card>
        <CardTitle
          title="Find a Donor Service"
        />
        <CardText>
          <DonorRegistrationForm
            donor={this.props.donor}
            onSubmit={this._onSubmit}
            onCancel={this._onDelete}
            title="Your donor account information"
            button={this.state.button}
            cancelButton="Delete"
            activeAfterSubmit={true}
          />
        </CardText>
      </Card>
    );
  }

  _onSubmit = (data) => {
    DonorAPIUtils.updateDonor(data);

    this.setState({...this.state,
      submitted: true,
      button: 'Saving...'
    });
  };

  _onDelete = () => {
    DonorAPIUtils.deleteDonor(this.props.donor._id);

    if (this.props.onDelete) {
      this.props.onDelete();
    }
  };

};
