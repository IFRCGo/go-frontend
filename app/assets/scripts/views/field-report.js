'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import _get from 'lodash.get';

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { getFieldReportById } from '../actions';
import { nope } from '../utils/format';

import App from './app';

class FieldReport extends React.Component {
  constructor (props) {
    super(props);
  }

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

  renderContent () {
    if (!this.props.report.fetched) {
      return null;
    }

    const { data } = this.props.report;

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <div className='inpage__headline-content'>
                <h1 className='inpage__title'>Kenyan Drought</h1>
                <div>
                  <h2 className='inpage__introduction'>{_get(data, 'dtype.name', nope)} | {_get(data, 'countries.name', nope)}</h2>
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
                    <dd>{_get(data, 'num_injured', nope)}</dd>
                    <dt>Missing (RC): </dt>
                    <dd>{_get(data, 'num_missing', nope)}</dd>
                    <dt>Dead (RC): </dt>
                    <dd>{_get(data, 'num_dead', nope)}</dd>
                    <dt>Displaced (RC): </dt>
                    <dd>{_get(data, 'num_displaced', nope)}</dd>
                    <dt>Affected (RC): </dt>
                    <dd>{_get(data, 'num_displaced', nope)}</dd>
                    <dt>Assisted (RC): </dt>
                    <dd>{_get(data, 'num_displaced', nope)}</dd>
                  </dl>
                  <dl className='dl-horizontal numeric-list'>
                    <dt>Injured (Government): </dt>
                    <dd>{_get(data, 'gov_num_injured', nope)}</dd>
                    <dt>Missing (Government): </dt>
                    <dd>{_get(data, 'gov_num_missing', nope)}</dd>
                    <dt>Dead (Government): </dt>
                    <dd>{_get(data, 'gov_num_dead', nope)}</dd>
                    <dt>Displaced (Government): </dt>
                    <dd>{_get(data, 'gov_num_displaced', nope)}</dd>
                    <dt>Affected (Government): </dt>
                    <dd>{_get(data, 'gov_num_affected', nope)}</dd>
                    <dt>Assisted (Government): </dt>
                    <dd>{_get(data, 'gov_num_displaced', nope)}</dd>
                  </dl>
                  <dl className='dl-horizontal numeric-list'>
                    <dt>Local Staff: </dt>
                    <dd>{_get(data, 'num_localstaff', nope)}</dd>
                    <dt>Volunteers: </dt>
                    <dd>{_get(data, 'num_volunteers', nope)}</dd>
                    <dt>Expats/Delegates: </dt>
                    <dd>{_get(data, 'num_expats_delegates', nope)}</dd>
                  </dl>
                </section>
                <section className='display-section'>
                  <h3>Description</h3>
                  <p>{_get(data, 'description', nope)}</p>
                </section>
                <section className='display-section'>
                  <h3>Actions Taken</h3>
                  <p>{_get(data, 'actions_taken', nope)}</p>
                </section>
                <section className='display-section'>
                  <h3>Contacts</h3>
                  <p>{_get(data, 'Contacts', nope)}</p>
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
  report: _get(state.fieldReport, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  })
});

const dispatcher = (dispatch) => ({
  _getFieldReportById: (...args) => dispatch(getFieldReportById(...args))
});

export default connect(selector, dispatcher)(FieldReport);
