/**
 * React app constants.
 */

import keyMirror from 'keymirror';

const DonorConstants = {

  ActionTypes: keyMirror({
    RECEIVE_LOCATION: null,
    RECEIVE_LOCATION_ERROR: null,

    SUBMIT_DONOR_DATA: null,
    RECEIVE_NEW_DONOR_DATA: null,
    RECEIVE_VISIBLE_DONORS: null,

    RECEIVE_NEW_VIEW_BOUNDS: null
  }),

  HomeLocation: {
    lnglat: [37.6155600, 55.7522200], // Moscow
    zoom: 13,
    basemap: 'Streets'
  }

};

export default DonorConstants;
