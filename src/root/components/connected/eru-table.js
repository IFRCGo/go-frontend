import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import eruTypes, { getEruType } from '#utils/eru-types';
import { environment } from '#config';
import { getDeploymentERU } from '#actions';
import { commaSeparatedNumber as n, nope } from '#utils/format';
import { get } from '#utils/utils';

import ExportButton from '#components/export-button-container';
import Fold from '#components/fold';
import BlockLoading from '#components/block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '#components/display-table';
import { SFPComponent } from '#utils/extendables';
import LanguageContext from '#root/languageContext';

const eruTypeOptions = [{label: 'All', value: 'all'}].concat(Object.keys(eruTypes).map(type => {
  return {label: eruTypes[type], value: type};
}));

class EruTable extends SFPComponent {
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
          type: 'all'
        }
      }
    };
  }

  componentDidMount () {
    this.requestResults(this.props);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (newProps) {
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
    props._getDeploymentERU(this.state.table.page, this.getQs(props));
  }

  getQs (props) {
    let state = this.state.table;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-eru_owner';
    }

    if (state.filters.type !== 'all') {
      qs.type = state.filters.type;
    }

    if (!isNaN(props.emergency)) {
      qs.event = props.emergency;
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
    } = this.props.eru;
    const { strings } = this.context;
    const title = this.props.title || strings.eruTableTitle;

    if (fetching) {
      return (
        <div className='inner'>
          <Fold title={title}>
            <BlockLoading/>
          </Fold>
        </div>
      );
    }

    if ((error || !get(data, 'results.length')) && this.state.table.filters.type === 'all') {
      return null;
    }

    if (fetched) {
      const headings = [
        {
          id: 'name',
          label: <SortHeader id='name' title={strings.eruTableNameTitle} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'eru_owner')} />
        },
        {
          id: 'type',
          label: <FilterHeader id='type' title={strings.eruTableNameType} options={eruTypeOptions} filter={this.state.table.filters.type} onSelect={this.handleFilterChange.bind(this, 'table', 'type')} />
        },
        {
          id: 'personnel',
          label: <SortHeader id='personnel' title={strings.eruTablePersonnel} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'units')} />
        },
        {
          id: 'equipment',
          label: <SortHeader id='equipment' title={strings.eruTableEquipment} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'equipment_units')} />
        },
        {
          id: 'country',
          label: <SortHeader id='country' title={strings.eruTableCountriesDeployed} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'deployed_to')} />
        },
        {
          id: 'emer',
          label: <SortHeader id='emer' title={strings.eruTableEmergency} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'event')} />
        }
      ];

      const rows = data.results.map(o => {
        const owner = get(o, 'eru_owner.national_society_country', null);
        return {
          id: o.id,
          name: owner !== null ? (owner.society_name || owner.name) : nope,
          country: o.deployed_to ? <Link to={`/countries/${o.deployed_to.id}`} className='link--table' title={strings.eruTableViewCountry}>{o.deployed_to.name}</Link> : nope,
          type: getEruType(o.type),
          emer: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--table' title={strings.eruTableViewEmergency}>{o.event.name}</Link> : nope,
          personnel: o.units,
          equipment: o.equipment_units
        };
      });

      const foldLink = this.props.viewAll ? (
        <Link className='fold__title__link' to={this.props.viewAll}>{this.props.viewAllText || strings.eruTableViewAll}</Link>
      ) : null;
      return (
        <Fold title={`${title} (${n(data.count)})`} id={this.props.id} wrapperClass='table__container' navLink={foldLink} foldClass='fold__title--inline'>
          {this.props.showExport ? (
            <ExportButton filename='deployed-erus'
              qs={this.getQs(this.props)}
              resource='api/v2/eru'
            />
          ) : null}
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.table.limit}
            page={this.state.table.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'table')}
          />
        </Fold>
      );
    }
    return null;
  }
}

EruTable.contextType = LanguageContext;
if (environment !== 'production') {
  EruTable.propTypes = {
    _getDeploymentERU: T.func,
    eru: T.object,

    limit: T.number,
    emergency: T.number,

    noPaginate: T.bool,
    showExport: T.bool,
    id: T.string,
    title: T.string,

    viewAll: T.string,
    viewAllText: T.string
  };
}

const selector = (state, props) => ({
  eru: state.deployments.eru
});

const dispatcher = (dispatch) => ({
  _getDeploymentERU: (...args) => dispatch(getDeploymentERU(...args))
});

export default connect(selector, dispatcher)(EruTable);
