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
      var thisdata = newProps.csv.data.replace(/\n/,'¤𝛼¤ß¤');
      var firstLine = thisdata.split('¤𝛼¤ß¤')[0];
      var moreLines = thisdata.split('¤𝛼¤ß¤')[1];
      firstLine = firstLine.replace(/dtype/gi, 'disaster-type');      
      firstLine = firstLine.replace(/atype/gi, 'appeal-type');      
      firstLine = firstLine.replace(/^aid/, 'appeal id');      
      firstLine = firstLine.replace(/\./g, ' ');      
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + firstLine + moreLines);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', newProps.filename + '.csv');
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
      limit: 99999,
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
