import React from 'react';
import { PropTypes as T } from 'prop-types';
import AsyncSelect from 'react-select/async';
import {
  NavLink,
  Link,
  withRouter,
  Redirect,
} from 'react-router-dom';

import { environment } from '#config';
import { getSelectInputNoOptionsMessage } from '#utils/utils';
import LanguageContext from '#root/languageContext';
import useReduxState from '#hooks/useReduxState';
import useDebouncedValue from '#hooks/useDebouncedValue';
import { getSearchValue } from '#utils/common';
import useInputState from '#hooks/useInputState';

import { URL_SEARCH_KEY } from '#utils/constants';
import { isIfrcUser } from '#utils/common';
import { api } from '#config';
import { request } from '#utils/network';
import UserMenu from './connected/user-menu';

import Translate from '#components/Translate';
import LanguageSelect from '#components/LanguageSelect';
import HeaderRegionButton from './header-region-button';
import DropdownMenu from './dropdown-menu';

const noFilter = options => options;
const MAX_VIEW_PER_SECTION = 3;
const MAX_VIEW_SEARCH_POPUP = 10;

function Navbar(props) {
  const {
    history,
    match,
  } = props;

  const user = useReduxState('me');
  const ifrcUser = React.useMemo(() => isIfrcUser(user?.data), [user]);
  const searchTextRef = React.useRef();
  const [redirectSearchString, setRedirectSearchString] = React.useState();
  const urlSearchValue = getSearchValue(URL_SEARCH_KEY);

  const [searchString, setSearchString] = useInputState(
    getSearchValue(URL_SEARCH_KEY)
  );

  const { strings } = React.useContext(LanguageContext);
  const debouncedSearchString = useDebouncedValue(
    searchString?.trim(),
    500,
  );
  React.useEffect(() => {
    setSearchString(urlSearchValue);
  }, [urlSearchValue, setSearchString]);

  const debounceTimeoutRef = React.useRef();

  const ns = user?.data?.profile?.country?.id;
  const orgType = (user?.data?.is_superuser === true) ? '*' :
    user?.data?.profile?.org_type;

  const loadOptionsWithDebouncing = React.useCallback((searchString, callback) => {
    window.clearTimeout(debounceTimeoutRef.current);

    const response = request(`${api}api/v1/search/?keyword=${searchString}`).then(d => {

      if (searchString.length === 3) {
        const countryList = d.countries.map(country => {
          return {
            value: `/countries/${country.id}`,
            label: `Country: ${country.name}`
          };
        });
        const countryData = countryList.slice(0, MAX_VIEW_PER_SECTION);

        const regionList = d.regions.map(region => {
          return {
            value: `/regions/${region.id}`,
            label: `Region: ${region.name}`
          };
        });
        const regionData = regionList.slice(0, MAX_VIEW_PER_SECTION);

        const emergencyList = d.emergencies.map(emergency => {
          return {
            value: `/emergencies/${emergency.id}`,
            label: `Emergency: ${emergency.name}`
          };
        });
        const emergencyData = emergencyList.slice(0, MAX_VIEW_PER_SECTION);

        const projectList = d.projects.map(project => {
          return {
            value: `/three-w/${project.event_id}`,
            label: `3W Project: ${project.name}`
          };
        });
        const projectData = projectList.slice(0, MAX_VIEW_PER_SECTION);

        const reportList = d.reports.map(report => {
          return {
            value: `/reports/${report.id}`,
            label: `Report: ${report.name}`
          };
        });
        const reportData = reportList.slice(0, MAX_VIEW_PER_SECTION);

        //NOTE: Add if there is link for emergency planning and surge Deployment
        /*
        const emergencyPlanningList = d.emergency_planning.map(emergencyPlanning => {
          return {
            value: `/emergencies/${emergencyPlanning.id}`,
            label: `Emergency Planning: ${emergencyPlanning.name}`
          };
        });
        const emergencyPlanningData = emergencyPlanningList.slice(0, MAX_VIEW_PER_SECTION);

        const surgeDeploymentList = d.surge_deployments.map(surge => {
          return {
            value: `/emergencies/${surge.event_id}`,
            label: `Surge Deployment: ${surge.name}`
          };
        });
        const surgeDeploymentData = surgeDeploymentList.slice(0, MAX_VIEW_PER_SECTION);
        */

        const latestList = countryData.concat(regionData, emergencyData, projectData, reportData).slice(0, MAX_VIEW_SEARCH_POPUP);
        callback(latestList);
      }
    });

    return false;
  }, [orgType, ns]);

  const handleSearchInputChange = React.useCallback((newText) => {
    searchTextRef.current = newText;
  }, []);

  const handleSelect = React.useCallback(({ value }) => {
    history.push(value);
  }, [history]);

  return (
    <div className='desktop__header'>
      <header className='page__header' role='banner'>
        <div className='page__header__inner__wrap'>
          <div className='container-lg spacing-v'>
            <div className='inner row flex'>
              <div className='page__headline col'>
                <h1 className='page__title'>
                  <Link to='/' title={strings.headerVisitPageTooltip}>
                    <img src='/assets/graphics/layout/go-logo-2020.svg' alt={strings.headerLogoAltText} className="logo-main" />
                    <Translate
                      stringId="headerAppName"
                    />
                  </Link>
                </h1>
              </div>
              <nav className='page__meta-nav col' role='navigation'>
                {<LanguageSelect className="page__meta-nav-elements page__meta-nav-elements--lang" />}
                <Link to='/about' title={strings.headerMenuResourceTooltip} className='page__meta-nav-elements'>
                  <Translate stringId="headerMenuResources" />
                </Link>
                <UserMenu />
                {/*             <div style={{paddingRight:'8px'}}>
                <a href={strings.wikiJsLinkGOWiki+'/'+currentLanguage +'/'+ strings.wikiJsLinkUserAccount} title='GO Wiki' target='_blank' ><img className='' src='/assets/graphics/content/wiki-help-header1.svg' alt='IFRC GO logo'/></a>
                </div>*/}
                <DropdownMenu
                  className='drop__toggle--caret button button--primary-bounded button--small drop__toggle--field-report-new'
                  activeClassName='active'
                  label={
                    <Translate stringId="headerCreateAReportLabel" />
                  }
                  dropdownContainerClassName='header-menu-dropdown'
                >
                  <div className='drop__menu drop__menu--select drop__menu__field__report' role='menu'>
                    <Link
                      to='/reports/new'
                      className='drop__menu-item'
                    >
                      {strings.headerDropdownNewFieldReport}
                    </Link>
                    <a
                      href='https://eenew.ifrc.org/single/y300V3lY?returnURL=https://go.ifrc.org/emergencies/3972#actions'
                      target='_blank'
                      className='drop__menu-item'
                    >
                      {strings.headerDropdownCovid19IndicatorTracking}
                    </a>
                    <a
                      className='drop__menu-item'
                      href='https://eenew.ifrc.org/single/VmcTHDMh?returnURL=https://go.ifrc.org/emergencies/3972#actions'
                      target='_blank'
                    >
                      {strings.headerDropdownCovid19NSFinancialOverview}
                    </a>
                    <Link
                      to='/three-w/new'
                      className='drop__menu-item'
                    >
                      {strings.headerDropdownNew3WActivity}
                    </Link>
                    {ifrcUser && (
                      <Link
                        to='/flash-update/new'
                        className='drop__menu-item'
                      >
                        {strings.headerDropdownNewFlashUpdate}
                      </Link>
                    )}
                    <Link
                      to='/dref-application/new'
                      className='drop__menu-item'
                    >
                      {strings.headerDropdownNewDrefApplication}
                    </Link>
                  </div>
                </DropdownMenu>
              </nav>
            </div>
          </div>
        </div>
        <div className='inner container-lg'>
          <div className='row flex'>
            <nav className='page__prime-nav col' role='navigation'>
              <ul className='nav-global-menu'>
                <li>
                  <NavLink to='/' title={strings.headerMenuHomeTooltip} activeClassName='navbar-highlighted' exact>
                    <Translate stringId='headerMenuHome' />
                  </NavLink>
                </li>
                <li>
                  <HeaderRegionButton id='regions-menu' currentPath={match} />
                </li>
                <li>
                  <NavLink to='/emergencies' title={strings.headerMenuEmergenciesTooltip} activeClassName='navbar-highlighted' exact>
                    <Translate stringId="headerMenuEmergencies" />
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/deployments' title={strings.headerMenuDeploymentsTooltip} activeClassName='navbar-highlighted' exact>
                    <Translate stringId="headerMenuSurge" />
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/preparedness#global-summary' title={strings.headerMenuPreparednessTooltip} activeClassName='navbar-highlighted' exact>
                    <Translate stringId="headerMenuPreparedness" />
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/three-w/' title={strings.headerMenuThreeWTooltip} activeClassName='navbar-highlighted' exact>
                    <Translate stringId="headerMenuThreeW" />
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className='nav-global-search col'>
              <div className='gsearch'>
                <label className='form__label'>
                  <Translate stringId="headerSearchLabel" />
                </label>
                <AsyncSelect
                  placeholder={strings.headerSearchPlaceholder}
                  onChange={handleSelect}
                  filterOptions={noFilter}
                  autoload={false}
                  noOptionsMessage={getSelectInputNoOptionsMessage}
                  cache={false}
                  loadOptions={loadOptionsWithDebouncing}
                  onKeyDown={(e) => {
                    if (e.which === 13) {
                      e.preventDefault();
                      if (searchTextRef.current?.trim().length > 2) {
                        setRedirectSearchString(searchTextRef.current);
                      }
                    }
                  }}
                  onInputChange={handleSearchInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      {redirectSearchString && (
        <Redirect
          to={{
            pathname: "/search",
            search: `?${URL_SEARCH_KEY}=${redirectSearchString}`,
          }}
        />
      )}
    </div>
  );
}

if (environment !== 'production') {
  Navbar.propTypes = {
    history: T.object,
    match: T.object
  };
}

export default withRouter(Navbar);
