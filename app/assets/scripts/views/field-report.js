'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { getFieldReportById } from '../actions';
import {
  commaSeparatedNumber as n,
  separateUppercaseWords as separate,
  nope,
  getResponseStatus,
  intersperse,
  yesno
} from '../utils/format';
import { get } from '../utils/utils/';

import App from './app';

class FieldReport extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      return this.getReport(nextProps.match.params.id);
    }

    if (this.props.report.fetching && !nextProps.report.fetching) {
      hideGlobalLoading();
    }
  }

  componentDidMount () {
    this.getReport(this.props.match.params.id);
  }

  getReport (id) {
    showGlobalLoading();
    this.props._getFieldReportById(id);
  }

  renderCountries (data) {
    const els = get(data, 'countries', [])
      .map(c => <Link key={c.id} className='link--primary' to={'/countries/' + c.id}>{c.name}</Link>);
    return intersperse(els, ', ');
  }

  renderEmergencyLink (data) {
    const { event } = data;
    return event ? <Link className='link--primary' to={'/emergencies/' + event.id}>{event.name}</Link> : 'No emergency page';
  }

  renderPlannedResponse (data) {
    const response = [
      ['DREF', getResponseStatus(data, 'dref')],
      ['Emergency Appeal', getResponseStatus(data, 'appeal')],
      ['RDRT/RITS', getResponseStatus(data, 'rdrt')],
      ['Rapid Response Personnel', getResponseStatus(data, 'fact')],
      ['IFRC Staff', getResponseStatus(data, 'ifrc_staff')],
      ['Forecast Based Response', getResponseStatus(data, 'forecast_based_response')]
    ].filter(d => Boolean(d[1]));

    // Every response is either 0 (not planned) or null.
    if (!response.length) {
      return null;
    }
    return (
      <DisplaySection title='Planned International Response'>
        <dl className='dl-horizontal numeric-list'>
          {response.map(d => d[1] ? [
            <dt key={`${d[0]}-dt`}>{d[0]}</dt>,
            <dl key={`${d[0]}-dl`}>{d[1]}</dl>
          ] : null)}
        </dl>
      </DisplaySection>
    );
  }

  renderActionsTaken (data, key, orgDisplayName) {
    const actions = get(data, 'actions_taken', []).find(d => d.organization === key);

    // No actions have been taken
    if (!actions || !Array.isArray(actions.actions) || !actions.actions.length) {
      return null;
    }
    return (
      <DisplaySection title={`Actions taken by ${orgDisplayName}`}>
        <ul className='actions-list'>
          {actions.actions.map((d, i) => <li key={`action-${i}`}>{d.name}</li>)}
        </ul>
      </DisplaySection>
    );
  }

  renderSources (data) {
    const sources = get(data, 'sources', []);
    if (!sources.length) {
      return null;
    }
    return (
      <DisplaySection title='Sources'>
        {sources.map((d, i) => (
          <div className='form__group' key={`${d.id} + ${i}`}>
            <p className='form__label'>{d.stype}</p>
            <p>{d.spec}</p>
          </div>
        ))}
      </DisplaySection>
    );
  }

  renderContacts (data) {
    const contacts = get(data, 'contacts', []);
    if (!contacts.length) {
      return null;
    }
    return (
      <DisplaySection title='Contacts'>
        {contacts.map((d, i) => (
          <div className='form__group' key={`${d.name} + ${i}`}>
            <p className='form__label'>{separate(d.ctype)}</p>
            <p><strong>{d.name}</strong>, {d.title}, <a className='link--primary' href={`mailto:${d.email}`}>{d.email}</a></p>
          </div>
        ))}
      </DisplaySection>
    );
  }

  /**
   * Gets the status of the FR - either `EVT` for Event or `EW` for Early Warning
   * Defaults to `EVT` if the status is some-how neither.
   */
  getStatus () {
    const { data } = this.props.report;
    const status = data.status;
    if (status === 8) {
      return 'EW';
    }
    if (status === 9) {
      return 'EVT';
    }
    return 'EVT';
  }

  renderNumericDetails (data) {
    const status = this.getStatus();
    const evtHtml = (
      <React.Fragment>
        <dl className='dl-horizontal numeric-list'>
          <dt>Injured (RC): </dt>
          <dd>{n(get(data, 'num_injured'))}</dd>
          <dt>Missing (RC): </dt>
          <dd>{n(get(data, 'num_missing'))}</dd>
          <dt>Dead (RC): </dt>
          <dd>{n(get(data, 'num_dead'))}</dd>
          <dt>Displaced (RC): </dt>
          <dd>{n(get(data, 'num_displaced'))}</dd>
          <dt>Affected (RC): </dt>
          <dd>{n(get(data, 'num_affected'))}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>Injured (Government): </dt>
          <dd>{n(get(data, 'gov_num_injured'))}</dd>
          <dt>Missing (Government): </dt>
          <dd>{n(get(data, 'gov_num_missing'))}</dd>
          <dt>Dead (Government): </dt>
          <dd>{n(get(data, 'gov_num_dead'))}</dd>
          <dt>Displaced (Government): </dt>
          <dd>{n(get(data, 'gov_num_displaced'))}</dd>
          <dt>Affected (Government): </dt>
          <dd>{n(get(data, 'gov_num_affected'))}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>Injured (Other): </dt>
          <dd>{n(get(data, 'other_num_injured'))}</dd>
          <dt>Missing (Other): </dt>
          <dd>{n(get(data, 'other_num_missing'))}</dd>
          <dt>Dead (Other): </dt>
          <dd>{n(get(data, 'other_num_dead'))}</dd>
          <dt>Displaced (Other): </dt>
          <dd>{n(get(data, 'other_num_displaced'))}</dd>
          <dt>Affected (Other): </dt>
          <dd>{n(get(data, 'other_num_affected'))}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>Assisted by Government:</dt>
          <dd>{n(get(data, 'gov_num_assisted'))}</dd>
          <dt>Assisted by RCRC Movement:</dt>
          <dd>{n(get(data, 'num_assisted'))}</dd>
          <dt>Local Staff: </dt>
          <dd>{n(get(data, 'num_localstaff'))}</dd>
          <dt>Volunteers: </dt>
          <dd>{n(get(data, 'num_volunteers'))}</dd>
          <dt>Delegates: </dt>
          <dd>{n(get(data, 'num_expats_delegates'))}</dd>
        </dl>
      </React.Fragment>
    );

    const ewHtml = (
      <React.Fragment>
        <dl className='dl-horizontal numeric-list'>
          <dt>Potentially Affected (RC): </dt>
          <dd>{n(get(data, 'num_potentially_affected'))}</dd>
          <dt>People at Highest Risk (RC): </dt>
          <dd>{n(get(data, 'num_highest_risk'))}</dd>
          <dt>Affected Pop Centres (RC): </dt>
          <dd>{get(data, 'affected_pop_centres') || '--'}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>Potentially Affected (Government): </dt>
          <dd>{n(get(data, 'gov_num_potentially_affected'))}</dd>
          <dt>People at Highest Risk (Government): </dt>
          <dd>{n(get(data, 'gov_num_highest_risk'))}</dd>
          <dt>Affected Pop Centres (Government): </dt>
          <dd>{get(data, 'gov_affected_pop_centres') || '--'}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>Potentially Affected (Other): </dt>
          <dd>{n(get(data, 'other_num_potentially_affected'))}</dd>
          <dt>People at Highest Risk (Other): </dt>
          <dd>{n(get(data, 'other_num_highest_risk'))}</dd>
          <dt>Affected Pop Centres (Other): </dt>
          <dd>{get(data, 'other_affected_pop_centres') || '--'}</dd>
        </dl>
        <dl className='dl-horizontal numeric-list'>
          <dt>Assisted by Government:</dt>
          <dd>{n(get(data, 'gov_num_assisted'))}</dd>
          <dt>Assisted by RCRC Movement:</dt>
          <dd>{n(get(data, 'num_assisted'))}</dd>
        </dl>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <DisplaySection title='Numeric details'>
          { status === 'EVT' ? evtHtml : ewHtml }
        </DisplaySection>
        <DisplaySection
          title='Sources for data marked as Other'
          inner={get(data, 'other_sources', false)}
        />
      </React.Fragment>
    );
  }

  renderContent () {
    const { data } = this.props.report;
    if (!this.props.report.fetched || !data) {
      return null;
    }

    const lastTouchedAt = DateTime.fromISO(data.updated_at || data.created_at).toISODate();

    return (
      <section className='inpage'>
        <Helmet>
          <title>IFRC Go - {get(data, 'summary', 'Field Report')}</title>
        </Helmet>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <h1 className='inpage__title'>{get(data, 'summary', nope)}</h1>
                <div>
                  <h2 className='inpage__introduction'>{get(data, 'dtype.name', nope)} | {this.renderCountries(data)} | {this.renderEmergencyLink(data)}</h2>
                </div>
              </div>
              <div className='inpage__headline-actions'>
                <Link className='button button--primary-bounded' to={`/reports/${data.id}/edit`}>Edit Report</Link>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <div className='prose fold prose--responsive'>
              <div className='inner'>
                <p className='inpage__note'>Last updated{data.user ? ` by ${data.user.username}` : null} on {lastTouchedAt}</p>
                {this.renderNumericDetails(data)}
                {this.renderPlannedResponse(data)}
                <DisplaySection title='Description' inner={get(data, 'description', false)} />
                <DisplaySection title='Requests for Assistance'>
                  <p>
                    <span>Government Requests International Assistance: </span>
                    <span>{yesno(get(data, 'request_assistance'))}</span>
                  </p>
                  <p>
                    <span>NS Requests International Assistance:</span>
                    <span>{yesno(get(data, 'ns_request_assistance'))}</span>
                  </p>
                </DisplaySection>
                {this.renderActionsTaken(data, 'NTLS', 'National Society')}
                {this.renderActionsTaken(data, 'FDRN', 'IFRC')}
                {this.renderActionsTaken(data, 'PNS', 'any other RCRC Movement actors') /* instead of PNS Red Cross, go-frontend/issues/822 */ }
                <DisplaySection title='Actions taken by others' inner={get(data, 'actions_others', false)} />
                {this.renderSources(data)}
                {this.renderContacts(data)}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  render () {
    return (
      <App className='page--field-report'>
        <Helmet>
          <title>IFRC Go - Field Report</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  FieldReport.propTypes = {
    _getFieldReportById: T.func,
    match: T.object,
    report: T.object
  };
}

class DisplaySection extends React.Component {
  render () {
    const { inner, children, title } = this.props;
    if (!children && !inner) { return null; }
    const content = children || <p dangerouslySetInnerHTML={{__html: inner}} />;
    return (
      <section className='display-section'>
        <h3>{title}</h3>
        {content}
      </section>
    );
  }
}

if (environment !== 'production') {
  DisplaySection.propTypes = {
    title: T.string,
    inner: T.string,
    children: T.node
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  report: get(state.fieldReport, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  })
});

const dispatcher = (dispatch) => ({
  _getFieldReportById: (...args) => dispatch(getFieldReportById(...args))
});

export default connect(selector, dispatcher)(FieldReport);
