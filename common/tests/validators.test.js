'use strict';
const expect = require('chai').expect;

const validators = require('../validators');

const BAD_INPUT = [
  'bad name *',
  '777bad name',
  '$hower'
];

const GOOD_INPUT = [
  'Good Name',
  'Good',
  'rick'
];


describe('Validator Test', ()=>{
  describe('Name Validator', () => {
    it('should reject bad input', () => {
      for(let input of BAD_INPUT) {
        expect(validators.nameValidator(input)).to.equal(false);
      }
    });
    it('should accept good input', () => {
      for(let input of GOOD_INPUT) {
        expect(validators.nameValidator(input)).to.equal(true);
      }
    });
  });
});
