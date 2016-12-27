'use strict';

const utils = require('../util/response');

const party_model = require('../models/party');

const check_in = require('./checkIns');

//Get Parties
let getParties = (req, res)=>{
  party_model.getParties((err, parties) => {
    if(err) {
      res.status(500);
      res.json(utils.generateError('Error Retreiving Parties.'));
      return;
    } else {
      res.json({parties: parties});
    }
  });

};

let getPartyById = (req, res)=>{
  party_model.getPartyById(req.params.id, (err, party) => {
    if(err) {
      res.status(500);
      res.json(utils.generateError('Error Retreiving Party'));
    } else if(!party) {
      res.status(404);
      res.json(utils.generateError('Party Not Found.'));
    } else {
      res.json({
        party: party
      });
    }
  });
};

let createParty = (req, res) => {
  if(!req.body.party) {
    res.status(400);
    res.json(utils.generateError('No Party Found in Request'));
  } else if(!req.body.party.name) {
    res.status(400);
    res.json(utils.generateError('No Name Found in Request'));
  } else if(!req.body.party.when) {
    res.status(400);
    res.json(utils.generateError('No When Found in Request'));
  } else if(req.body.party.type == undefined) {
    res.status(400);
    res.json(utils.generateError('No Type Found in Request'));
  } else {
    let data = {};
    data.name = req.body.party.name;
    data.type = req.body.party.type;
    data.when = new Date(req.body.party.when);
    party_model.createParty(data, (err, party)=>{
      if(err) {
        res.status(500);
        res.json(utils.generateError('Internal DB Error'));
      } else {
        res.json({party:party});
      }
    });
  }
}

let deleteParty = (req, res) => {
  if(!req.params.id) {
    res.status(400);
    res.json(utils.generateError('No ID Found in Request'));
  } else {
    party_model.deleteParty(req.params.id, (err, party) => {
      if(err == 'id not valid') {
        res.status(400);
        res.json(utils.generateError('ID Not Valid'));
      } else if(err){
        res.status(500);
        res.json(utils.generateError('Internal Server Error'));
      } else if(!party){
        res.status(404);
        res.json(utils.generateError('Party Not Found'));
      } else {
        res.json({party: party});
      }
    });
  }
}

let updateParty = (req, res) => {
  if(!req.params.id) {
    res.status(400);
    res.json(utils.generateError('No ID Found in Request'));
  } else if(!req.body.party) {
    res.status(400);
    res.json(utils.generateError('No Party Found in Request'));
  } else if(!req.body.party.status) {
    res.status(400);
    res.json(utils.generateError('No Party Status Found in Request'));
  } else {
    let status = req.body.party.status;
    if((status >= 0) && (status <= 2)) {
      party_model.updateParty(req.params.id, status, (err, result)=> {
        if(err) {
          res.status(500);
          res.json(utils.generateError('Internal Server Error'));
        } else {
          //Open or Close the Party
          switch(result.status) {
            case 0:
            break;
            case 1: //Open
            {
              check_in.openParty(result);
              break;
            }
            case 2:
            {
              check_in.closeParty(result.id);
            }
            default:
            break;
          }
          res.json({party:result});
        }
      });
    } else {
      res.status(400);
      res.json(utils.generateError('Invalid Status'));
    }
  }
}

module.exports ={
  getParties: getParties,
  getPartyById: getPartyById,
  createParty: createParty,
  deleteParty: deleteParty,
  updateParty: updateParty
}
