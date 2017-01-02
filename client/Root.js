// Root.js

import React, { Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import Index from './components/Index';
import Party from './components/Party';
import PartyDetail from './components/PartyDetail';
import NotAuthorized from './components/NotAuthorized';
import CreateParty from './components/CreateParty';
import User from './components/Users';

import AuthUtils from './utils/AuthUtils.js';

import App from './components/App';

class Root extends Component {

  // We need to provide a list of routes
  // for our app, and in this case we are
  // doing so from a Root component
  render() {
    return (
      <Router history={this.props.history}>
        <Route path='/' component={App}>
          <IndexRoute component={Index}/>
          <Route path='/parties' component={Party} onEnter={AuthUtils.requireAuth}/>
          <Route path='/parties/:id' component={PartyDetail} onEnter={AuthUtils.requireAuth}/>
          <Route path='/notAuthorized' component={NotAuthorized}/>
          <Route path='/users' component={User} onEnter={AuthUtils.requireAdmin}/>
          <Route path='/create/party' component={CreateParty} onEnter={AuthUtils.requireAdmin}/>
        </Route>
      </Router>
    );
  }
}

export default Root;
