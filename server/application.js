'use strict';
//Third Party Modules
const express = require('express');
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

const utils = require('./util/response');

const path = require('path');

require('dotenv').config();

const authCheck = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

const features = require('../common/features');

//Controllers
const groups_controller = require('./controllers/groups');
const guests_controller = require('./controllers/guests');
const parties_controller = require('./controllers/parties');
const black_list_controller = require('./controllers/blackList');

const user_model = require('./models/user');

//Start application vars
let app = express();

app.use(cors());

const ALLOWED_CLIENTS = [
  'auth0|5813aac8f1413bed0950e515'
];

function checkAdmin(req,res,next) {
  let auth = false;
  let clients = user_model.getAdmins();
  for(let client of clients) {
    if(client === req.user.sub) {
      auth = true;
      next();
      break;
    }
  }
  if(!auth) {
    res.status(403);
    res.json(utils.generateError('Client not allowed to access resource.'));
  }
}

//Basic Health Route
app.get('/api/health', (req,res)=>{
  res.json({message:'OK.'});
});

app.get('/api/parties', authCheck,parties_controller.getParties);
app.post('/api/parties',authCheck, checkAdmin,bodyParser.json(), parties_controller.createParty);
app.get('/api/parties/:id', authCheck,parties_controller.getPartyById);
app.put('/api/parties/:id', authCheck, checkAdmin,bodyParser.json(),parties_controller.updateParty);
app.delete('/api/parties/:id', authCheck, checkAdmin,parties_controller.deleteParty);

//Get list of guests for a party
app.get('/api/guests', authCheck, guests_controller.getGuestForParty);
app.post('/api/guests',authCheck, bodyParser.json(),guests_controller.addGuestToParty);
app.put('/api/guests',authCheck, bodyParser.json(),guests_controller.updateGuestForParty);
app.delete('/api/guests/:id',authCheck, bodyParser.json(),guests_controller.removeGuestFromParty);

app.get('/api/blacklist', authCheck, black_list_controller.getBlackList);
app.post('/api/blacklist', authCheck, checkAdmin, bodyParser.json(), black_list_controller.addBlackListItem);
app.delete('/api/blacklist/:id', authCheck, checkAdmin, black_list_controller.deleteBlackListItem);

if(features.isFeatureEnabled('groups')) {
  app.get('/api/groups', authCheck, groups_controller.getAllGroupsForUser);
  app.get('/api/groups/:id', authCheck, groups_controller.getGroupById);
  app.post('/api/groups', authCheck, groups_controller.createGroup);
  app.put('/api/groups', authCheck, groups_controller.updateGroupById);
  app.delete('/api/groups', authCheck, groups_controller.removeGroupById);
}

app.get('/api/auth', authCheck,checkAdmin,(req, res)=>{
  res.json({message:'Token', token: process.env.AUTH0_TOKEN});
});

app.get('/api/*', (req,res) => {
  res.status(404);
  res.json(utils.generateError('API Path Not Found'));
});

app.use((err, req, res, next) => {
  if(err.name == 'UnauthorizedError') {
    res.status(401).json(utils.generateError('Invalid or Missing Token'));
  }
});

app.use('/assets', express.static(path.join(__dirname, '../dist/assets')));
app.use('*',express.static(path.join(__dirname,'../dist')));

//Export the application
module.exports = app;
