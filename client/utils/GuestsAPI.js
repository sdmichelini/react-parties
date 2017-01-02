import request from 'superagent/lib/client';

import AuthStore from '../stores/AuthStore';

export default {
  getGuestsById: (url) => {
    return new Promise((resolve,reject) => {
      request
        .get(url)
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  },
  addGuestsToParty: (url, req) => {
    return new Promise((resolve,reject) => {
      request
        .post(url)
        .type('json')
        .send(req)
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  },
  setGuestStatus: (url, req) => {
    return new Promise((resolve,reject) => {
      request
        .put(url)
        .type('json')
        .send(req)
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  },
  removeGuestFromParty: (url, req) => {
    return new Promise((resolve,reject) => {
      request
        .delete(url)
        .type('json')
        .send(req)
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  }
}
