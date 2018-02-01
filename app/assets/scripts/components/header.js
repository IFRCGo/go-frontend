'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import { Link, withRouter } from 'react-router-dom';
import { DateTime } from 'luxon';

import { get } from '../utils/utils';
import { api, environment } from '../config';
import { request } from '../utils/network';
import { uppercaseFirstLetter as u } from '../utils/format';
import { regions } from '../utils/region-constants';
import UserMenu from './connected/user-menu';
import Dropdown from './dropdown';

const regionArray = Object.keys(regions).map(k => regions[k]);

const indexTypeToURI = {
  'event': 'emergencies',
  'report': 'reports',
  'country': 'countries',
  'region': 'regions'
};

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
      : request(`${api}/api/v1/es_search/?type=*,-page_appeal&keyword=${input}`)
        .then(data => {
          const options = data.hits.map(o => {
            // Index names are all `page_{type}`
            const type = o._index.slice(5, o._index.length);
            const uri = get(indexTypeToURI, type);
            if (!uri) return null;
            const value = `/${uri}/${o._source.id}`;
            // country and regions don't have dates.
            const date = o._source.date ? ` (${DateTime.fromISO(o._source.date).toISODate()})` : '';
            const label = `${u(type)}: ${o._source.name}${date}`;
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
        {this.state.showBetaBanner && (
          <div className='beta-note'>
            <div className='inner'>
              <p>This is the beta version of IFRC GO. For issues and feedback on the platform, contact <a href="mailto:im@ifrc.org">im@ifrc.org</a>.</p>
              <div className='beta-note__actions'>
                <button className='button button--small button--close button--text-hidden' onClick={() => this.setState({ showBetaBanner: false })}><span>close</span></button>
              </div>
            </div>
          </div>
        )}
        <header className='page__header' role='banner'>
          <div className='inner'>
            <div className='page__headline'>
              <h1 className='page__title'>
                <Link to='/' title='Visit page'>
                  <img src='/assets/graphics/layout/logo.png' alt='IFRC GO logo'/>
                  <span>IFRC GO</span>
                </Link>
              </h1>
            </div>
            <nav className='page__meta-nav' role='navigation'>
              <Link to='/reports/new' className='button button--small button--primary-filled' title='Create Field Report'><span>Create Field Report</span></Link>
              <UserMenu />
            </nav>
          </div>
          <div className='inner'>
            <nav className='page__prime-nav' role='navigation'>
              <ul className='nav-global-menu'>
                <li><Link to='/' title='Visit Home page'><span>Home</span></Link></li>
                <li><Link to='/emergencies' title='Visit emergencies page'><span>Emergencies</span></Link></li>
                <li><NavDropdown id='regions-menu' title='Regions' options={regionArray.map(o => ({to: `/regions/${o.id}`, text: o.name}))} /></li>
                <li><Link to='/deployments' title='Visit Deployments page'><span>Deployments</span></Link></li>
                <li><Link to='/about' title='Visit About page'><span>About</span></Link></li>
              </ul>
            </nav>
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
