import React, { Component } from 'react';

import { Link } from 'react-router';

class DashboardComponent extends Component {

  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <h2>Dashboard</h2>
        <p className='text-muted'>{'Welcome to the Dashboard. From here you can manage users of the system as well as the blacklist.'}</p>
        <ul>
          <li><Link to={'/blacklist'}>Black List</Link></li>
          <li><Link to={'/users'}>Manage Users</Link></li>
          <li><Link to={'/create/party'}>Create a Party</Link></li>
        </ul>
      </div>
    );
  }
}

export default DashboardComponent;
