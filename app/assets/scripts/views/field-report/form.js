'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { get } from 'object-path';
import {
  getFieldReportSchema,
  getFieldReportById,
  createFieldReport
} from '../../actions';

const fixture = {
  action: 'LRC Svannakhet branch closely coordinated with PDMC and other stakeholders in collecting information data in flooding areas',
  created_at: new Date(),
  description: 'Heavy rain over parts of the country is the result of a trough of low  pressure combined with the northwest monsoon flowing through Laos.',
  dtype: {
    id: 7
  },
  countries: [{
    id: 12
  }],
  num_affected: 1000,
  num_assisted_gov: 50,
  num_assisted_rc: 150,
  num_dead: 25,
  num_displaced: 55,
  num_expats_delegates: 0,
  num_injured: 2,
  num_localstaff: 50,
  num_missing: 0,
  num_volunteers: 5,
  request_assistance: true,
  rid: 5,
  status: 2,
  summary: ''
};

// arbitrary field report to tie action creater and state to.
const reportPK = 15;

class FieldReportForm extends React.Component {
  constructor () {
    super();
    this.postFixture = this.postFixture.bind(this);
  }

  componentWillMount () {
    this.props._getSchema();
    this.props._getReport();
  }

  postFixture () {
    this.props._createReport(fixture);
  }

  render () {
    return (
      <div>
        <h2>Fixture</h2>
        <button onClick={this.postFixture}>Post!</button>
        <pre>{JSON.stringify(fixture, null, '\t')}</pre>

        {this.props.report.fetched && !this.props.report.error ? ([
          <h2 key='title'>Report {reportPK}</h2>,
          <pre key='data'>{JSON.stringify(this.props.report.data, null, '\t')}</pre>
        ]) : null}

        {this.props.schema.fetched && !this.props.schema.error ? ([
          <h2 key='title'>Schema</h2>,
          <pre key='data'>{JSON.stringify(this.props.schema.data.fields, null, '\t')}</pre>
        ]) : null}
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  FieldReportForm.propTypes = {
    _getReport: T.func,
    _getSchema: T.func,
    _createReport: T.func,
    report: T.object,
    schema: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  report: get(state.fieldReportDetail, reportPK, {}),
  schema: state.fieldReportSchema
});

const dispatcher = (dispatch) => ({
  _getReport: () => dispatch(getFieldReportById(reportPK)),
  _getSchema: () => dispatch(getFieldReportSchema()),
  _createReport: (...args) => dispatch(createFieldReport(...args))
});

export default connect(selector, dispatcher)(FieldReportForm);
