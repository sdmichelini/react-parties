import config from 'config';

export const URL = (config.appEnv == 'dev')?'http://localhost:3001':'https://js-list.herokuapp.com';
export const WS_URL = (config.appEnv == 'dev')?'ws://localhost:3001':'wss://js-list.herokuapp.com;'
