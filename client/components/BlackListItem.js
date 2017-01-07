import React, { Component } from 'react';

import BlackListActions from '../actions/BlackListActions';

class BlackListItemComponent extends Component {

  onDelete() {
    let { guest } = this.props;
    BlackListActions.deleteFromBlackList(guest._id);
  }

  render() {
    let { guest } = this.props;
    return (
      <li className='guest-list-item male'><span className='guest-name'>{ guest.name }</span> - { guest.added_by || 'unknown' }
        <div className='pull-right'>
          <button className='btn btn-danger' onClick={ this.onDelete.bind(this) }>
            <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
          </button>
        </div>
      </li>
    );
  }
}

export default BlackListItemComponent;
