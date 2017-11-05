'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import store from './utils/store';

// Views.
import Home from './views/home';
import Login from './views/login';
import UhOh from './views/uhoh';

// Root component. Used by the router.
class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <Route component={UhOh}/>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: T.object.isRequired
};

render(
  <Root store={store} />,
  document.querySelector('#app-container')
);
