'use strict';
import React from 'react';

import App from './app';
import EmergenciesDash from '../components/connected/emergencies-dash';

export default class Emergencies extends React.Component {
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
