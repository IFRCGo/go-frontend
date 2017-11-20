'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { polyfill } from 'es6-promise';

import store from './utils/store';

// Views.
import Home from './views/home';
import About from './views/about';
import Login from './views/login';
import Register from './views/register';
import RecoverAccount from './views/recover-account';
import UhOh from './views/uhoh';

polyfill();

// Root component. Used by the router.
class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/about" component={About}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/recover-account" component={RecoverAccount}/>
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
