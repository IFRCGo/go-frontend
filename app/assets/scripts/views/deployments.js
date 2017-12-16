'use strict';
import React from 'react';
import { connect } from 'react-redux';

import App from './app';

import { getEruOwners } from '../actions';
import { finishedFetch, get } from '../utils/utils';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { environment } from '../config';

class Deployments extends React.Component {
  componentDidMount () {
    showGlobalLoading();
    this.props._getEruOwners();
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'eruOwners')) {
      hideGlobalLoading();
    }
  }

  render () {
    const data = get(this.props.eruOwners, 'data');
    return (
      <App className='page--deployments'>
        <section className='inpage'>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </section>
      </App>
    );
  }
}

const selector = (state) => ({
  eruOwners: state.eruOwners
});

const dispatcher = (dispatch) => ({
  _getEruOwners: () => dispatch(getEruOwners())
});

export default connect(selector, dispatcher)(Deployments);
