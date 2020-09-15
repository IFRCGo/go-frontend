import React from 'react';
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';

import PrivateRoute from '#components/PrivateRoute';
import AnonymousRoute from '#components/AnonymousRoute';
import BlockLoading from '#components/block-loading';


import {
  getMe as getUserAction,
  getCountriesAllAction,
  getRegionsAllAction,
  getCountries as getCountriesAction,
  getRegions as getRegionsAction,
} from '#actions';
import {
  userResponseSelector,
  allCountriesSelector,
  allRegionsSelector,
} from '#selectors';

// Views.
import Home from '#views/home';
import About from '#views/about';
import Account from '#views/account';
import PasswordChange from '#views/password-change';
import Login from '#views/login';
import Register from '#views/register';
import RecoverAccount from '#views/recover-account';
import RecoverUsername from '#views/recover-username';
import ResendValidation from '#views/resend-validation';
import UhOh from '#views/uhoh';
import FieldReportForm from '#views/field-report-form/';
import FieldReport from '#views/field-report';
import Emergencies from '#views/emergencies';
import Emergency from '#views/emergency';
import Region from '#views/region';
import Country from '#views/countries';
import Deployments from '#views/deployments';
import Table from '#views/table';
import Covid19ThreeWSankey from '#views/Covid19ThreeWSankey';
import PerForms from '#views/per-forms';
import ViewPerForms from '#views/view-per-forms';
import EditPerForms from '#views/edit-per-forms';
import Preparedness from '#views/preparedness';
import TranslationDashboard from '#views/TranslationDashboard';
import ClearInitCache from '#views/ClearInitCache';

import styles from './styles.module.scss';


function Multiplexer(props) {
  const {
    getUser,
    userResponse,
    getAllCountries,
    getAllRegions,
    allCountriesResponse,
    allRegionsResponse,
    tokenResponse,
    getCountries,
  } = props;

  const [skipUserDetails, setSkipUserDetails] = React.useState(false);

  React.useEffect(() => {
    getCountries();
  }, [getCountries]);

  React.useEffect(() => {
    if (!userResponse.fetching && !userResponse.fetched && !userResponse.cached) {
      if ((tokenResponse.fetched || tokenResponse.cached)) {
        getUser();
        console.info('user details not found in cache, requesting user');
      } else {
        setSkipUserDetails(true);
      }
    }
  }, [tokenResponse, userResponse, getUser, setSkipUserDetails]);

  React.useEffect(() => {
    if (!allCountriesResponse.fetching && !allCountriesResponse.fetched && !allCountriesResponse.cached) {
      getAllCountries();
      console.info('all countries not found in cache, requesting all country');
    }
  }, [allCountriesResponse, getAllCountries]);

  React.useEffect(() => {
    if (!allRegionsResponse.fetching && !allRegionsResponse.fetched && !allRegionsResponse.cached) {
      getAllRegions();
      console.info('all regions not found in cache, requesting all regions');
    }
  }, [allRegionsResponse, getAllRegions]);

  /*const pending = React.useMemo(() => (
    (allCountriesResponse.fetching || (!allCountriesResponse.cached && !allCountriesResponse.fetched))
    || (allRegionsResponse.fetching || (!allRegionsResponse.cached && !allRegionsResponse.fetched))
    || (!skipUserDetails && (userResponse.fetching || (!userResponse.cached && !userResponse.fetched)))
  ), [allCountriesResponse, userResponse, allRegionsResponse, skipUserDetails]);
  */

  const pending = true;

  /*
  const pending = React.useMemo(() => (
    !userResponse.fetched || !countriesResponse.fetched || !regionsResponse.fetched
  ), [userResponse, countriesResponse, regionsResponse]);
  */

  if (pending) {
    return (
      <div className={styles.initialLoading}>
        <img
          src="/assets/graphics/layout/logo-icon.svg"
          width="66"
        />
        <img
          className={styles.logo}
          src="/assets/graphics/layout/ifrc_logo_2020.svg"
          alt="IFRC GO"
          width="260"
        />
        <div className={styles.content}>
          <div className={styles.loadingGlobal}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <BreadcrumbsProvider>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/clear-init-cache' component={ClearInitCache} />
          <Route exact path='/covid19-3w-sankey' component={Covid19ThreeWSankey}/>
          <PrivateRoute exact path='/translation-dashboard' component={TranslationDashboard}/>
          <Route exact path='/about' component={About}/>
          <PrivateRoute exact path='/account' component={Account}/>
          <PrivateRoute exact path='/account/password-change' component={PasswordChange}/>
          <Route exact path='/appeals/all' render={props => <Table {...props} type='appeal' />} />
          <AnonymousRoute exact path='/login' component={Login}/>
          <AnonymousRoute exact path='/register' component={Register}/>
          <AnonymousRoute exact path='/recover-account' component={RecoverAccount}/>
          <AnonymousRoute exact path='/recover-account/:username/:token' component={RecoverAccount}/>
          <AnonymousRoute exact path='/recover-username' component={RecoverUsername}/>
          <AnonymousRoute exact path='/resend-validation' component={ResendValidation} />
          <PrivateRoute exact path='/reports/new' component={FieldReportForm}/>
          <Route exact path='/reports/all' render={props => <Table {...props} type='report' />} />
          <PrivateRoute exact path='/reports/:id/edit' component={FieldReportForm}/>
          <Route exact path='/reports/:id' component={FieldReport}/>
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
      </BreadcrumbsProvider>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  tokenResponse: state.user,
  allCountriesResponse: allCountriesSelector(state),
  allRegionsResponse: allRegionsSelector(state),
  countriesResponse: state.countries,
  regionsResponse: state.regions,
  userResponse: userResponseSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getUser: (...args) => dispatch(getUserAction(...args)),
  getCountries: (...args) => dispatch(getCountriesAction(...args)),
  getRegions: (...args) => dispatch(getRegionsAction(...args)),
  getAllCountries: (...args) => dispatch(getCountriesAllAction(...args)),
  getAllRegions: (...args) => dispatch(getRegionsAllAction(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Multiplexer);
