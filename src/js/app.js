/**
 * This file bootstraps the entire application.
 */

// CSS
import * as styles from '../sass/base.sass';

// React
import React from 'react';
import ReactDOM from 'react-dom';

// App
import DonorApp from './components/DonorApp.react';

// App initial data
import DonorData from './DonorData';


// render
ReactDOM.render(
  <DonorApp />,
  document.getElementById('react')
);

// init data
DonorData.init();

