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
              <h1 className='inpage__title'>{_get(data, 'summary', nope)}</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <div className='prose prose--responsive'>
              <h4>Description</h4>
              <p>{_get(data, 'description', nope)}</p>

              <pre>{JSON.stringify(data, 'null', '\t')}</pre>
            </div>
          </div>
        </div>
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
