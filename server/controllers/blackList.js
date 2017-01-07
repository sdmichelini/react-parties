'use strict';

const black_list_model = require('../models/blackList');
const utils = require('../util/response');

// API for the black list

let getBlackList = (req, res) => {
  black_list_model.getBlackList((err, people) => {
    if(err) {
      res.status(500);
      res.json(utils.generateError('Black List DB Error'));
    } else {
      res.json({people: people});
    }
  });
}

let addBlackListItem = (req, res) => {
  if(!req.body.people) {
    res.status(400);
    res.json(utils.generateError('No People Found in Request'));
  } else if(!req.body.added_by){
    res.status(400);
    res.json(utils.generateError('No Added By Found in Request'));
  } else {
    let people = req.body.people;
    for(let person of people) {
      person.added_by = req.body.added_by;
    }
    black_list_model.addToBlackList(people, (err, _people) => {
      if(err) {
        res.status(500);
        res.json(utils.generateError('Error Adding People to Black List'));
        return;
      } else {
        res.status(201);
        res.json({people: _people});
      }
    });
  }
}

let deleteBlackListItem = (req, res) => {
  if(!req.params.id) {
    res.status(400);
    res.json(utils.generateError('No Person ID Found'));
  } else {
    black_list_model.removePersonFromBlacklist(req.params.id, (err, person)=> {
      if(err) {
        res.status(500);
        res.json(utils.generateError('Could Not Delete Person. Does ID Exist?'));
      } else if(person){
        res.json({person: person});
      } else {
        res.status(404);
        res.json(utils.generateError('Person Not Found'));
      }
    });
  }
}

module.exports = {
  getBlackList: getBlackList,
  addBlackListItem: addBlackListItem,
  deleteBlackListItem: deleteBlackListItem
}
