'use strict';
import url from 'url';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import { stringify } from 'qs';
import { get } from '../utils/utils';

import { environment, api } from '../config';
import { getListAsCsv, clearLoadedCsv } from '../actions';
import { showAlert, hideAllAlert } from './system-alerts';

class ExportButton extends React.Component {
  constructor (props) {
    super(props);
    this.exportAsCsv = this.exportAsCsv.bind(this);
  }

  componentWillReceiveProps (newProps) {
    if (this.props.csv.fetching && !newProps.csv.fetching && !newProps.csv.error) {
      var firstNewLine = newProps.csv.data.indexOf("\n");
      var firstRow = newProps.csv.data.substring(0, firstNewLine);
      firstRow = firstRow.replace(/dtype/gi, 'disaster-type');
      firstRow = firstRow.replace(/\,code\,/i, ',appeal_code,');
      firstRow = firstRow.replace(/atype/gi, 'appeal-type');
      firstRow = firstRow.replace(/^aid/, 'appeal_id');
      firstRow = firstRow.replace(/country.society_name/i, 'national_society_name');
      firstRow = firstRow.replace(/\./g, ' ');
      firstRow = firstRow.replace(/_/g, '-');

      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + firstRow + newProps.csv.data.substring(firstNewLine));
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      var postfix = stringify(this.props.qs).slice(-2);
      if (postfix == '=0') {
          postfix = '-africa';
      } else if (postfix == '=1') {
          postfix = '-america';
      } else if (postfix == '=2') {
          postfix = '-asia';
      } else if (postfix == '=3') {
          postfix = '-europe';
      } else if (postfix == '=4') {
          postfix = '-middle-east';
      } else {
          postfix = '';
      }
      link.setAttribute('download', newProps.filename + postfix + '.csv');
      link.innerHTML = 'Click';
      document.body.appendChild(link);
      link.click();
      hideAllAlert();
      showAlert('success', <p><strong>Success:</strong> Download completed</p>, true, 1000);
      // remove the loaded state to free up memory
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
      <div className='fold__actions'>
        <button onClick={this.exportAsCsv} className={c('button button--primary-bounded', {
          disabled: this.props.csv.fetching
        })}>Export Table</button>
      </div>
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
