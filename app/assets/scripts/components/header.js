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
import UserMenu from './connected/user-menu';

const indexTypeToURI = {
  'event': 'emergencies',
  'report': 'reports'
};

class Header extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      search: ''
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
            const label = `${u(type)}: ${o._source.name} (${DateTime.fromISO(o._source.date).toISODate()})`;
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
              <li><Link to='/emergencies' title='Visit emergencies page'><span>Emergencies</span></Link></li>
              <li><Link to='/deployments' title='Visit deployments page'><span>Deployments</span></Link></li>
              <li><Link to='/about' title='Visit about page'><span>About</span></Link></li>
            </ul>
            <div className='nav-global-search'>
              <form className='gsearch'>
                <div className='form__group'>
                  <label className='form__label'>Search</label>
                  <Select.Async
                    onChange={this.onSelect}
                    loadOptions={this.getOptions} />

                </div>
              </form>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

if (environment !== 'production') {
  Header.propTypes = {
    history: T.object
  };
}

export default withRouter(Header);
