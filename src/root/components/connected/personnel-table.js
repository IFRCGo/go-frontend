import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '#config';
import { getPersonnel } from '#actions';
import { commaSeparatedNumber as n, nope } from '#utils/format';
import {
  get,
  dateOptions,
  datesAgo
} from '#utils/utils';

import ExportButton from '#components/export-button-container';
import Fold from '#components/fold';
import BlockLoading from '#components/block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '#components/display-table';
import { SFPComponent } from '#utils/extendables';
import LanguageContext from '#root/languageContext';
import Progress from '#components/progress';
import ReactTooltip from 'react-tooltip';

const typeOptions = [
  { value: 'all', label: 'All' },
  { value: 'rdrt', label: 'RDRT/RIT' },
  { value: 'heop', label: 'HEOP' },
  { value: 'fact', label: 'FACT' },
  { value: 'rr', label: 'Rapid Response' }
];

// Should add the other types if needed
// These types reference types defined in the backend models here: https://github.com/IFRCGo/go-api/blob/e92b0ceadd70297a574fe4410d76eb7bf8614411/deployments/models.py#L98-L106
const typeLongNames = {
  'rr': 'Rapid Response'
};

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
          startDateInterval: 'all',
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
    props._getPersonnel(this.state.table.page, this.getQs(props));
  }

  getQs (props) {
    let state = this.state.table;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-start_date';
    }

    if (state.filters.startDateInterval !== 'all') {
      qs.start_date__gte = datesAgo[state.filters.startDateInterval]();
    }
    if (state.filters.type !== 'all') {
      qs.type = state.filters.type;
    }

    if (!isNaN(props.emergency)) {
      qs.event_deployed_to = props.emergency;
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

    const { strings } = this.context;
    const title = this.props.title || strings.personnelTableTitle;

    if (fetching) {
      return (
        <Fold title={title} id={this.props.id}>
          <BlockLoading/>
        </Fold>
      );
    }

    if ((error || !get(data, 'results.length')) && this.state.table.filters.startDateInterval === 'all' && this.state.table.filters.type === 'all') {
      return null;
    }

    // if (fetched) {
    if (fetched) {
      const headings = [
      /*{
        id: 'startDateInterval',
        label: <FilterHeader id='startDateInterval' title={strings.personnelTableStartDate} options={dateOptions} filter={this.state.table.filters.startDateInterval} onSelect={this.handleFilterChange.bind(this, 'table', 'startDateInterval')} />
      },
      {
        id: 'endDate',
        label: <SortHeader id='end_date' title={strings.personnelTableEndDate} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'end_date')} />
      },*/
      {
        id: 'role',
        label: <SortHeader id='role' title={strings.personnelTableRole} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'role')} />
      },
      {
        id: 'type',
        label: <FilterHeader id='type' title={strings.personnelTableType} options={typeOptions} filter={this.state.table.filters.type} onSelect={this.handleFilterChange.bind(this, 'table', 'type')} />
      },
      {
        id: 'country',
        label: <SortHeader id='country_from' title={strings.personnelTableFrom} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'country_from')} />
      },
      {
        id: 'name',
        label: <SortHeader id='name' title={strings.personnelTableName} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'name')} />
      },
      {
        id: 'progress__personnel',
        label: <SortHeader id='progress' title="" sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'progress')} />
      },
      /*{
        id: 'deployed',
        label: <SortHeader id='deployment' title={strings.personnelTableDeployedTo} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'deployment')} />
      },
      {
        id: 'emer',
        label: <SortHeader id='emer' title={strings.personnelTableEmergency} sort={this.state.table.sort} onClick={() => {}} /> // for filtering options check .../api/v2/personnel/?limit=2 - the Filters button, Ordering
      }*/];

      const rows = data.results.map(o => ({
        id: o.id,
        //startDateInterval: DateTime.fromISO(o.start_date).toISODate(),
        //endDate: DateTime.fromISO(o.end_date).toISODate(),
        role: get(o, 'role', nope),
        type: o.type === 'rr' ? typeLongNames[o.type] : o.type.toUpperCase(),
        country: o.country_from ? <Link to={`/countries/${o.country_from.id}`} className='link--table' title={strings.personnelTableViewCountry}>{o.country_from.society_name || o.country_from.name}</Link> : nope,
        name: o.name,
        progress__personnel: 
                  <div className='progress__block__personnel'
                     data-html={true}
                     data-tip='
                      <div class="row-sm flex flex-align-center progress__block__tooltip__heading">
                        <div class="col-sm text-uppercase base-font-medium">John Smith</div>
                        <div class="col-sm margin-left-auto"><span class="collecticon-sm-xmark font-size-lg"></span></div>
                      </div>
                      <div class="row-sm spacing-half-b flex">
                        <div class="col-sm">Start - End Dates</div>
                        <div class="col-sm base-font-semi-bold">Jan 15 - Feb 15 2020</div>
                      </div>
                      <div class="row-sm spacing-half-b flex">
                        <div class="col-sm">Position</div>
                        <div class="col-sm base-font-semi-bold">Data Vis. Specialist</div>
                      </div>
                      <div class="row-sm spacing-half-b flex">
                        <div class="col-sm">Type</div>
                        <div class="col-sm base-font-semi-bold">RRP</div>
                      </div>
                      <div class="row-sm spacing-half-b flex">
                        <div class="col-sm">Deploying Party</div>
                        <div class="col-sm base-font-semi-bold">British NS</div>
                      </div>
                      <div class="row-sm spacing-half-b flex">
                        <div class="col-sm">Deployed To</div>
                        <div class="col-sm base-font-semi-bold">Republic of the Congo</div>
                      </div>
                     '
                     //data-for='{`${o.id}`}'         
                  >
                    <ReactTooltip
                      className='tooltip'
                      html={true}
                      //data-id={`${o.id}`},
                      globalEventOff='click'
                      aria-haspopup='true' />
                    <Progress value='50' max='100'></Progress>
                  </div>
        /*deployed: o.deployment && o.deployment.country_deployed_to ? <Link to={`/countries/${o.deployment.country_deployed_to.id}`} className='link--table' title={strings.personnelTableViewCountry}>{o.deployment.country_deployed_to.name}</Link> : nope,
        emer: o.deployment && o.deployment.event_deployed_to ? <Link to={`/emergencies/${o.deployment.event_deployed_to.id}`} className='link--table' title={strings.personnelTableViewCountry}>{o.deployment.event_deployed_to.name}</Link> : nope*/
      }));

      const foldLink = this.props.viewAll ? (
        <Link className='fold__title__link' to={this.props.viewAll}>{this.props.viewAllText || strings.personnelTableViewAllDeployed}</Link>
      ) : null;

      return (
        <Fold title={`${title} (${n(data.count)})`} navLink={foldLink} id={this.props.id} foldWrapperClass='table__container' foldTitleClass='fold__title--inline'>
          {this.props.showExport ? (
            <ExportButton filename='deployed-personnel'
              qs={this.getQs(this.props)}
              resource='api/v2/personnel'
            />
          ) : null}
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.table.limit}
            page={this.state.table.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'table')}
            paginate={this.props.noPaginate}
          />
        </Fold>
      );
    }

    return null;
  }
}

PersonnelTable.contextType = LanguageContext;
if (environment !== 'production') {
  PersonnelTable.propTypes = {
    _getPersonnel: T.func,
    personnel: T.object,

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
  personnel: state.deployments.personnel
});

const dispatcher = (dispatch) => ({
  _getPersonnel: (...args) => dispatch(getPersonnel(...args))
});

export default connect(selector, dispatcher)(PersonnelTable);
