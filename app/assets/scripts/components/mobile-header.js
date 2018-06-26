'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import { Link, withRouter } from 'react-router-dom';

import { api, environment } from '../config';
import { request } from '../utils/network';
import { uppercaseFirstLetter as u, isoDate } from '../utils/format';
import { regions } from '../utils/region-constants';
import UserMenu from './connected/user-menu';
import Dropdown from './dropdown';

const regionArray = Object.keys(regions).map(k => regions[k]);

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

class Header extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      search: '',
      showBetaBanner: true
    };
    this.onSelect = this.onSelect.bind(this);
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
    return (
      <div>
        <header className='page__header page__header--mobile' role='banner'>
          <div className='inner'>
            <div className='page__headline'>
              <div className='page__menu'>
                <a href=''></a>
              </div>
              <h1 className='page__title'>
                <Link to='/' title='Visit page'>
                  <img src='/assets/graphics/layout/go-mobile-logo.png' alt='IFRC GO logo'/>
                  <span>IFRC GO</span>
                </Link>
              </h1>
            </div>
          </div>
          <div className='inner'>
            <div className='nav-global-search'>
              <form className='gsearch'>
                <div className='form__group'>
                  <label className='form__label'>Search</label>
                  <Select.Async
                    placeholder='Search...'
                    onChange={this.onSelect}
                    loadOptions={this.getOptions} />
                </div>
              </form>
            </div>
          </div>
          <div className='nav__block'>
            <div className='inner'>
              <div className='mobile__actions'>
                <Link to='/reports/new' className='button button--small button--primary-filled' title='Create Field Report'><span>Create Field Report</span></Link>
                <button className='button button--small button--close button--text-hidden'><span>close</span></button>
              </div>
              <ul className='nav-block-menu'>
                <li><Link to='/' title='Visit Home page'><span>Home</span></Link></li>
                <li><Link to='/emergencies' title='Visit emergencies page'><span>Emergencies</span></Link></li>
                <li><Link to='/deployments' title='Visit Deployments page'><span>Deployments</span></Link></li>
                <li><Link to='/about' title='Visit About page'><span>About</span></Link></li>
              </ul>
              <ul className='nav-block-user-menu' role='menu'>
                <li><Link to='/account' title='View user account' className='user__menu-item'>Account</Link></li>
                <li><a href='#' title='Logout' className='user__menu-item'>Logout</a></li>
              </ul>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

if (environment !== 'production') {
  Header.propTypes = {
    history: T.object
  };
}

export default withRouter(Header);

class NavDropdown extends React.Component {
  render () {
    const { id, options, title } = this.props;
    return (
      <Dropdown
        id={id}
        triggerClassName='drop__toggle--caret'
        triggerActiveClassName='active'
        triggerText={title}
        triggerTitle={`View ${title}`}
        triggerElement='a'
        direction='down'
        alignment='center' >
        <ul className='drop__menu' role='menu'>
          {options.map(o => (
            <li key={o.to}><Link to={o.to} className='drop__menu-item' title={`View ${o.text}`} data-hook='dropdown:close'>{o.text}</Link></li>
          ))}
        </ul>
      </Dropdown>
    );
  }
}

if (environment !== 'production') {
  NavDropdown.propTypes = {
    id: T.string,
    options: T.array,
    title: T.string
  };
}
