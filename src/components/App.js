// src/components/App.js

import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-bootstrap';

class AppComponent extends Component {

  componentWillMount() {
    this.lock = new Auth0Lock('DyOXhAUrwkjVppJkwUxj4W9J2VSYSUYZ', 'tkezm.auth0.com');
  }

  render() {
    return (
      <div>
        <Header lock={this.lock}></Header>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.props.children}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default AppComponent;
