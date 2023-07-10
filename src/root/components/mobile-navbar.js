import React from 'react';
import { PropTypes as T } from 'prop-types';
import AsyncSelect from 'react-select/async';
import { Link, withRouter } from 'react-router-dom';
import c from 'classnames';
import { Redirect } from 'react-router-dom';
import { environment } from '#config';
import { getSelectInputNoOptionsMessage, useDebounce } from '#utils/utils';
import { isIfrcUser } from '#utils/common';
import LanguageContext from '#root/languageContext';
import { URL_SEARCH_KEY } from '#utils/constants';
import { loadOptions } from '#utils/search';
import useReduxState from '#hooks/useReduxState';
import Translate from '#components/Translate';

import UserMenu from './connected/user-menu';
import DropdownMenu from './dropdown-menu';

const noFilter = options => options;

function FlashUpdateLink(props) {
  const user = useReduxState('me');

  const ifrcUser = React.useMemo(() => isIfrcUser(user?.data), [user]);
  if (!ifrcUser) {
    return null;
  }
  return (
    <li>
      <Link
        to='/flash-update/new'
        className='drop__menu-item'
      >
        {props?.label}
      </Link>
    </li>
  );
}


function MobileNavbar(props) {
  const {
    history,
  } = props;
  const { pathname } = props.location;
 
  const { strings } = React.useContext(LanguageContext);
  const searchTextRef = React.useRef();
  const [redirectSearchString, setRedirectSearchString] = React.useState();
  const [showMenu, setShowMenu] = React.useState(false);

  function toggleMenu(e) {
    e.preventDefault();
    setShowMenu(!showMenu);
  }

  const loadOptionsWithDebouncing = useDebounce(loadOptions);

  const handleSearchInputChange = React.useCallback((newText) => {
    searchTextRef.current = newText;
  }, []);

  const handleSelect = React.useCallback(({ value }) => {
    history.push(value);
  }, [history]);

  return (
    <>
      <header className='page__header page__header--mobile' role='banner'>
        <div className='inner container-lg'>
          <div className='page__headline row flex'>
            <div className='page__menu col'>
              <a href='' onClick={toggleMenu}></a>
            </div>
            <h1 className='page__title col'>
              <Link to='/' title={strings.mobileHeaderVisitHome}>
                <img src='/assets/graphics/layout/go-logo-2020.svg' alt='IFRC GO logo' />
                <span>
                  <Translate stringId='mobileHeaderTitle' />
                </span>
              </Link>
            </h1>
          </div>
        </div>
        <div className='inner container-lg'>
          <div className='nav-global-search'>
            <form className='gsearch'>
              <div>
                <label className='form__label'>
                  <Translate stringId='mobileHeaderSearchTitle' />
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
                        // TODO: redirect to search page on enter ?
                        setRedirectSearchString(searchTextRef.current);
                      }
                    }
                  }}
                  onInputChange={handleSearchInputChange}
                />
              </div>
            </form>
          </div>
        </div>
        <div className={c('nav__block', {
          'nav__block--open': showMenu
        })}>
          <div className='inner container-lg'>
            <div className='mobile__actions'>
              <DropdownMenu
                className='drop__toggle--caret button button--primary-bounded button--small drop__toggle--field-report-new'
                activeClassName='active'
                label={strings.headerCreateAReportLabel}
              >
                <ul className='drop__menu drop__menu--select drop__menu__field__report' role='menu'>
                  <li className='drop__menu-item'>
                    <Link to='/reports/new'>{strings.headerDropdownNewFieldReport}</Link>
                  </li>
                  {/* <li className='drop__menu-item'>
                    <a href='https://eenew.ifrc.org/single/y300V3lY?returnURL=https://go.ifrc.org/emergencies/3972#actions' target='_blank'>
                      {strings.headerDropdownCovid19IndicatorTracking}
                    </a>
                  </li> */}
                  {/* <li className='drop__menu-item'>
                    <a href='https://eenew.ifrc.org/single/VmcTHDMh?returnURL=https://go.ifrc.org/emergencies/3972#actions' target='_blank'>
                      {strings.headerDropdownCovid19NSFinancialOverview}
                    </a>
                  </li> */}
                  <li className='drop__menu-item'>
                    <Link
                      to='/three-w/new'
                      className='drop__menu-item'
                    >
                      {strings.headerDropdownNew3WActivity}
                    </Link>
                  </li>
                  <FlashUpdateLink
                    label={strings.headerDropdownNewFlashUpdate}
                  />
                  <li className='drop__menu-item'>
                    <Link
                      to='/dref-application/new'
                      className='drop__menu-item'
                    >
                      {strings.headerDropdownNewDrefApplication}
                    </Link>
                  </li>
                </ul>
              </DropdownMenu>
              <button className='button button--small button--close button--text-hidden' onClick={toggleMenu}>
                <span>
                  <Translate stringId='mobileHeaderClose' />
                </span>
              </button>
            </div>
            <ul className='nav-block-menu'>
              <li><Link to='/' title={strings.mobileHeaderVisitHome} className={c({ 'disabled': pathname === '/' })}><span><Translate stringId='mobileHeaderHome' /></span></Link></li>
              <li><Link to='/emergencies' title={strings.mobileHeaderVisitEmergencies} className={c({ 'disabled': pathname === '/emergencies' })}><span><Translate stringId='mobileHeaderEmergencies' /></span></Link></li>
              <li>
                <span>
                  <Translate stringId='mobileHeaderRegion' />
                </span>
                <ul className='nav-block-submenu'>
                  <li><Link to='/regions/0' title={strings.mobileHeaderVisitAfrica} className={c({ 'disabled': pathname === 'regions/0' })}><span><Translate stringId='mobileHeaderAfrica' /></span></Link></li>
                  <li><Link to='/regions/1' title={strings.mobileHeaderVisitAmerica} className={c({ 'disabled': pathname === 'regions/1' })}><span><Translate stringId='mobileHeaderAmerica' /></span></Link></li>
                  <li><Link to='/regions/2' title={strings.mobileHeaderVisitAsia} className={c({ 'disabled': pathname === 'regions/2' })}><span><Translate stringId='mobileHeaderAsia' /></span></Link></li>
                  <li><Link to='/regions/3' title={strings.mobileHeaderVisitEurope} className={c({ 'disabled': pathname === 'regions/3' })}><span><Translate stringId='mobileHeaderEurope' /></span></Link></li>
                  <li><Link to='/regions/4' title={strings.mobileHeaderVisitMiddleEast} className={c({ 'disabled': pathname === 'regions/0' })}><span><Translate stringId='mobileHeaderMiddleEast' /></span></Link></li>
                </ul>
              </li>
              <li><Link to='/deployments' title={strings.mobileHeaderVisitDeployments} className={c({ 'disabled': pathname === '/deployments' })}><span><Translate stringId='mobileHeaderDeployments' /></span></Link></li>
              <li><Link to='/three-w/' title={strings.mobileHeaderVisitThreeW} className={c({ 'disabled': pathname === '/three-w' })}><span><Translate stringId='mobileHeaderThreeW' /></span></Link></li>
              <li><Link to='/about' title={strings.mobileHeaderVisitResources} className={c({ 'disabled': pathname === '/about' })}><span><Translate stringId='mobileHeaderResources' /></span></Link></li>
            </ul>
            <ul className='nav-block-user-menu' role='menu'>
              <li><Link to='/account' title={strings.mobileHeaderVisitAccount} className={c('user__menu-item', { 'disabled': pathname === '/account' })}><Translate stringId='mobileHeaderAccount' /></Link></li>
              <UserMenu />
            </ul>
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
    </>
  );
}

if (environment !== 'production') {
  MobileNavbar.propTypes = {
    history: T.object,
    location: T.object
  };
}

export default withRouter(MobileNavbar);
