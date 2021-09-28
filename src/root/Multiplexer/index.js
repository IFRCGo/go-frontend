import React from 'react';
import { connect } from 'react-redux';
import { unique } from '@togglecorp/fujs';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';

import PrivateRoute from '#components/PrivateRoute';
import AnonymousRoute from '#components/AnonymousRoute';
import AlertContext from '#components/AlertContext';

import {
  getMe as getUserAction,
  getCountriesAllAction,
  getRegionsAllAction,
  getLanguageAction,
  getDisasterTypes,
} from '#actions';
import {
  userResponseSelector,
  allCountriesSelector,
  allRegionsSelector,
  languageResponseSelector,
  currentLanguageSelector,
  disasterTypesSelectSelector,
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
import FourHundredFour from '#views/FourHundredFour';
import FieldReport from '#views/field-report';
import Emergencies from '#views/emergencies';
import Emergency from '#views/emergency';
import Region from '#views/region';
import Country from '#views/Country';
import Deployments from '#views/deployments';
import Table from '#views/table';
import Covid19ThreeWSankey from '#views/Covid19ThreeWSankey';
import PerForm from '#components/per-forms/per-form';
import PerAssessment from '#views/per-assessment';
import Preparedness from '#views/preparedness';
import TranslationDashboard from '#views/TranslationDashboard';
import ClearInitCache from '#views/ClearInitCache';
import NewThreeW from '#views/NewThreeW';
import FieldReportForm from '#views/FieldReportForm';
import GlobalThreeW from '#views/GlobalThreeW';
import AllThreeW from '#views/AllThreeW';
import ThreeW from '#views/ThreeW';
import ThreeWEdit from '#views/ThreeWEdit';

import styles from './styles.module.scss';
import DrefApplicationForm from '#views/DrefApplicationForm';
import DrefPdfExport from '#components/DrefPdfExport';


function Multiplexer(props) {
  const {
    getUser,
    userResponse,
    getAllCountries,
    getAllRegions,
    allCountriesResponse,
    allRegionsResponse,
    tokenResponse,
    getLanguage,
    languageResponse,
    currentLanguage,
    disasterTypes,
    getDisasterTypes,
  } = props;

  const languageRef = React.useRef(currentLanguage);
  const [skipUserDetails, setSkipUserDetails] = React.useState(false);

  const [alerts, setAlerts] = React.useState([]);

  const addAlert = React.useCallback((alert) => {
    setAlerts((prevAlerts) => unique(
      [...prevAlerts, alert],
      a => a.name
    ) ?? prevAlerts);
  }, [setAlerts]);

  const removeAlert = React.useCallback((name) => {
    setAlerts((prevAlerts) => {
      const i = prevAlerts.findIndex(a => a.name === name);
      if (i === -1) {
        return prevAlerts;
      }

      const newAlerts = [...prevAlerts];
      newAlerts.splice(i, 1);

      return newAlerts;
    });
  }, [setAlerts]);

  const updateAlert = React.useCallback((name, children) => {
    setAlerts((prevAlerts) => {
      const i = prevAlerts.findIndex(a => a.name === name);
      if (i === -1) {
        return prevAlerts;
      }

      const updatedAlert = {
        ...prevAlerts[i],
        children,
      };

      const newAlerts = [...prevAlerts];
      newAlerts.splice(i, 1, updatedAlert);

      return newAlerts;
    });
  }, [setAlerts]);

  const alertContextValue = React.useMemo(() => ({
    alerts,
    addAlert,
    updateAlert,
    removeAlert,
  }), [alerts, addAlert, updateAlert, removeAlert]);


  React.useEffect(() => {
    getLanguage(languageRef.current);

    if (languageRef.current === 'ar') {
      document.body.style.direction = 'rtl';
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.style.direction = 'ltr';
      document.body.setAttribute('dir', 'ltr');
    }
  }, [getLanguage]);

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

  React.useEffect(() => {
    if (!disasterTypes.fetching && !disasterTypes.fetched && !disasterTypes.cached) {
      getDisasterTypes();
      console.info('all disasterTypes not found in cache, requesting all disasterTypes');
    }
  });

  const pending = React.useMemo(() => (
    (languageResponse.fetching || !languageResponse.fetched)
    || (allCountriesResponse.fetching || (!allCountriesResponse.cached && !allCountriesResponse.fetched))
    || (allRegionsResponse.fetching || (!allRegionsResponse.cached && !allRegionsResponse.fetched))
    || (!skipUserDetails && (userResponse.fetching || (!userResponse.cached && !userResponse.fetched)))
    || (!disasterTypes || (!disasterTypes.cached && !disasterTypes.fetched))
  ), [allCountriesResponse, userResponse, allRegionsResponse, skipUserDetails, languageResponse, disasterTypes]);

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
    <AlertContext.Provider value={alertContextValue}>
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
            <PrivateRoute key="new-field-report-form" exact path='/reports/new' component={FieldReportForm}/>
            <Route exact path='/reports/all' render={props => <Table {...props} type='report' />} />
            <PrivateRoute exact path='/reports/:reportId/edit' component={FieldReportForm}/>
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
            <Route exact path='/per-form/:form_id' component={PerForm} />
            <Route exact path='/per-form/:form_id/edit' render={props => <PerForm {...props} isEdit={true} />} />
            <Route path='/per-assessment/create' render={props => <PerAssessment {...props} isCreate={true} />} />
            <Route exact path='/per-assessment/:id' component={PerAssessment} />
            <Route exact path='/per-assessment/:id/edit' render={props => <PerAssessment {...props} isEdit={true} />} />
            <Route path='/preparedness' component={Preparedness} />
            <Route key="new-three-w" exact path='/three-w/new/' component={NewThreeW} />
            <PrivateRoute key="new-dref-application-form" exact path='/dref-application/new/' component={DrefApplicationForm} />
            <PrivateRoute exact path='/dref-application/:drefId/edit/' component={DrefApplicationForm} />
            <PrivateRoute exact path='/dref-application/:drefId/export/' component={DrefPdfExport} />
            <Route exact path='/three-w/all/' component={AllThreeW} />
            <Route exact path='/three-w/:projectId/' component={ThreeW} />
            <PrivateRoute exact path='/three-w/:projectId/edit/' component={ThreeWEdit} />
            <Route exact path='/three-w/' component={GlobalThreeW} />
            <Route component={FourHundredFour}/>
          </Switch>
        </BreadcrumbsProvider>
      </Router>
    </AlertContext.Provider>
  );
}

const mapStateToProps = (state) => ({
  tokenResponse: state.user,
  allCountriesResponse: allCountriesSelector(state),
  allRegionsResponse: allRegionsSelector(state),
  userResponse: userResponseSelector(state),
  languageResponse: languageResponseSelector(state),
  currentLanguage: currentLanguageSelector(state),
  disasterTypes: state.disasterTypes,
  disasterTypesSelect: disasterTypesSelectSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getUser: (...args) => dispatch(getUserAction(...args)),
  getAllCountries: (...args) => dispatch(getCountriesAllAction(...args)),
  getAllRegions: (...args) => dispatch(getRegionsAllAction(...args)),
  getLanguage: (...args) => dispatch(getLanguageAction(...args)),
  getDisasterTypes: (...args) => dispatch(getDisasterTypes(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Multiplexer);
