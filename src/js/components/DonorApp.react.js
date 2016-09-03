/**
 * Donor App main component.
 */

// React
import React, {Component, PropTypes} from 'react';

// Router
import { browserHistory, Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

import MapApp from './MapApp.react';
import ManageDonorApp from './ManageDonorApp.react';

class Layout extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default class DonorApp extends Component {

  render() {
    return (
      <Router history={appHistory}>
        <Route path="/" component={Layout}>
          <IndexRoute component={MapApp} />
          <Route path="donor/:id" component={ManageDonorApp} />
          <Route path="*" component={MapApp} />
        </Route>
      </Router>
    );
  }

};
