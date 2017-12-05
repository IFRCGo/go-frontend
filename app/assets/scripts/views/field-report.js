'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { getFieldReportById } from '../actions';
import {
  commaSeparatedNumber as n,
  nope,
  getResponseStatus
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
    return get(data, 'countries', []).map(c => c.name).join(', ');
  }

  renderPlannedResponse (data) {
    const response = [
      ['DREF Requested', getResponseStatus(data, 'dref')],
      ['Emergency Appeal', getResponseStatus(data, 'appeal')],
      ['RDRT/RITS', getResponseStatus(data, 'rdrt')],
      ['FACT', getResponseStatus(data, 'fact')],
      ['IFRC Staff', getResponseStatus(data, 'ifrc_staff')]
    ].filter(d => Boolean(d[1]));

    if (!response.length) {
      return null;
    }

    return (
      <section className='display-section'>
        <h3>Planned International Response</h3>
        <dl className='dl-horizontal numeric-list'>
          {response.map(d => d[1] ? [
            <dt key={`${d[0]}-dt`}>{d[0]}</dt>,
            <dl key={`${d[0]}-dl`}>{d[1]}</dl>
          ] : null)}
        </dl>
      </section>
    );
  }

  renderContent () {
    if (!this.props.report.fetched) {
      return null;
    }

    const { data } = this.props.report;
    console.log(data, nope);

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <h1 className='inpage__title'>{get(data, 'summary', nope)}</h1>
                <div>
                  <h2 className='inpage__introduction'>{get(data, 'dtype.name', nope)} | {this.renderCountries(data)}</h2>
                </div>
              </div>
              <div className='inpage__headline-actions'>
                <p className='inpage__note'>Last Updated by User1293 on 8/11/2017</p>
                <button className='button button--primary-raised-light'>Update</button>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <div className='prose fold prose--responsive'>
              <div className='inner'>
                <section className='display-section'>
                </section>
                <section className='display-section'>
                  <h3>Numeric Details</h3>
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
                    <dd>{n(get(data, 'num_displaced'))}</dd>
                    <dt>Assisted (RC): </dt>
                    <dd>{n(get(data, 'num_displaced'))}</dd>
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
                    <dt>Assisted (Government): </dt>
                    <dd>{n(get(data, 'gov_num_displaced'))}</dd>
                  </dl>
                  <dl className='dl-horizontal numeric-list'>
                    <dt>Local Staff: </dt>
                    <dd>{n(get(data, 'num_localstaff'))}</dd>
                    <dt>Volunteers: </dt>
                    <dd>{n(get(data, 'num_volunteers'))}</dd>
                    <dt>Expats/Delegates: </dt>
                    <dd>{n(get(data, 'num_expats_delegates'))}</dd>
                  </dl>
                </section>
                {this.renderPlannedResponse(data)}
                <section className='display-section'>
                  <h3>Description</h3>
                  <p>{get(data, 'description', nope)}</p>
                </section>
                <section className='display-section'>
                  <h3>Actions Taken</h3>
                  {get(data, 'actions_taken', []).map(action => (
                    <div className='action'>
                    </div>
                  ))}
                </section>
                <section className='display-section'>
                  <h3>Contacts</h3>
                  <p>{get(data, 'Contacts', nope)}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
        <pre>{JSON.stringify(data, 'null', '\t')}</pre>
      </section>
    );
  }

  render () {
    return (
      <App className='page--field-report'>
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
