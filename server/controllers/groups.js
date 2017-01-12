'use strict';

const group_model = require('../models/group');
const utils = require('../util/response');

let getAllGroupsForUser = (req, res) => {
  if(!req.user.sub) {
    res.status(400).json(utils.generateError('No User Found.'));
  } else {
    group_model.getGroupsByUserId(req.user.sub, (err, groups) => {
      if(err) {
        res.status(500).json(utils.generateError('Interal Server Error.'));
      } else {
        res.json({groups: groups});
      }
    });
  }
}

let getGroupById = (req, res) => {
  if(!req.params.id) {
    res.status(400).json(utils.generateError('No Group ID Supplied.'));
  } else {
    group_model.getGroupById(req.params.id, (err, group) => {
      if(err == 'invalid id') {
        res.status(400).json(utils.generateError('Invalid ID Supplied'));
      } else if(err) {
        res.status(500).json(utils.generateError('Interal Server Error.'));
      } else if(!group) {
        res.status(404).json(utils.generateError('Group Not Found'));
      } else {
        res.json({group: group});
      }
    });
  }
}

let createGroup = (req, res) => {
  if(!req.body) {
    res.status(400).json(utils.generateError('No Body Supplied'));
  } else if(!req.body.people) {
    res.status(400).json(utils.generateError('No People Supplied'));
  } else if(!req.user.sub) {
    res.status(400).json(utils.generateError('No Auth Found'));
  } else {
    group_model.createGroup({user_id: req.user.sub, people: req.body.people}, (err, group) => {
      if(err) {
        res.status(500).json(utils.generateError('Interal Server Error.'));
      } else {
        res.json({group: group});
      }
    });
  }
}

let updateGroupById = (req, res) => {
  if(!req.body.group) {
    res.status(400).json(utils.generateError('No Group Supplied'));
  } else if(!req.body.group._id) {
    res.status(400).json(utils.generateError('No Group ID Supplied'));
  } else if(!req.body.people) {
    res.status(400).json(utils.generateError('No Group People Supplied'));
  } else {
    group_model.updateGroupById({user_id: req.body.group.user_id || req.user.sub, people: req.body.people}, (err, group) => {
      if(err) {
        res.status(500).json(utils.generateError('Interal Server Error.'));
      } else if(!group){
        res.status(404).json(utils.generateError('Group Not Found.'));
      } else {
        res.json({group:group});
      }
    });
  }
}

let removeGroupById = (req, res) => {
  if(!req.params.id) {
    res.status(400).json(utils.generateError('Invalid URI Param'));
  } else {
    group_model.removeGroupById(req.params.id, (err, count)=> {
      if(err) {
        res.status(500).json(utils.generateError('Interal Server Error.'));
      } else if(!count) {
        res.status(404).json(utils.generateError('Nothing Deleted.'));
      } else {
        res.json({id: req.params.id, count: count});
      }
    });
  }
}

module.exports = {
  getAllGroupsForUser: getAllGroupsForUser,
  getGroupById: getGroupById,
  createGroup: createGroup,
  updateGroupById: updateGroupById,
  removeGroupById: removeGroupById
}
