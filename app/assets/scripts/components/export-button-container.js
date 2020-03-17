'use strict';

import ExportButtonComponent from './export-button-component';
import url from 'url';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { stringify } from 'qs';
import { get } from '../utils/utils';
import { startDownload } from '../utils/download-starter';
import { environment, api } from '../config';
import { getListAsCsv, clearLoadedCsv } from '../actions';
import { showAlert } from './system-alerts';

class ExportButton extends React.Component {
  constructor (props) {
    super(props);
    this.exportAsCsv = this.exportAsCsv.bind(this);
    this.replaceBodySpecialChars = this.replaceBodySpecialChars.bind(this);
    this.replaceColumnNames = this.replaceColumnNames.bind(this);
    this.generateFileName = this.generateFileName.bind(this);
  }

  replaceBodySpecialChars (text) {
    return text.replace(/#/g, '¤'); // To be fixed later with CSV-module upgrade. Error description on hup.hu/node/163032
  }

  replaceColumnNames (row) {
    let firstNewLine = row.indexOf('\n');
    let firstRow = row.substring(0, firstNewLine);

    firstRow = this.replaceBodySpecialChars(firstRow);
    firstRow = firstRow.replace(/dtype/gi, 'disaster-type');
    firstRow = firstRow.replace(/,code,/i, ',appeal_code,');
    firstRow = firstRow.replace(/atype/gi, 'appeal-type');
    firstRow = firstRow.replace(/^aid/, 'appeal_id');
    firstRow = firstRow.replace(/country.society_name/i, 'national_society_name');
    firstRow = firstRow.replace(/\./g, ' ');
    firstRow = firstRow.replace(/_/g, '-');

    return firstRow;
  }

  generateFileName (filename, extension) {
    var postfix = stringify(this.props.qs).slice(-2);

    if (postfix === '=0') {
      postfix = '-africa';
    } else if (postfix === '=1') {
      postfix = '-america';
    } else if (postfix === '=2') {
      postfix = '-asia';
    } else if (postfix === '=3') {
      postfix = '-europe';
    } else if (postfix === '=4') {
      postfix = '-middle-east';
    } else {
      postfix = '';
    }

    return filename + postfix + extension;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (newProps) {
    if (this.props.csv.fetching && !newProps.csv.fetching && !newProps.csv.error) {
      let firstNewLine = newProps.csv.data.indexOf('\n');
      let firstRow = this.replaceColumnNames(newProps.csv.data);
      let allOtherRows = this.replaceBodySpecialChars(newProps.csv.data.substring(firstNewLine));
      const dataUri = encodeURI('data:text/csv;charset=utf-8,' + firstRow + allOtherRows);

      startDownload(dataUri, this.generateFileName(newProps.filename, '.csv'));
      this.props._clearLoadedCsv(this.props.resource);
    } else if (!this.props.csv.error && newProps.csv.error) {
      showAlert('danger', <p><strong>Error:</strong> Could not export data</p>, true, 4500);
    }
  }

  exportAsCsv (e) {
    e.preventDefault();
    if (!this.props.csv.fetching) {
      const id = this.props.resource;
      this.props._getListAsCsv(this.getExportLink(), id);
      showAlert('info', <p><strong>Info:</strong> Exporting...</p>, true);
    }
  }

  getExportLink () {
    let qs = Object.assign({}, this.props.qs, {
      format: 'csv',
      limit: 199999,
      offset: 0
    });
    return url.resolve(api, this.props.resource) + '/?' + stringify(qs);
  }

  render () {
    return (
      <ExportButtonComponent exportAsCsv={this.exportAsCsv} csv={this.props.csv} />
    );
  }
}

if (environment !== 'production') {
  ExportButton.propTypes = {
    _getListAsCsv: T.func,
    _clearLoadedCsv: T.func,
    filename: T.string,
    qs: T.object,
    resource: T.string,
    csv: T.object
  };
}

const selector = (state, props) => ({
  csv: get(state.csv.list, props.resource, {
    fetching: false,
    fetched: false,
    receivedAt: null,
    data: {}
  })
});

const dispatcher = (dispatch) => ({
  _getListAsCsv: (...args) => dispatch(getListAsCsv(...args)),
  _clearLoadedCsv: (...args) => dispatch(clearLoadedCsv(...args))
});

export default connect(selector, dispatcher)(ExportButton);
