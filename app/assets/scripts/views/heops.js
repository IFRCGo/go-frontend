'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import App from './app';
import BlockLoading from '../components/block-loading';

import { get } from '../utils/utils';
import { nope } from '../utils/format';
import { environment } from '../config';
import { getHeops, getYearlyHeops, getHeopsDtype } from '../actions';
import { regions } from '../utils/region-constants';

class HeOps extends React.Component {
  componentWillMount () {
    this.props._getHeops();
    this.props._getYearlyHeops();
    this.props._getHeopsDtype();
  }

  renderCharts () {
  }

  renderTableRow (o) {
    const {
      dtype,
      country,
      region
    } = o;
    const person = get(o, 'person', nope);
    const role = get(o, 'role', nope);
    return (
      <tr key={o.id}>
        <td>{DateTime.fromISO(o.start_date).toISODate()}</td>
        <td>{DateTime.fromISO(o.end_date).toISODate()}</td>
        <td>{dtype ? dtype.name : nope }</td>
        <td>{country ? <Link to={`/countries/${country.id}`} className='link--primary'>{country.name}</Link> : nope}</td>
        <td>{region ? <Link to={`/regions/${region.id}`} className='link--primary'>{get(regions, [region.id, 'name'], nope)}</Link> : nope}</td>
        <td>{person}</td>
        <td>{role}</td>
      </tr>
    );
  }

  renderTable () {
    const {
      error,
      fetched,
      data
    } = this.props.list;

    if (!fetched && !error) {
      return <BlockLoading />;
    }

    return (
      <table className='table table--zebra responsive-table'>
        <thead>
          <tr>
            <th><a className='table__sort table__sort--none'>Start Date</a></th>
            <th><a className='table__sort table__sort--none'>End Date</a></th>
            <th>Emergency Type</th>
            <th>Country</th>
            <th><a className='table__filter'>Region</a></th>
            <th><a className='table__filter'>Name</a></th>
            <th>Deployed Role</th>
          </tr>
        </thead>
        <tbody>
          {data.objects.map(this.renderTableRow)}
        </tbody>
      </table>
    );
  }

  render () {
    return (
      <App className='page--about'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>HeOps Deployments</h1>
                <div className='inpage__headline-charts'>
                  <h1 className='visually-hidden'>HeOps over time</h1>
                  <figure className='chart'>
                    <figcaption>Heops Deployments by Year</figcaption>
                    <div className='chart__container'>

                    </div>
                  </figure>
                  <figure className='chart'>
                    <figcaption>Heops Deployments by Emergency Type</figcaption>
                    <div className='chart__container'>

                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </header>

          <div className='inpage__body'>
            <div className='inner'>
              <div className='fold'>
                <div className='inner'>
                  {this.renderTable()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  HeOps.propTypes = {
    list: T.object,
    annual: T.object,
    dtype: T.object,
    _getHeops: T.func,
    _getYearlyHeops: T.func,
    _getHeopsDtype: T.func
  };
}

const selector = (state) => ({
  list: state.heops.list,
  annual: state.heops.annual,
  dtype: state.heops.dtype
});

const dispatcher = (dispatch) => ({
  _getHeops: (...args) => dispatch(getHeops(...args)),
  _getYearlyHeops: () => dispatch(getYearlyHeops()),
  _getHeopsDtype: () => dispatch(getHeopsDtype())
});

export default connect(selector, dispatcher)(HeOps);
