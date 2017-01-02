'use strict';

const MongoClient = require('mongodb').MongoClient;

const server = require('http').createServer();

let app = require('./application');

let party = require('./models/party');
let guest = require('./models/guest');

let user = require('./models/user');


let check_in = require('./controllers/checkIns');

const PORT = process.env.PORT || 3001;

let db;

MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if(err) {
    console.error('MongoDB Error: ');
    return console.error(err);
  }
  db = database;
  //Init the Databases
  party.initDb(db);
  guest.initDb(db);

  user.loadAdmins(undefined);

  check_in.initWs(server);

  server.on('request', app);
  server.listen(PORT, ()=>{
    console.log('Server Listening on Port: '+PORT);
  });
});
