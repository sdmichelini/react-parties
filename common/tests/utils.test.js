'use strict';
const expect = require('chai').expect;

const utils = require('../utils');

//Input w/ Expected Output
const TEST_DATA = [
  ['Jim Brown','jim brown'],
  ['   rIck','rick'],
  ['Roger wIllIams    ','roger williams']
];


describe('Utils Test', ()=>{
  describe('Normalized Name', () => {
    it('trim whitespace and make string lowercase', () => {
      for(let input of TEST_DATA) {
        expect(utils.getNormalizedName(input[0])).to.equal(input[1]);
      }
    });
  });
});
