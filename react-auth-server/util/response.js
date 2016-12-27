'use strict';

let generateError = (error) => {
  return {
    errors: {
      msg: error
    }
  };
}

module.exports = {
  generateError: generateError
}
