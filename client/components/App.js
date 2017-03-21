// src/components/App.js

import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-bootstrap';

import AuthStore from '../stores/AuthStore';

class AppComponent extends Component {

  componentWillMount() {
    this.lock = new Auth0Lock('DyOXhAUrwkjVppJkwUxj4W9J2VSYSUYZ', 'tkezm.auth0.com');
  }

  render() {
    let feedBackText;
    if(AuthStore.isUser()) {
      feedBackText = (<span> | <a href='https://docs.google.com/forms/d/e/1FAIpQLSd6ilYpmD1rn9zUFUVg0A9tjUDKjceyk6OVI8IbUXZoPN9ATQ/viewform?usp=sf_link'>Feedback</a></span>)
    }
    return (
      <div>
        <Header lock={this.lock}></Header>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.props.children}
            </Col>
          </Row>
          <Row>
            <br/>
            <div className='footer text-muted'>Designed by J in Pennsylvania{ feedBackText }</div>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default AppComponent;
