import React from 'react';
import { PropTypes as T } from 'prop-types';
import AsyncSelect from 'react-select/async';
import {
  NavLink,
  Link,
  withRouter,
} from 'react-router-dom';

import { environment } from '#config';
import {
  getSelectInputNoOptionsMessage,
  getElasticSearchOptions,
} from '#utils/utils';
import LanguageSelect from '#components/LanguageSelect';
import Translate from '#components/Translate';
import LanguageContext from '#root/languageContext';

import UserMenu from './connected/user-menu';
import HeaderRegionButton from './header-region-button';
import DropdownMenu from './dropdown-menu';

const noFilter = options => options;

function Header (props) {
  const {
    history,
    match,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const debounceTimeoutRef = React.useRef();
  const loadOptionsWithDebouncing = React.useCallback((input, callback) => {
    window.clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = window.setTimeout(() => {
      getElasticSearchOptions(input, callback);
    }, 500);

    return false;
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
                { <LanguageSelect className="page__meta-nav-elements page__meta-nav-elements--lang" /> }
                <Link to='/about' title={strings.headerMenuResourceTooltip} className='page__meta-nav-elements'>
                  <Translate stringId="headerMenuResources" />
                </Link>
                <UserMenu />
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
                      {/* FIXME: use strings */}
                      New 3W Activity
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
              </ul>
            </nav>
            <div className='nav-global-search col'>
              <form className='gsearch'>
                <div>
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
                    loadOptions={loadOptionsWithDebouncing} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

if (environment !== 'production') {
  Header.propTypes = {
    history: T.object,
    match: T.object
  };
}

export default withRouter(Header);
