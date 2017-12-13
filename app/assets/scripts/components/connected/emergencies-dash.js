'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import Stats from '../emergencies/stats';
import Charts from '../emergencies/charts';

class EmergenciesDash extends React.Component {
  render () {
    const {
      list,
      aggregate
    } = this.props;

    return (
      <header className='inpage__header'>
        <div className='inner'>
          <div className='inpage__headline'>
            <div className='inpage__headline-content'>
              <h1 className='inpage__title'>Emergencies</h1>
              <div className="inpage__introduction--small">
                <Stats list={list} />
                <Charts list={list} aggregate={aggregate} />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

if (environment !== 'production') {
  EmergenciesDash.propTypes = {
    list: T.object,
    aggregate: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  list: state.emergencies.list,
  aggregate: state.emergencies.aggregate
});

export default connect(selector)(EmergenciesDash);
