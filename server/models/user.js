'use strict';

const request = require('superagent');

let ADMINS = [];

function loadPage(page, cb, finalCb) {
  request.get('https://tkezm.auth0.com/api/v2/users?per_page=50&page='+String(page)+'&include_totals=true&fields=app_metadata%2Cuser_id&include_fields=true')
    .set('Authorization','Bearer '+process.env.AUTH0_TOKEN)
    .end((err, res) => {
      if(err) {
        cb(err, undefined, undefined);
      }
      //Parse out the data
      let data = JSON.parse(res.text);
      let remaining = data.total - (data.start + data.length);
      for(let user of data.users) {
        if(user.app_metadata && user.app_metadata.roles) {
          for(let role of user.app_metadata.roles) {
            if(role == 'admin' || role == 'social') {
              ADMINS.push(user.user_id);
              break;
            }
          }
        }
      }
      page = page + 1;
      cb(undefined, remaining, page, finalCb);
    });
}

let pageLoadCb = (err, remaining, page, finalCb) => {
  if(err) {
    console.error(err);
    finalCb(err);
  } else {

    if(remaining > 0) {
      loadPage(page, pageLoadCb, finalCb);
    } else {
      finalCb(undefined);
    }
  }
}

let getAdmins = () => {
  return ADMINS;
}

let loadAdmins = (cb) => {
  loadPage(0, pageLoadCb, (err) => {
    if(err) {
      ADMINS = ['auth0|5813aac8f1413bed0950e515']
    }
  });
};

module.exports = {
  loadAdmins: loadAdmins,
  getAdmins: getAdmins
}
