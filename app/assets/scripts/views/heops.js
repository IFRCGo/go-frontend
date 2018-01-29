'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import App from './app';
import Fold from '../components/fold';
import BlockLoading from '../components/block-loading';
import Progress from '../components/progress';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import { SFPComponent } from '../utils/extendables';

import { disasterType } from '../utils/field-report-constants';
import { get, objValues } from '../utils/utils';
import { commaSeparatedNumber as n, nope } from '../utils/format';
import { environment } from '../config';
import { getHeops, getYearlyHeops, getHeopsDtype } from '../actions';
import { regions } from '../utils/region-constants';

const regionOptions = [
  { value: 'all', label: 'All Regions' },
  ...objValues(regions).map(o => ({ value: o.id, label: o.name }))
];

class HeOps extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      heops: {
        page: 1,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          region: 'all'
        }
      }
    };
  }

  componentWillMount () {
    this.props._getHeops();
    this.props._getYearlyHeops();
    this.props._getHeopsDtype();
  }

  updateData (what) {
    let qs = {};
    let state = this.state.heops;
    if (state.sort.field) {
      qs.order_by = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    }

    if (state.filters.region !== 'all') {
      qs.region = state.filters.region;
    }

    this.props._getHeops(this.state.heops.page, qs);
  }

  renderAnnualChart () {
    const {
      data,
      fetched
    } = this.props.annual;
    if (!fetched) return <BlockLoading />;
    const { aggregate } = data;
    if (!Array.isArray(aggregate)) return <p>Oh no! Something went wrong rendering the aggregate data.</p>;

    const tickFormatter = (date) => DateTime.fromISO(date).toFormat('yyyy');
    return (
      <figure className='chart'>
        <figcaption>Heops Deployments by Year</figcaption>
        <div className='chart__container'>
          <ResponsiveContainer>
            <LineChart data={aggregate}>
              <XAxis tickFormatter={tickFormatter} dataKey='timespan' axisLine={false} padding={{ left: 16 }} />
              <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
              <Line type="monotone" dataKey="count" stroke="#C22A26" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </figure>
    );
  }

  renderDtypeChart () {
    const {
      data,
      fetched
    } = this.props.dtype;
    if (!fetched) return <BlockLoading />;
    const { aggregate } = data;
    if (!Array.isArray(aggregate)) return <p>Oh no! Something went wrong rendering the aggregate data.</p>;

    const dtypes = aggregate.map(o => {
      let name = disasterType.find(d => d.value === o.dtype.toString());
      if (!name) return null;
      return {
        name: name.label,
        count: o.count
      };
    }).slice(0, 6).filter(Boolean);
    const max = Math.max.apply(Math, dtypes.map(o => o.count));

    return (
      <figure className='chart'>
        <figcaption>Heops Deployments by Emergency Type</figcaption>
        <div className='chart__container'>
          <ul className='emergencies__list emergenciest__list--static'>
            {dtypes.map(o => (
              <li key={o.name}
                className='emergencies__item'>
                <span className='key'>{o.name}</span>
                <span className='value'><Progress value={o.count} max={max}><span>100</span></Progress></span>
              </li>
            ))}
          </ul>
        </div>
      </figure>
    );
  }

  renderCharts () {
    return (
      <div className='inpage__headline-charts'>
        <h1 className='visually-hidden'>HeOps over time</h1>
        {this.renderAnnualChart()}
        {this.renderDtypeChart()}
      </div>
    );
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
      data,
      fetching,
      fetched,
      error
    } = this.props.list;

    if (fetching) {
      return (
        <Fold title='Heops Deployments'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Heops Deployments'>
          <p>Oh no! An error ocurred getting the stats.</p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'sdate',
          label: <SortHeader id='start_date' title='Start Date' sort={this.state.heops.sort} onClick={this.handleSortChange.bind(this, 'heops', 'start_date')} />
        },
        {
          id: 'edate',
          label: <SortHeader id='end_date' title='End Date' sort={this.state.heops.sort} onClick={this.handleSortChange.bind(this, 'heops', 'end_date')} />
        },
        { id: 'emergType', label: 'Emergency Type' },
        { id: 'country', label: 'Country' },
        {
          id: 'region',
          label: <FilterHeader id='region' title='Region' options={regionOptions} filter={this.state.heops.filters.region} onSelect={this.handleFilterChange.bind(this, 'heops', 'region')} />
        },
        { id: 'name', label: 'Name' },
        { id: 'depRole', label: 'Deployed Role' }
      ];

      const rows = data.objects.map(rowData => {
        const {
          dtype,
          country,
          region
        } = rowData;
        const person = get(rowData, 'person', nope);
        const role = get(rowData, 'role', nope);

        return {
          id: rowData.id,
          sdate: DateTime.fromISO(rowData.start_date).toISODate(),
          edate: DateTime.fromISO(rowData.end_date).toISODate(),
          emergType: dtype ? dtype.name : nope,
          country: country ? <Link to={`/countries/${country.id}`} className='link--primary'>{country.name}</Link> : nope,
          region: region ? <Link to={`/regions/${region.id}`} className='link--primary'>{get(regions, [region.id, 'name'], nope)}</Link> : nope,
          name: person,
          depRole: role
        };
      });

      return (
        <Fold title={`Heops Deployments (${n(data.meta.total_count)})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.meta.total_count / data.meta.limit}
            page={data.meta.offset / data.meta.limit}
            onPageChange={this.handlePageChange.bind(this, 'emerg')}
          />
        </Fold>
      );
    }

    return null;
  }

  render () {
    return (
      <App className='page--about'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>HeOps Deployments</h1>
                {this.renderCharts()}
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              {this.renderTable()}
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
