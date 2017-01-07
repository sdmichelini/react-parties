import React, { Component } from 'react';

class BlackListComponent extends Component {

  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <h1>Black List</h1>
        <p className='text-muted'>{'This is the blacklist.'}</p>
      </div>
    );
  }
}

export default BlackListComponent;
