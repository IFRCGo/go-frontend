import React from 'react';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import { Link, withRouter } from 'react-router-dom';
import c from 'classnames';

import { api, environment } from '#config';
import { request } from '#utils/network';
import { uppercaseFirstLetter as u, isoDate } from '#utils/format';
import UserMenu from './connected/user-menu';
import LanguageContext from '#root/languageContext';
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

class MobileHeader extends React.PureComponent {
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
    const { strings } = this.context;
    return (
      <header className='page__header page__header--mobile' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <div className='page__menu'>
              <a href='' onClick={this.toggleMenu}></a>
            </div>
            <h1 className='page__title'>
              <Link to='/' title={strings.mobileHeaderVisitHome}>
                <img src='/assets/graphics/layout/go-logo-2020.svg' alt='IFRC GO logo'/>
                <span>
                  <Translate stringId='mobileHeaderTitle'/>
                </span>
              </Link>
            </h1>
          </div>
        </div>
        <div className='inner'>
          <div className='nav-global-search'>
            <form className='gsearch'>
              <div>
                <label className='form__label'>
                  <Translate stringId='mobileHeaderSearchTitle'/>
                </label>
                <Select.Async
                  placeholder={strings.mobileHeaderSearch}
                  onChange={this.onSelect}
                  loadOptions={this.getOptions} />
              </div>
            </form>
          </div>
        </div>
        <div className={c('nav__block', {
          'nav__block--open': this.state.showMenu
        })}>
          <div className='inner'>
            <div className='mobile__actions'>
              <Link to='/reports/new' className='button button--small button--primary-filled' title={strings.mobileHeaderCreateFieldReport}><span><Translate stringId='mobileHeaderCreateFieldReport'/></span></Link>
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
  MobileHeader.propTypes = {
    history: T.object,
    location: T.object
  };
}

MobileHeader.contextType = LanguageContext;
export default withRouter(MobileHeader);
