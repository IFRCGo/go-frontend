'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import { Link, withRouter } from 'react-router-dom';

import { api, environment } from '../config';
import { request } from '../utils/network';
import { uppercaseFirstLetter as u, isoDate } from '../utils/format';
import UserMenu from './connected/user-menu';
import HeaderRegionButton from './header-region-button';

const noFilter = options => options;

function getUriForType (type, id, data) {
  switch (type) {
    case 'region':
      return '/regions/' + id;
    case 'country':
      return '/countries/' + id;
    case 'report':
      return '/reports/' + id;
    case 'event':
      return '/emergencies/' + id;
    case 'appeal':
      return data.event_id ? '/emergencies/' + data.event_id : '/appeals/all?record=' + id;
    default:
      return '/uhoh';
  }
}

class Header extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      search: '',
      showBetaBanner: false
    };
    this.onSelect = this.onSelect.bind(this);

    // Basic function to wait until user stops typing to query ES.
    let i = 0;
    this.slowLoad = input => {
      i += 1;
      let mirror = i;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (i === mirror) {
            return resolve(this.getOptions(input));
          } else {
            return resolve({ options: [] });
          }
        }, 150);
      });
    };
  }

  onSelect ({value}) {
    this.props.history.push(value);
  }

  getOptions (input) {
    return !input
      ? Promise.resolve({ options: [] })
      : request(`${api}api/v1/es_search/?keyword=${input}`)
        .then(data => {
          const options = data.hits.map(o => {
            const d = o._source;
            const value = getUriForType(d.type, d.id, d);
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
      <div className='desktop__header'>
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
                <li><HeaderRegionButton id='regions-menu' currentPath={this.props.match} /></li>
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
                    filterOptions={noFilter}
                    autoload={false}
                    cache={false}
                    loadOptions={this.slowLoad} />
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
    history: T.object,
    match: T.object
  };
}

export default withRouter(Header);
