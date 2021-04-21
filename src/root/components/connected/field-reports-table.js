import React from 'react';
import stringify from 'csv-stringify/lib/sync';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { DateTime } from 'luxon';
import _cs from 'classnames';
import { saveAs } from 'file-saver';

import { environment } from '#config';
import { getFieldReportsList } from '#actions';
import {
  recentInterval,
  nope,
  commaSeparatedNumber as n,
  intersperse
} from '#utils/format';
import { get, dateOptions, datesAgo } from '#utils/utils';
import Fold from '#components/fold';
import BlockLoading from '#components/block-loading';
import DisplayTable, {
  FilterHeader,
  SortHeader,
} from '#components/display-table';
import { showAlert } from '#components/system-alerts';
import { SFPComponent } from '#utils/extendables';
import { withLanguage } from '#root/languageContext';
import Translate from '#components/Translate';
import { useRecursiveCsvFetch } from '#hooks/useRequest';
import { disasterTypesSelectSelector } from '#selectors';

import styles from './styles.module.scss';

function getFileName(suffix) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `field-report-${year}-${month}-${day}-${h}-${m}-${s}.csv`;
}

function formatHeader(headerRow) {
  let str = headerRow;
  str = str.replace(/dtype/gi, 'disaster-type');
  str = str.replace(/,code,/i, ',appeal_code,');
  str = str.replace(/atype/gi, 'appeal-type');
  str = str.replace(/^aid/, 'appeal_id');
  str = str.replace(/country.society_name/i, 'national_society_name');
  str = str.replace(/\./g, ' ');
  str = str.replace(/_/g, '-');

  return str;
}

function ExportAllFieldReportButton({ className }) {
  const [url, setUrl] = React.useState('');
  const [pending, data, total] = useRecursiveCsvFetch(
    url,
    {
      onFailure: (err) => {
        console.error('failed to download csv export', err);
        setUrl('');
        showAlert('danger', (
          <p>
            Failed to download the field reports
          </p>
        ), true, 3000);
      }
    }
  );

  React.useEffect(() => {
    if (!pending) {
      if (data?.length > 0) {
        if (data.length === total) {
          const headers = Object.keys(data[0]);
          const dataString = stringify(data, {
            columns: headers,
          });
          const headerString = formatHeader(headers.join(','));
          const fullCsvString = `${headerString}\n${dataString}`;
          const blob = new Blob(
            [fullCsvString],
            { type: 'text/csv', charset: 'utf-8'},
          );
          const fileName = getFileName();
          saveAs(blob, fileName);
        } else {
          console.error('CSV num rows mismatch', `expected: ${total}`, `got: ${data.length}`);
        }
      }
      setUrl('');
    }
  }, [pending, data, total, setUrl]);

  const progress = React.useMemo(() => {
    if (!total) {
      return 0;
    }

    return (100 * (data?.length / total) ?? 0).toFixed(0);
  }, [data, total]);

  const handleExportClick = React.useCallback(() => {
    setUrl('api/v2/field_report');
  }, [setUrl]);

  return (
    <button
      onClick={handleExportClick}
      className={_cs(
        'button button--primary-bounded button-small',
        pending && 'disabled',
        className,
      )}
    >
      { pending ? (
        <Translate
          stringId='exportButtonDownloadingProgress'
          params={{
            progress,
          }}
        />
      ) : (
        <Translate stringId='exportButtonExportTable'/>
      )}
    </button>
  );
}

class FieldReportsTable extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

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
          date: 'all',
          dtype: 'all'
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
    ['limit', 'country', 'region'].forEach(prop => {
      if (newProps[prop] !== this.props[prop]) {
        shouldMakeNewRequest = true;
      }
    });
    if (shouldMakeNewRequest) {
      this.requestResults(newProps);
    }
  }

  requestResults (props) {
    props._getFieldReportsList(this.state.table.page, this.getQs(props));
  }

  getQs (props) {
    let state = this.state.table;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-created_at';
    }

    if (state.filters.date !== 'all') {
      qs.created_at__gte = datesAgo[state.filters.date]();
    } else if (props.showRecent) {
      qs.created_at__gte = recentInterval;
    }

    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }

    if (!isNaN(props.country)) {
      qs.countries__in = props.country;
    } else if (!isNaN(props.region)) {
      qs.regions__in = props.region;
    }
    return qs;
  }

  updateData (what) {
    this.requestResults(this.props);
  }

  render () {
    const {
      strings,
      showExport,
      title = strings.fieldReportsTableTitleDefault,
      list: {
        fetched,
        fetching,
        error,
        data
      }
    } = this.props;

    if (fetching) {
      return (
        <Fold title={this.props.title} id={this.props.id}>
          <BlockLoading/>
        </Fold>
      );
    }

    const results = get(data, 'results', []);
    if (error || (fetched && !results.length && !this.props.isAuthenticated)) {
      return (
        <Fold title={this.props.title} id={this.props.id}>
          <p>
              <Translate stringId='fieldReportsTableLoginRequired'/>
            <Link key='login' to={{pathname: '/login', state: {from: this.props.location}}} className='link-underline' title={strings.fieldReportsTableLogin}>
              <Translate stringId='fieldReportsTableLogin'/>
            </Link></p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title={strings.fieldReportsTableCreatedAt} options={dateOptions} filter={this.state.table.filters.date} onSelect={this.handleFilterChange.bind(this, 'table', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title={strings.fieldReportsTableName} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'summary')} />
        },
        { id: 'event', label: strings.fieldReportsTableEmergency },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title={strings.fieldReportsTableDisasterType} options={[{ value: 'all', label: 'All Types' }, ...this.props.disasterTypesSelect ]} filter={this.state.table.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'table', 'dtype')} />
        },
        { id: 'countries', label: strings.fieldReportsTableCountry }
      ];

      const rows = results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.created_at).toISODate(),
        name: <Link to={`/reports/${o.id}`} className='link--table' title={strings.fieldReportsTableViewAll}>{o.summary || nope}</Link>,
        event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--table' title={strings.fieldReportsTableViewEmergency}>{o.event.name}</Link> : nope,
        dtype: o.dtype?.name || nope,
        countries: intersperse(o.countries.map(c => <Link key={c.id} to={`/countries/${c.id}`} className='link--table' title='View Country'>{c.name}</Link>), ', ')
      }));

      return (
        <Fold
          foldHeaderClass={styles.foldHeader}
          title={`${title} (${n(data.count)})`}
          foldActions={ showExport && (
            <ExportAllFieldReportButton
              className={styles.exportButton}
            />
          )}
          id={this.props.id}
          foldWrapperClass='fold--main'
          navLink={this.props.viewAll ? (
              <Link className='fold__title__link export--link' to={this.props.viewAll}>{this.props.viewAllText || strings.fieldReportsTableViewAllReports}</Link>
          ) : null}
        >
          <DisplayTable
            headings={headings}
            rows={rows}
            className='table table--border-bottom'
            pageCount={data.count / this.state.table.limit}
            page={this.state.table.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'table')}
            noPaginate={this.props.noPaginate}
          />
          {this.props.viewAll ? (
            <div className='fold__footer'>
              <Translate stringId='fieldReportsViewAllIn'/>
              <Link className='link-underline export--link' to={this.props.viewAll + '?region=0'}>{this.props.viewAllText || 'Africa'}</Link> /&nbsp;
              <Link className='link-underline export--link' to={this.props.viewAll + '?region=1'}>{this.props.viewAllText || 'America'}</Link> /&nbsp;
              <Link className='link-underline export--link' to={this.props.viewAll + '?region=2'}>{this.props.viewAllText || 'Asia'}</Link> /&nbsp;
              <Link className='link-underline export--link' to={this.props.viewAll + '?region=3'}>{this.props.viewAllText || 'Europe'}</Link> /&nbsp;
              <Link className='link-underline export--link' to={this.props.viewAll + '?region=4'}>{this.props.viewAllText || 'the Middle East'}</Link><br/>
              <i>
                <Translate stringId='fieldReportsTableProblem'/>
              </i>
            </div>
          ) : null}
        </Fold>
      );
    }

    return null;
  }
}

if (environment !== 'production') {
  FieldReportsTable.propTypes = {
    _getFieldReportsList: T.func,
    list: T.object,
    isAuthenticated: T.bool,

    limit: T.number,
    country: T.number,
    region: T.number,

    noPaginate: T.bool,
    showExport: T.bool,
    title: T.string,

    showRecent: T.bool,
    viewAll: T.string,
    viewAllText: T.string,
    id: T.string
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  list: state.fieldReports,
  isAuthenticated: !!state.user.data.token,
  disasterTypesSelect: disasterTypesSelectSelector(state)
});

const dispatcher = (dispatch) => ({
  _getFieldReportsList: (...args) => dispatch(getFieldReportsList(...args))
});

export default withLanguage(withRouter(connect(selector, dispatcher)(FieldReportsTable)));
