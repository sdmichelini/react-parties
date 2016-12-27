'use strict';

const utils = require('../util/response');

const guest_model = require('../models/guest');

const check_in = require('./checkIns');

const STATUS_AWAITING_APPROVAL = 0;
const STATUS_ON_LIST = 1;
const STATUS_CHECKED_IN = 2;

let GUESTS = [
  {party_id: '1', name: 'Test Guest', added_by: 'Test Brother 1', male: false, status: STATUS_ON_LIST, checked_in: 0, id: '0'},
  {party_id: '1', name: 'Test Guest', added_by: 'Test Brother 1', male: false, status: STATUS_ON_LIST, checked_in: 0, id: '1'},
  {party_id: '1', name: 'Test Guest', added_by: 'Test Brother 1', male: false, status: STATUS_ON_LIST, checked_in: 0, id: '2'},
  {party_id: '1', name: 'Test Guest', added_by: 'Test Brother 1', male: false, status: STATUS_ON_LIST, checked_in: 0, id: '3'},
  {party_id: '1', name: 'Test Guest', added_by: 'Test Brother 1', male: true, status: STATUS_ON_LIST, checked_in: 0, id: '4'},
  {party_id: '1', name: 'Matt Freed', added_by: 'Bob', male: true, status: STATUS_ON_LIST, checked_in: 0, id: '5'},
  {party_id: '1', name: 'Peter DiPersio', added_by: 'Jim', male: true, status: STATUS_ON_LIST, checked_in: 0, id: '6'},
  {party_id: '2', name: 'Test Guest 2', added_by: 'Test Brother 2', male: true, status: STATUS_ON_LIST, checked_in: 0, id: '1'}
];

let next_id = 7;

const ALLOWED_CLIENTS = [
  'auth0|5813aac8f1413bed0950e515'
];

function isClientAdmin(sub) {
  for(let client of ALLOWED_CLIENTS) {
    if(sub == client) {
      return true;
    }
  }
  return false;
}

function runApprovalTesting(guest) {
  let sum = 0;
  let index = -1;
  for(let i = 0; i < GUESTS.length; i++) {
    if(GUESTS[i].male && (GUESTS[i].status == STATUS_ON_LIST)) {
      sum++;
    } else if(GUESTS[i].id == guest.id) {
      index = i;
    }
  }
  if((sum < 3) && (index != -1)) {
    GUESTS[index].status = STATUS_ON_LIST;
  }
}

//Get Guests for Party
let getGuestForParty = (req, res)=>{
  guest_model.getGuestsForParty(req.query.party_id, (err, guests) => {
    if(err) {
      res.status(500);
      res.json(utils.generateError('Guests DB Error'));
    }
    else if(!guests) {
      res.status(404);
      res.json(utils.generateError('No Guests for Party ID Found.'));
    } else {
      res.json({guests: guests});
    }
  });
};

let addGuestToParty = (req, res)=> {
  if(!req.body.party_id) {
    res.status(400);
    res.json(utils.generateError('No Party ID found in Request'));
  } else if(!req.body.guests) {
    res.status(400);
    res.json(utils.generateError('No Guests Found in Request'));
  } else if(!req.body.added_by){
    res.status(400);
    res.json(utils.generateError('No Added By Found in Request'));
  }else {
    let new_guests = req.body.guests;
    let added_guests = [];
    for (let guest of new_guests) {
      if(guest.name && (guest.male != undefined)) {
        guest.checked_in = 0;
        if(isClientAdmin(req.user.sub) || !guest.male) {
          guest.status = STATUS_ON_LIST;
        } else {
          guest.status = STATUS_AWAITING_APPROVAL;
        }
        guest.party_id = req.body.party_id;
        guest.added_by = req.body.added_by;
        added_guests.push(guest);
      }
    }
    guest_model.addGuestsToParty(added_guests, (err, guests)=>{
      if(err) {
        res.status(500);
        res.json(utils.generateError('Error Adding Guests'));
        return;
      } else {
        res.status(201);
        res.json({guests: guests});
      }
    });

  }
}

let updateGuestForParty = (req, res) => {
  if(!req.body.party_id) {
    res.status(400);
    res.json(utils.generateError('No Party ID Found.'));
  } else if(!req.body.id) {
    res.status(400);
    res.json(utils.generateError('No Guest ID Found.'));
  } else if(!req.body.status) {
    res.status(400);
    res.json(utils.generateError('No Status Found.'));
  } else {
    guest_model.updateGuestForParty(req.body.id, req.body.status, (err, guest)=>{
      if(err) {
        res.status(500);
        res.json(utils.generateError('Error In Updating Guest'));
      } else {
        check_in.sendEvent(guest);
        res.json({guest: guest});
      }
    });
  }
}

let removeGuestFromParty = (req, res) => {
  if(!req.body.party_id) {
    res.status(400);
    res.json(utils.generateError('No Party ID Found.'));
  } else if(!req.params.id) {
    res.status(400);
    res.json(utils.generateError('No Guest ID Found.'));
  } else {
    guest_model.removeGuestFromParty(req.params.id, (err, guest)=>{
      if(err) {
        res.status(500);
        res.json(utils.generateError('Could Not Delete Guest. Does ID Exist?'));
      } else if(guest){
        res.json({guest: guest});
      } else {
        res.status(404);
        res.json(utils.generateError('Guest Not Found'));
      }
    });
  }
}

module.exports ={
  getGuestForParty: getGuestForParty,
  addGuestToParty: addGuestToParty,
  updateGuestForParty: updateGuestForParty,
  removeGuestFromParty: removeGuestFromParty
}
