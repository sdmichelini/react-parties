import request from 'superagent/lib/client';

import AuthStore from '../stores/AuthStore';

export default {
  getBlackList:(url) => {
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
  addToBlackList:(people, added_by,url) => {
    return new Promise((resolve,reject) => {
      request
        .post(url)
        .type('json')
        .send({people: people, added_by:added_by})
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(JSON.parse(response.text));
          resolve(JSON.parse(response.text));
        });
    });
  },
  deleteFromBlackList:(url) => {
    return new Promise((resolve,reject) => {
      request
        .delete(url)
        .type('json')
        .set('Authorization','Bearer '+AuthStore.getJwt())
        .end((err,response) => {
          if(err) reject(err);
          resolve(JSON.parse(response.text));
        });
    });
  }
}
