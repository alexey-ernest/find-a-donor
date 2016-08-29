/**
 * React app constants.
 */

import keyMirror from 'keymirror';

const DonorConstants = {

  ActionTypes: keyMirror({
    RECEIVE_LOCATION: null,
    RECEIVE_LOCATION_ERROR: null,
    SUBMIT_DONOR_DATA: null,
    RECEIVE_NEW_VIEW_BOUNDS: null
  }),

  HomeLocation: {
    lnglat: [55.7522200, 37.6155600], // Mosocw
    zoom: 13,
    basemap: 'Streets'
  }

};

export default DonorConstants;
