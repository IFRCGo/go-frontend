'use strict';
import React from 'react';

import App from './app';

export default class Emergencies extends React.Component {
  render () {
    return (
      <App className='page--emergencies'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div className='inpage__headline-content'>
                  <h1 className='inpage__title'>Emergencies</h1>
                  <div className="inpage__introduction--small">
                    <div className='header-stats'>
                      <div className='stat-group stats-group--single'>
                        <div className='stat-icon'>
                          <img src="/assets/graphics/layout/emergency.svg" alt="Targeted Benficiaries"/>
                        </div>
                        <ul>
                          <li>1,033<small>Emergencies in the last 30 Days</small></li>
                        </ul>
                      </div>
                      <div className='stat-group stats-group--single'>
                        <div className='stat-icon'>
                          <img src="/assets/graphics/layout/people.svg" alt="Targeted Benficiaries"/>
                        </div>
                        <ul>
                          <li>1,033,300<small>Affected People in the last 30 days</small></li>
                        </ul>
                      </div>
                      <hr/>
                      <div className='stat-group'>
                        <div className='stat-icon'>
                          <img src="/assets/graphics/layout/funding.svg" alt="Funding"/>
                        </div>
                        <ul>
                          <li>25,062,572<small>Appeal Amount (CHF)</small></li>
                          <li>5,560,132<small>Funding (CHF)</small></li>
                        </ul>
                      </div>
                    </div>
                    <div className='funding-chart'>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
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
