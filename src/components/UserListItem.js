import React, { Component } from 'react';
import ListItem from '../styles/List.css';
import  UserActions  from '../actions/UserActions';

function getButton(status, handler) {
  let cls = (status) ? 'btn btn-danger' : 'btn btn-success';
  let string = (status) ? 'Delete' : 'Add';
  return (
    <button className={cls} onClick={handler}>{string}</button>
  )
}

class UserListItem extends Component {
  constructor() {
    super()
    this.state = {
      editing: false,
      name: ''
    };
  }

  changeName() {

    const { user } = this.props;
    UserActions.editUserName(user.user_id, this.state.name);
    this.setState({
      editing: false,
      name: ''
    });
  }

  onInputChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing
    });
  }

  toggle() {
    let is_user = !this.props.is;
    const { user } = this.props;
    UserActions.toggleUserStatus(user.user_id, is_user);
  }

  render() {
    const { user } = this.props;
    let name;
    if(user.user_metadata && user.user_metadata.name) {
      name = user.user_metadata.name;
    } else {
      name = user.nickname;
    }
    let is_user = this.props.is;
    let button = getButton(is_user, this.toggle.bind(this));

    return (
      <div className={ListItem.item+' list-group-item'}>
        {name}
        <div className='pull-right'>
          {button}
        </div>
      </div>
    );
  }
}

export default UserListItem;
