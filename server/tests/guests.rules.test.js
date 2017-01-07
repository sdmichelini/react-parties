'use strict';
const expect = require('chai').expect;

const guests_rules = require('../rules/guests');

const test_guest = {name:'Jim', status: 0, added_by: 'Bob'};
const test_guest_2 = {name:'Jim Smith', status: 0, added_by:'Ben'};



const cur_guests = [
  {name:'Jim', status: 0, added_by: 'Rick', male:true},
  {name:'Jim', status: 1, added_by: 'Bob',male:true},
  {name:'Jim', status: 1, added_by: 'Bob',male:true},
  {name:'Jim', status: 1, added_by: 'Bob',male:true},
  {name:'Jim', status: 0, added_by: 'Bob',male:true},
  {name:'Jim', status: 0, added_by: 'Bob',male:true},
  {name:'Jim', status: 0, added_by: 'Bob',male:true}
];

const cur_party = {
  type: 0
};

describe('Guest Rules Test', ()=>{
  it('should not allow for a party if there are already 3 on the list', ()=>{
    let new_guest = guests_rules.applyGuestStatus(test_guest, cur_guests, cur_party);
    expect(new_guest.status).to.equal(0);
  });
  it('should allow for a party if there are less than 3 on the list', ()=>{
    let new_guest = guests_rules.applyGuestStatus(test_guest_2, cur_guests, cur_party);
    expect(new_guest.status).to.equal(1);
  });
});
