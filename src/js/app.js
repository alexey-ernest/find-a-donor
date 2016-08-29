/**
 * This file bootstraps the entire application.
 */

// CSS
import * as styles from '../sass/base.sass';

// React
import React from 'react';
import ReactDOM from 'react-dom';

// Material UI
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  cyan500,
  cyan700,
  grey400,
  amber500,
  grey100,
  grey500,
  darkBlack,
  white,
  grey300,
  fullBlack
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

// App
import DonorApp from './components/DonorApp.react';

// App initial data
import DonorData from './DonorData';


// More on Colors: http://www.material-ui.com/#/customization/colors
var muiTheme = getMuiTheme({
  palette: {
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: amber500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  }
});

// Pass muiTheme down to the components tree via context
class App extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  getChildContext() {
    return {muiTheme: muiTheme};
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <DonorApp />
      </MuiThemeProvider>
    );
  }
}

// render
ReactDOM.render(
  <App />,
  document.getElementById('react')
);

// init data
DonorData.init();

