#ReactParties

Guest management system written using ReactJS on the front-end along with an ExpressJS API on the back-end.

## Getting Started ##

1. Clone the repository w/ `git clone`
2. Install npm dependencies by running `npm install` in the root folder
3. Make sure .env file is setup with client, secret, and mongodb uri
4. Install MongoDB, code will not work without it
5. Start server w/ `npm start` and start client hot module replacement w/ `npm run serve`
6. When code is ready to be committed make sure to run `npm run dist` in order to build client app for production

## Organization ##

- Client is located in `client`
- Server is located in `server`
- Common modules are located in `common`
