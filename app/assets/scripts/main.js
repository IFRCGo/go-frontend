'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { polyfill } from 'es6-promise';

import store from './utils/store';

// Views.
import Home from './views/home';
import About from './views/about';
import Account from './views/account';
import Login from './views/login';
import Register from './views/register';
import RecoverAccount from './views/recover-account';
import UhOh from './views/uhoh';
import FieldReportForm from './views/field-report-form/';
import FieldReport from './views/field-report';
import Emergencies from './views/emergencies';
import Emergency from './views/emergency';
import AdminArea from './views/admin-area';
import Deployments from './views/deployments';

polyfill();

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
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!store.getState().user.data.token;
  const render = props => isAuthenticated
    ? <Component {...props}/>
    : <Redirect to={{
      pathname: '/login',
      state: { from: props.location } // eslint-disable-line
    }} />;
  return <Route {...rest} render={render} />;
};

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
        <AnonymousRoute exact path="/login" component={Login}/>
        <AnonymousRoute exact path="/register" component={Register}/>
        <AnonymousRoute exact path="/recover-account" component={RecoverAccount}/>
        <Route exact path="/reports/new" component={FieldReportForm}/>
        <Route exact path="/reports/:id/edit" component={FieldReportForm}/>
        <Route exact path="/reports/:id" component={FieldReport}/>
        <Route exact path="/emergencies" component={Emergencies}/>
        <Route exact path="/emergencies/:id" component={Emergency}/>
        <Route exact path="/regions/:id" render={props => <AdminArea {...props} type='region' />} />
        <Route exact path="/deployments" component={Deployments}/>
        <Route component={UhOh}/>
      </Switch>
    </Router>
  </Provider>
);

render(
  <Root store={store} />,
  document.querySelector('#app-container')
);
