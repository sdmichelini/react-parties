'use strict';

const utils = require('../util/response');

const common_utils = require('../../common/utils');

const guest_model = require('../models/guest');
const party_model = require('../models/party');
const black_list_model = require('../models/blackList');

const guest_rules = require('../rules/guests');

const check_in = require('./checkIns');

const constants = require('../constants/constants');

const user_model = require('../models/user');

const ALLOWED_CLIENTS = [
  'auth0|5813aac8f1413bed0950e515'
];

function isClientAdmin(sub) {
  let clients = user_model.getAdmins();
  if(clients.length == 0) {
    clients = ALLOWED_CLIENTS;
  }

  for(let client of clients) {
    if(sub == client) {
      return true;
    }
  }
  return false;

}

//Get Guests for Party
let getGuestForParty = (req, res)=>{
  if(!req.query.party_id) {
    res.status(400).json(utils.generateError('No Party ID Specified'));
  } else {
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
  }
};

let addGuestToParty = (req, res)=> {
  //console.log('adding guest');
  if(!req.body.party_id) {
    res.status(400);
    res.json(utils.generateError('No Party ID found in Request'));
  } else if(!req.body.guests) {
    res.status(400);
    res.json(utils.generateError('No Guests Found in Request'));
  } else if(!req.body.added_by){
    res.status(400);
    res.json(utils.generateError('No Added By Found in Request'));
  } else {
    let new_guests = req.body.guests;
    let added_guests = [];
    let party;
    let blackList;
    // Use promises to simplify callbacks
    party_model
      .getPartyByIdPromise(req.body.party_id)
      .then((_party)=>{
        party = _party;
        return new Promise((resolve, reject) => {
          black_list_model.getBlackList((err, people)=>{
            if(err) {
              reject(err);
            } else {
              resolve(people);
            }
          });
        });
      })
      .then((_blacklist)=>{
        blackList = _blacklist;
        return guest_model.getGuestsForPartyPromise(req.body.party_id);
      })
      .then((_guests)=>{
        for(let guest of new_guests) {
          let guest_allowed = true;
          for(let bl_guest of blackList) {
            if(common_utils.getNormalizedName(bl_guest.name) == common_utils.getNormalizedName(guest.name)) {
              guest_allowed = false;
              break;
            }
          }
          if(!guest_allowed) {
            continue;
          }
          guest.party_id = req.body.party_id;
          guest.added_by = req.body.added_by;
          if(isClientAdmin(req.user.sub)) {
            guest.status = constants.STATUS_ON_LIST;
          } else {
            guest = guest_rules.applyGuestStatus(guest, _guests, party);
          }
          added_guests.push(guest);
        }
        if(added_guests.length > 0) {
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
        } else {
            res.status(400).json(utils.generateError('No Guests Eligible For Party'));
        }
      })
      .catch((err)=> {
        // Handle error gracefully. ie all guests must be approved by social
        for(let guest of new_guests) {
          guest.party_id = req.body.party_id;
          guest.added_by = req.body.added_by;
          if(isClientAdmin(req.user.sub)) {
            guest.status = constants.STATUS_ON_LIST;
          } else {
            guest.status = constants.STATUS_AWAITING_APPROVAL;
          }
          added_guests.push(guest);
        }
        console.error(err);
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
