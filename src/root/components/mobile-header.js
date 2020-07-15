import React from 'react';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import { Link, withRouter } from 'react-router-dom';
import c from 'classnames';

import { api, environment } from '#config';
import { request } from '#utils/network';
import { uppercaseFirstLetter as u, isoDate } from '#utils/format';
import UserMenu from './connected/user-menu';
import HeaderRegionButton from './header-region-button';
import Dropdown from './common/dropdown';

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
    return (
      <header className='page__header page__header--mobile' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <div className='page__menu'>
              <a href='' onClick={this.toggleMenu}></a>
            </div>
            <h1 className='page__title'>
              <Link to='/' title='Visit page'>
                <img src='/assets/graphics/layout/go-logo-2020.svg' alt='IFRC GO logo'/>
                <span>IFRC GO</span>
              </Link>
            </h1>
          </div>
        </div>
        <div className='inner'>
          <div className='nav-global-search'>
            <form className='gsearch'>
              <div>
                <label className='form__label'>Search</label>
                <Select.Async
                  placeholder='Search...'
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
              <Dropdown
                id='drop__header__field__report'
                triggerClassName='drop__toggle--caret button button--primary-bounded button--small drop__toggle--field-report-new'
                triggerActiveClassName='active'
                triggerText='Create a Report'
                triggerElement='a'
                direction='down'
                alignment='center' >
                <ul className='drop__menu drop__menu--select drop__menu__field__report' role='menu'>
                  <li className='drop__menu-item'>
                    <Link to='/reports/new'>New Field Report</Link>
                  </li>
                  <li className='drop__menu-item'>
                    <a href='https://ee.kob4.ifrc.org/single/::Ho8bHKDr' target='_blank'>Covid-19 Indicator Tracking</a>
                  </li>
                  <li className='drop__menu-item'>
                    <a href='https://ee.kob4.ifrc.org/single/::w4KbO3Rc' target='_blank'>Covid-19 NS Financial Overview</a>
                  </li>                                        
                </ul>
              </Dropdown>              
              <button className='button button--small button--close button--text-hidden' onClick={this.toggleMenu}>
                <span>close</span>
              </button>
            </div>
            <ul className='nav-block-menu'>
              <li><Link to='/' title='Visit Home page' className={c({'disabled': pathname === '/'})}><span>Home</span></Link></li>
              <li><Link to='/emergencies' title='Visit emergencies page' className={c({'disabled': pathname === '/emergencies'})}><span>Emergencies</span></Link></li>
              <li>
                <span>Regions</span>
                <ul className='nav-block-submenu'>
                  <li><Link to='/regions/0' title='Visit Africa region page' className={c({'disabled': pathname === 'regions/0'})}><span>Africa</span></Link></li>
                  <li><Link to='/regions/1' title='Visit Americas region page' className={c({'disabled': pathname === 'regions/1'})}><span>Americas</span></Link></li>
                  <li><Link to='/regions/2' title='Visit Asia Pacific region page' className={c({'disabled': pathname === 'regions/2'})}><span>Asia Pacific</span></Link></li>
                  <li><Link to='/regions/3' title='Visit Europe region page' className={c({'disabled': pathname === 'regions/3'})}><span>Europe</span></Link></li>
                  <li><Link to='/regions/4' title='Visit Middle East & North Africa region page' className={c({'disabled': pathname === 'regions/0'})}><span>Middle East & North Africa</span></Link></li>
                </ul>
              </li>
              <li><Link to='/deployments' title='Visit Deployments page' className={c({'disabled': pathname === '/deployments'})}><span>Deployments</span></Link></li>
              <li><Link to='/about' title='Visit Resources page' className={c({'disabled': pathname === '/about'})}><span>Resources</span></Link></li>
            </ul>
            <ul className='nav-block-user-menu' role='menu'>
              <li><Link to='/account' title='View user account' className={c('user__menu-item', {'disabled': pathname === '/account'})}>Account</Link></li>
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

export default withRouter(MobileHeader);
