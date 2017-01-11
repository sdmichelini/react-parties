'use strict';
// Feature flags library


// Checks if we are running on the server or on the client
function isServer() {
  return ! (typeof window != 'undefined' && window.document);
}

function isDevelopment() {
  if(isServer()) {
    return process.env.ENVIRONMENT == 'dev';
  } else {
    var config = require('config');
    return config.default.appEnv == 'dev';
  }
}

var FEATURES = {
  'groups': isDevelopment()
}

// Returns true if the feature is enabled, false otherwise
function isFeatureEnabled(feature) {
  return FEATURES[feature];
}

module.exports = {
  isFeatureEnabled: isFeatureEnabled
}
