'use strict';
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
import RecoverUsername from './views/recover-username';
import UhOh from './views/uhoh';
import FieldReportForm from './views/field-report-form/';
import FieldReport from './views/field-report';
import Emergencies from './views/emergencies';
import Emergency from './views/emergency';
import Region from './views/region';
import Country from './views/countries';
import Deployments from './views/deployments';
import Table from './views/table';

import PerForms from './views/per-forms';
import ViewPerForms from './views/view-per-forms';
import EditPerForms from './views/edit-per-forms';
import Preparedness from './views/preparedness';

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
    const { component: Component, render: renderComponent, ...rest } = this.props;
    let render;
    if (this.isAuthenticated()) {
      render = (props) => renderComponent ? renderComponent(props) : <Component {...props}/>;
    } else {
      render = (props) => <Redirect to={{
        pathname: '/login',
        state: { from: props.location } // eslint-disable-line
      }}/>;
    }
    return <Route {...rest} render={render} />;
  }
}

if (process.env.NODE_ENV !== 'production') {
  PrivateRoute.propTypes = {
    component: T.func,
    render: T.func
  };
}

// Root component. Used by the router.
const Root = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/about' component={About}/>
        <PrivateRoute exact path='/account' component={Account}/>
        <PrivateRoute exact path='/account/password-change' component={PasswordChange}/>
        <Route exact path='/appeals/all' render={props => <Table {...props} type='appeal' />} />
        <AnonymousRoute exact path='/login' component={Login}/>
        <AnonymousRoute exact path='/register' component={Register}/>
        <AnonymousRoute exact path='/recover-account' component={RecoverAccount}/>
        <AnonymousRoute exact path='/recover-account/:username/:token' component={RecoverAccount}/>
        <AnonymousRoute exact path='/recover-username' component={RecoverUsername}/>
        <PrivateRoute exact path='/reports/new' component={FieldReportForm}/>
        <PrivateRoute exact path='/reports/all' render={props => <Table {...props} type='report' />} />
        <PrivateRoute exact path='/reports/:id/edit' component={FieldReportForm}/>
        <PrivateRoute exact path='/reports/:id' component={FieldReport}/>
        <Route exact path='/emergencies' component={Emergencies}/>
        <Route exact path='/emergencies/all' render={props => <Table {...props} type='emergency' />} />
        <Route exact path='/emergencies/:id' component={Emergency}/>
        <Route exact path='/regions/:id' render={props => <Region {...props} type='region' />} />
        <Route exact path='/countries/:id' render={props => <Country {...props} type='country' />} />
        <Route exact path='/alerts/all' render={props => <Table {...props} type='alert' />} />
        <PrivateRoute exact path='/deployments' component={Deployments}/>
        <PrivateRoute exact path='/deployments/personnel/all' render={props => <Table {...props} type='personnel' />} />
        <PrivateRoute exact path='/deployments/erus/all' render={props => <Table {...props} type='eru' />} />
        <Route path='/per-forms/:formName/:id' component={PerForms} />
        <Route path='/preparedness' component={Preparedness} />
        <Route path='/view-per-forms/:formName/:id' component={ViewPerForms} />
        <Route path='/edit-per-forms/:formCode/:user/:ns' component={EditPerForms} />
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

if (process.env.NODE_ENV === 'staging') {
  document.body.style.backgroundColor = 'grey';
  document.getElementById('app-container').style.color = 'purple';
}
