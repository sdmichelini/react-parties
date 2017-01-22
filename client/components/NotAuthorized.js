import React, { Component } from 'react';

class NotAuthroizedComponent extends Component {

  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <h2>Not authorized to view the resource.</h2>
        <p className='text-muted'>If social has just approved you, log out and log back in.</p>
      </div>
    );
  }
}

export default NotAuthroizedComponent;
