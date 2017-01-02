'use strict';
// Validators for app

const name_regex = /^[a-zA-Z\s]*$/;

function nameValidator(name) {
  return name_regex.test(name);
}

module.exports = {
  nameValidator: nameValidator
}
