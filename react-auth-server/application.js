'use strict';
//Third Party Modules
const express = require('express');
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

const utils = require('./util/response');

require('dotenv').config();

const authCheck = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

//Controllers
const groups_controller = require('./controllers/groups');
const guests_controller = require('./controllers/guests');
const parties_controller = require('./controllers/parties');

//Start application vars
let app = express();

app.use(cors());

const ALLOWED_CLIENTS = [
  'auth0|5813aac8f1413bed0950e515'
];

function checkAdmin(req,res,next) {
  let auth = false;
  for(let client of ALLOWED_CLIENTS) {
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
app.post('/api/parties',authCheck, bodyParser.json(), parties_controller.createParty);
app.get('/api/parties/:id', authCheck,parties_controller.getPartyById);
app.put('/api/parties/:id', authCheck, bodyParser.json(),parties_controller.updateParty);
app.delete('/api/parties/:id', authCheck,parties_controller.deleteParty);

//Get list of guests for a party
app.get('/api/guests', authCheck, guests_controller.getGuestForParty);
app.post('/api/guests',authCheck, bodyParser.json(),guests_controller.addGuestToParty);
app.put('/api/guests',authCheck, bodyParser.json(),guests_controller.updateGuestForParty);
app.delete('/api/guests/:id',authCheck, bodyParser.json(),guests_controller.removeGuestFromParty);

app.get('/api/auth', authCheck,(req, res)=>{
  res.json({message:'Token', token: process.env.AUTH0_TOKEN});
});


//Export the application
module.exports = app;
