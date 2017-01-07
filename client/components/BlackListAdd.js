import React, { Component } from 'react';

import BlackListActions from '../actions/BlackListActions';

import AuthStore from '../stores/AuthStore';

class BlackListAddComponent extends Component {
  constructor() {
    super();
    this.state = {
      value: ''
    }
  }

  onValueChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  onSubmit() {
    BlackListActions.addToBlackList([
        {
          name:this.state.value
        }],
      AuthStore.getName()
    );
    this.setState({
      value: ''
    });
  }

  render() {
    return(
      <div className='row'>
        Add to Blacklist
        <input type='text' className='form-control' value={this.state.value} onChange={this.onValueChange.bind(this)}></input>
        <br />
        <button className='btn btn-primary' onClick={this.onSubmit.bind(this)}>Add to Blacklist</button>
      </div>
    );
  }
}

export default BlackListAddComponent;
