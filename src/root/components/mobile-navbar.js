import React from 'react';
import { PropTypes as T } from 'prop-types';
import AsyncSelect from 'react-select/async';
import { Link, withRouter } from 'react-router-dom';
import c from 'classnames';

import { api, environment } from '#config';
import { request } from '#utils/network';
import { uppercaseFirstLetter as u, isoDate } from '#utils/format';
import { getSelectInputNoOptionsMessage } from '#utils/utils';
import UserMenu from './connected/user-menu';
import DropdownMenu from './dropdown-menu';
import { withLanguage } from '#root/languageContext';
import Translate from '#components/Translate';

function getUriForType (type, id) {
  switch (type) {
    case 'report':
      return '/reports/' + id;
    case 'event':
      return '/emergencies/' + id;
    case 'appeal':
      return '/appeals/all';
  }
}

class MobileNavbar extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      search: '',
      showMenu: false
    };
    this.onSelect = this.onSelect.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu (e) {
    e.preventDefault();
    this.setState({ showMenu: !this.state.showMenu });
  }

  onSelect ({value}) {
    this.props.history.push(value);
  }

  getOptions (input) {
    return !input
      ? Promise.resolve({ options: [] })
      : request(`${api}/api/v1/es_search/?keyword=${input}`)
        .then(data => {
          const options = data.hits.map(o => {
            const d = o._source;
            const value = getUriForType(d.type, d.id);
            const date = d.date ? ` (${isoDate(d.date)})` : '';
            const label = `${u(d.type)}: ${d.name}${date}`;
            return {
              value,
              label
            };
          }).filter(Boolean);
          return { options };
        });
  }

  render () {
    const { pathname } = this.props.location;
    const { strings } = this.props;
    return (
      <header className='page__header page__header--mobile' role='banner'>
        <div className='inner container-lg'>
          <div className='page__headline row flex'>
            <div className='page__menu col'>
              <a href='' onClick={this.toggleMenu}></a>
            </div>
            <h1 className='page__title col'>
              <Link to='/' title={strings.mobileHeaderVisitHome}>
                <img src='/assets/graphics/layout/go-logo-2020.svg' alt='IFRC GO logo'/>
                <span>
                  <Translate stringId='mobileHeaderTitle'/>
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
                  <Translate stringId='mobileHeaderSearchTitle'/>
                </label>
                <AsyncSelect
                  // FIXME: use debouncing (slow load) here as well
                  // Similar to header.js
                  placeholder={strings.mobileHeaderSearch}
                  onChange={this.onSelect}
                  noOptionsMessage={getSelectInputNoOptionsMessage}
                  loadOptions={this.getOptions} />
              </div>
            </form>
          </div>
        </div>
        <div className={c('nav__block', {
          'nav__block--open': this.state.showMenu
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
                  <li className='drop__menu-item'>
                    <a href='https://eenew.ifrc.org/single/y300V3lY?returnURL=https://go.ifrc.org/emergencies/3972#actions' target='_blank'>
                      {strings.headerDropdownCovid19IndicatorTracking}
                    </a>
                  </li>
                  <li className='drop__menu-item'>
                    <a href='https://eenew.ifrc.org/single/VmcTHDMh?returnURL=https://go.ifrc.org/emergencies/3972#actions' target='_blank'>
                      {strings.headerDropdownCovid19NSFinancialOverview}
                    </a>
                  </li>
                  <li className='drop__menu-item'>
                  <Link
                      to='/dref-application'
                      className='drop__menu-item'
                    >
                      {/* FIXME: use strings */}
                      New Dref Application
                    </Link>
                  </li>
                  <li className='drop__menu-item'>
                    <Link
                      to='/three-w/new'
                      className='drop__menu-item'
                    >
                      {/* FIXME: use strings */}
                      New 3W Activity
                    </Link>
                  </li>
                </ul>
              </DropdownMenu>
              <button className='button button--small button--close button--text-hidden' onClick={this.toggleMenu}>
                <span>
                  <Translate stringId='mobileHeaderClose'/>
                </span>
              </button>
            </div>
            <ul className='nav-block-menu'>
              <li><Link to='/' title={strings.mobileHeaderVisitHome} className={c({'disabled': pathname === '/'})}><span><Translate stringId='mobileHeaderHome'/></span></Link></li>
              <li><Link to='/emergencies' title={strings.mobileHeaderVisitEmergencies} className={c({'disabled': pathname === '/emergencies'})}><span><Translate stringId='mobileHeaderEmergencies'/></span></Link></li>
              <li>
                <span>
                  <Translate stringId='mobileHeaderRegion'/>
                </span>
                <ul className='nav-block-submenu'>
                  <li><Link to='/regions/0' title={strings.mobileHeaderVisitAfrica} className={c({'disabled': pathname === 'regions/0'})}><span><Translate stringId='mobileHeaderAfrica'/></span></Link></li>
                  <li><Link to='/regions/1' title={strings.mobileHeaderVisitAmerica} className={c({'disabled': pathname === 'regions/1'})}><span><Translate stringId='mobileHeaderAmerica'/></span></Link></li>
                  <li><Link to='/regions/2' title={strings.mobileHeaderVisitAsia} className={c({'disabled': pathname === 'regions/2'})}><span><Translate stringId='mobileHeaderAsia'/></span></Link></li>
                  <li><Link to='/regions/3' title={strings.mobileHeaderVisitEurope} className={c({'disabled': pathname === 'regions/3'})}><span><Translate stringId='mobileHeaderEurope'/></span></Link></li>
                  <li><Link to='/regions/4' title={strings.mobileHeaderVisitMiddleEast} className={c({'disabled': pathname === 'regions/0'})}><span><Translate stringId='mobileHeaderMiddleEast'/></span></Link></li>
                </ul>
              </li>
              <li><Link to='/deployments' title={strings.mobileHeaderVisitDeployments} className={c({'disabled': pathname === '/deployments'})}><span><Translate stringId='mobileHeaderDeployments'/></span></Link></li>
              <li><Link to='/three-w/' title={strings.mobileHeaderVisitThreeW} className={c({'disabled': pathname === '/three-w'})}><span><Translate stringId='mobileHeaderThreeW'/></span></Link></li>
              <li><Link to='/about' title={strings.mobileHeaderVisitResources} className={c({'disabled': pathname === '/about'})}><span><Translate stringId='mobileHeaderResources'/></span></Link></li>
            </ul>
            <ul className='nav-block-user-menu' role='menu'>
              <li><Link to='/account' title={strings.mobileHeaderVisitAccount} className={c('user__menu-item', {'disabled': pathname === '/account'})}><Translate stringId='mobileHeaderAccount'/></Link></li>
              <UserMenu />
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

if (environment !== 'production') {
  MobileNavbar.propTypes = {
    history: T.object,
    location: T.object
  };
}

export default withLanguage(withRouter(MobileNavbar));
