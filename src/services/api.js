'use strict';

import React from 'react';

class ApiService {
  async searchJobs(query, location) {
    try {
      let response = await fetch('https://api.empfehlungsbund.de/api/v2/jobs/search.json?q=' + encodeURI(query) + '&o=' + encodeURI(location));
      let responseJson = await response.json();
      return responseJson;
    } catch(err) {
      console.log(err);
    }
  }

  async reverseGeocode(latitude, longitude) {
    try {
      let response = await fetch('https://api.empfehlungsbund.de/api/v2/utilities/reverse_geocomplete.json?api_key=API_KEY_REMOVED&lat=' + encodeURI(latitude) + '&lon=' + encodeURI(longitude));
      let responseJson = await response.json();
      return responseJson;
    } catch(err) {
      console.log(err);
    }
  }
}

export default ApiService;
