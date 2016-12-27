'use strict';

const WebSocketServer = require('ws').Server;

let party_model = require('../models/party');

let isPartyOpen = false;

let open_party;

let wss;

/*
  Controller for Live Check In.

  Responsible for Opening and Closing a Party
*/



let initWs = (server) => {
  wss = new WebSocketServer({server: server});
  wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
      //console.log('sending data to:');
      //console.log(client);
      client.send(JSON.stringify(data));
    });
  };

  party_model.forcePartyLoad((err, parties) => {
    if(err) {
      console.error('Error with parties');
    } else {
      //console.log(parties);
      if(parties) {
        for(let i = 0; i < parties.length; i++) {
          if(parties[i].status && (parties[i].status == 1)) {
            openParty(parties[i]);
            break;
          }
        }
      }
    }
  });
};

let openParty = (party) => {
  if(isPartyOpen) {
    return false;
  } else {
    isPartyOpen = true;
    open_party = party;
    return true;
  }
};

let closeParty = (id) => {
  if(isPartyOpen) {
    isPartyOpen = false;
    open_party = undefined;
    return true;
  } else {
    return false;
  }
};

// Send an event to the open party
//e is the event object
//Generally e is a guest check in
let sendEvent = (e) => {
  if(isPartyOpen && (e.party_id == open_party._id)) {
    if(wss) {
      wss.clients.forEach((client) => {
        //console.log('sending data to:');
        //console.log(client);
        client.send(JSON.stringify(e));
      });
    }
  }
};

module.exports = {
  initWs: initWs,
  openParty: openParty,
  closeParty: closeParty,
  sendEvent: sendEvent
}
