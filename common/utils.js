'use strict';

// Normalize the name in terms of whitespace and make them lowercase
function getNormalizedName(name) {
  return name.trim().toLowerCase();
}

module.exports = {
  getNormalizedName: getNormalizedName
}
