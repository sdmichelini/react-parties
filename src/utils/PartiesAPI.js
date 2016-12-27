import request from 'superagent/lib/client';

import AuthStore from '../stores/AuthStore';

export default {
  getParties:(url) => {
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
  getPartyById: (url) => {
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
  createParty: (url, data) => {
    return new Promise((resolve,reject) => {
      request
        .post(url)
        .type('json')
        .send(data)
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  },
  deleteParty: (url) => {
    return new Promise((resolve,reject) => {
      request
        .delete(url)
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  },
  updateParty: (url, status) => {
    return new Promise((resolve,reject) => {
      request
        .put(url)
        .type('json')
        .send({party: {status: status}})
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  }
}
