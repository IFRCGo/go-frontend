'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getPersonnel } from '../../actions';
import { commaSeparatedNumber as n, nope } from '../../utils/format';
import {
  get,
  dateOptions,
  datesAgo
} from '../../utils/utils';

import Fold from '../fold';
import BlockLoading from '../block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '../display-table';
import { SFPComponent } from '../../utils/extendables';

const typeOptions = [
  { value: 'all', label: 'All' },
  { value: 'rdrt', label: 'RDRT/RIT' },
  { value: 'heop', label: 'HEOP' },
  { value: 'fact', label: 'FACT' }
];

class PersonnelTable extends SFPComponent {
  constructor (props) {
    super(props);
    this.state = {
      table: {
        page: 1,
        limit: isNaN(props.limit) ? 10 : props.limit,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          startDate: 'all',
          type: 'all'
        }
      }
    };
  }

  componentDidMount () {
    this.requestResults(this.props);
  }

  componentWillReceiveProps (newProps) {
    let shouldMakeNewRequest = false;
    ['limit', 'emergency'].forEach(prop => {
      if (newProps[prop] !== this.props[prop]) {
        shouldMakeNewRequest = true;
      }
    });
    if (shouldMakeNewRequest) {
      this.requestResults(newProps);
    }
  }

  requestResults (props) {
    props._getPersonnel(this.state.table.page, this.getQs(props));
  }

  getQs (props) {
    let state = this.state.table;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-end_date';
    }

    if (state.filters.startDate !== 'all') {
      qs.start_date__gte = datesAgo[state.filters.date]();
    }
    if (state.filters.type !== 'all') {
      qs.type = state.filters.type;
    }
    return qs;
  }

  updateData (what) {
    this.requestResults(this.props);
  }

  render () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.personnel;

    const title = this.props.title || 'Deployed Personnel';

    if (fetching) {
      return (
        <Fold title={title} id={this.props.id}>
          <BlockLoading/>
        </Fold>
      );
    }

    if ((error || !get(data, 'results.length')) && this.state.table.filters.startDate === 'all' && this.state.table.filters.type === 'all') {
      return null;
    }

    // if (fetched) {
    if (fetched) {
      const headings = [{
        id: 'startDate',
        label: <FilterHeader id='startDate' title='Start Date' options={dateOptions} filter={this.state.table.filters.startDate} onSelect={this.handleFilterChange.bind(this, 'table', 'startDate')} />
      },
      {
        id: 'endDate',
        label: <SortHeader id='endDate' title='End Date' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'end_date')} />
      },
      {
        id: 'name',
        label: <SortHeader id='name' title='Name' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'name')} />
      },
      {
        id: 'role',
        label: <SortHeader id='role' title='Role' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'role')} />
      },
      {
        id: 'type',
        label: <FilterHeader id='type' title='Type' options={typeOptions} filter={this.state.table.filters.type} onSelect={this.handleFilterChange.bind(this, 'table', 'type')} />
      },
      {
        id: 'country',
        label: <SortHeader id='country' title='From' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'country_from')} />
      },
      {
        id: 'deployed',
        label: <SortHeader id='deployed' title='Deployed to' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'deployment')} />
      },
      {
        id: 'emer',
        label: <SortHeader id='emer' title='Emergency' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'deployment')} />
      }];

      const rows = data.results.map(o => ({
        id: o.id,
        startDate: DateTime.fromISO(o.start_date).toISODate(),
        endDate: DateTime.fromISO(o.end_date).toISODate(),
        name: o.name,
        role: get(o, 'role', nope),
        type: o.type.toUpperCase(),
        country: o.country_from ? <Link to={`/countries/${o.country_from.id}`} className='link--primary' title='View Country'>{o.country_from.name}</Link> : nope,
        deployed: o.deployment && o.deployment.country_deployed_to ? <Link to={`/countries/${o.deployment.country_deployed_to.id}`} className='link--primary' title='View Country'>{o.deployment.country_deployed_to.name}</Link> : nope,
        emer: o.deployment && o.deployment.event_deployed_to ? <Link to={`/emergencies/${o.deployment.event_deployed_to.id}`} className='link--primary' title='View Country'>{o.deployment.event_deployed_to.name}</Link> : nope
      }));

      return (
        <div className='inner'>
          <Fold title={`${title} (${n(data.count)})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.count / this.state.table.limit}
              page={this.state.table.page - 1}
              onPageChange={this.handlePageChange.bind(this, 'table')}
              paginate={this.props.noPaginate}
            />
          </Fold>
        </div>
      );
    }

    return null;
  }
}

if (environment !== 'production') {
  PersonnelTable.propTypes = {
    _getPersonnel: T.func,
    personnel: T.object,

    limit: T.number,
    emergency: T.number,

    noPaginate: T.bool,
    id: T.string,
    title: T.string
  };
}

const selector = (state, props) => ({
  personnel: state.deployments.personnel
});

const dispatcher = (dispatch) => ({
  _getPersonnel: (...args) => dispatch(getPersonnel(...args))
});

export default connect(selector, dispatcher)(PersonnelTable);
