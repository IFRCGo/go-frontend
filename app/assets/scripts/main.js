'use strict';
import 'babel-polyfill';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import store from './utils/store';
import { showAlert } from './components/system-alerts';
import { detectIE } from './utils/ie';

// Views.
import Home from './views/home';
import About from './views/about';
import Account from './views/account';
import PasswordChange from './views/password-change';
import Login from './views/login';
import Register from './views/register';
import RecoverAccount from './views/recover-account';
import UhOh from './views/uhoh';
import FieldReportForm from './views/field-report-form/';
import FieldReport from './views/field-report';
import Emergencies from './views/emergencies';
import Emergency from './views/emergency';
import AdminArea from './views/admin-area';
import Country from './views/countries';
import Deployments from './views/deployments';
import HeOps from './views/heops';

require('isomorphic-fetch');

// Route available only if the user is not logged in.
const AnonymousRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!store.getState().user.data.token;
  const render = props => isAuthenticated
    ? <Redirect to='/' />
    : <Component {...props}/>;
  return <Route {...rest} render={render} />;
};

if (process.env.NODE_ENV !== 'production') {
  AnonymousRoute.propTypes = {
    component: T.func
  };
}

// Route available only if the user is logged in.
// Redirects to login page and takes the user back afterwards.
class PrivateRoute extends React.Component {
  isAuthenticated () {
    return !!store.getState().user.data.token;
  }

  componentDidMount () {
    if (!this.isAuthenticated()) {
      showAlert('danger', <p>Please log in to view this page</p>, true, 4500);
    }
  }

  render () {
    const { component: Component, ...rest } = this.props;
    const render = (props) => this.isAuthenticated()
      ? <Component {...props}/>
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location } // eslint-disable-line
      }}/>;

    return <Route {...rest} render={render} />;
  }
}

if (process.env.NODE_ENV !== 'production') {
  PrivateRoute.propTypes = {
    component: T.func
  };
}

// Root component. Used by the router.
const Root = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/about" component={About}/>
        <PrivateRoute exact path="/account" component={Account}/>
        <PrivateRoute exact path="/account/password-change" component={PasswordChange}/>
        <AnonymousRoute exact path="/login" component={Login}/>
        <AnonymousRoute exact path="/register" component={Register}/>
        <AnonymousRoute exact path="/recover-account" component={RecoverAccount}/>
        <AnonymousRoute exact path="/recover-account/:username/:token" component={RecoverAccount}/>
        <PrivateRoute exact path="/reports/new" component={FieldReportForm}/>
        <PrivateRoute exact path="/reports/:id/edit" component={FieldReportForm}/>
        <PrivateRoute exact path="/reports/:id" component={FieldReport}/>
        <Route exact path="/emergencies" component={Emergencies}/>
        <Route exact path="/emergencies/:id" component={Emergency}/>
        <Route exact path="/regions/:id" render={props => <AdminArea {...props} type='region' />} />
        <Route exact path="/countries/:id" render={props => <Country {...props} type='country' />} />
        <PrivateRoute exact path="/deployments" component={Deployments}/>
        <PrivateRoute exact path="/heops" component={HeOps}/>
        <Route component={UhOh}/>
      </Switch>
    </Router>
  </Provider>
);

render(
  <Root store={store} />,
  document.querySelector('#app-container')
);

// Get IE or Edge browser version
const version = detectIE();
const htmlEl = document.querySelector('html');
if (version === false) {
  htmlEl.classList.add('non-ie');
} else if (version >= 12) {
  htmlEl.classList.add('ie', 'edge');
} else {
  htmlEl.classList.add('ie');
}

// Polyfill for HTML Node remove();
// https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove () {
        if (this.parentNode !== null) this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
