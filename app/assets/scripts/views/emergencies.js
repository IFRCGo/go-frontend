'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { PropTypes as T } from 'prop-types';

import App from './app';
import EmergenciesDash from '../components/connected/emergencies-dash';
import { getEmergenciesList, getAggregateEmergencies } from '../actions';
import { finishedFetch } from '../utils/utils';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { environment } from '../config';

class Emergencies extends React.Component {
  componentDidMount () {
    showGlobalLoading(2);
    this.props._getEmergenciesList();
    this.props._getAggregateEmergencies(DateTime.local().minus({months: 11}).startOf('day').toISODate(), 'month');
  }

  componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'aggregate.month')) {
      hideGlobalLoading();
    }
    if (finishedFetch(this.props, nextProps, 'list')) {
      hideGlobalLoading();
    }
  }

  render () {
    return (
      <App className='page--emergencies'>
        <section className='inpage'>
          <EmergenciesDash />

          <div className='inpage__body'>
            <div className='map'>
            </div>
            <div className='inner'>

              <section className='fold'>
                <div className='inner'>
                  <div className='fold__header'>
                    <h2 className='fold__title'>Latest Emergencies (2301)</h2>
                  </div>
                  <div className='fold__body'>
                    <div className='table-scroll'>
                      <div className='table-wrap'>
                        <table className='table table--zebra'>
                          <thead>
                            <tr>
                              <th className='fixed-col'>Date</th>
                              <th>Name</th>
                              <th>Disaster Type</th>
                              <th>Total Affected</th>
                              <th>Benficiaries</th>
                              <th>Countries</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className='fixed-col'>07/10/2017</td>
                              <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                              <td>Topical Cyclone</td>
                              <td>743,466</td>
                              <td>743,466</td>
                              <td><a href=''className='link--primary'>Country 1</a><a href=''className='link--primary'>Country 2</a><a href=''className='link--primary'>Country 3</a></td>
                            </tr>
                            <tr>
                              <td className='fixed-col'>07/10/2017</td>
                              <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                              <td>Topical Cyclone</td>
                              <td>743,466</td>
                              <td>743,466</td>
                              <td><a href=''className='link--primary'>Country 1</a><a href=''className='link--primary'>Country 2</a><a href=''className='link--primary'>Country 3</a></td>
                            </tr>
                            <tr>
                              <td className='fixed-col'>07/10/2017</td>
                              <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                              <td>Topical Cyclone</td>
                              <td>743,466</td>
                              <td>743,466</td>
                              <td><a href=''className='link--primary'>Country 1</a><a href=''className='link--primary'>Country 2</a><a href=''className='link--primary'>Country 3</a></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  Emergencies.propTypes = {
    _getEmergenciesList: T.func,
    _getAggregateEmergencies: T.func,
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

const dispatcher = (dispatch) => ({
  _getAggregateEmergencies: (...args) => dispatch(getAggregateEmergencies(...args)),
  _getEmergenciesList: () => dispatch(getEmergenciesList())
});

export default connect(selector, dispatcher)(Emergencies);
