'use strict';
import React from 'react';

import App from './app';

export default class Emergency extends React.Component {
  render () {
    return (
      <App className='page--emergency'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div className='inpage__headline-content'>
                  <div className='inpage__headline-actions'><button className='button button--primary-plain'>Edit Event</button></div>
                  <h1 className='inpage__title'>Kenyan Drought</h1>
                  <div className="inpage__introduction">
                    <ul className='introduction-nav'>
                      <li className='introduction-nav-item--active'><a href=''>All Appeals</a></li>
                      <li className='introduction-nav-item'><a href=''>Appeal 1</a></li>
                      <li className='introduction-nav-item'><a href=''>Appeal 2</a></li>
                    </ul>
                    <div className='header-stats'>
                      <ul className='stats-list'>
                        <li className='stats-list__item stats-emergencies'>
                          1,033,300<small>Targeted Benficiaries</small>
                        </li>
                        <li className='stats-list__item stats-funding stat-borderless stat-double'>
                          25,062,572<small>Appeal Amount (CHF)</small>
                        </li>
                        <li className='stats-list__item stat-double'>
                          5,560,132<small>Funding (CHF)</small>
                        </li>
                      </ul>
                    </div>
                    <div className='funding-chart'>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className='inpage__nav'>
            <div className='inner'>
              <ul>
                <li>Overview</li>
                <li>Graphics</li>
                <li>Field Reports</li>
                <li>Situation Reports</li>
                <li>Documents</li>
                <li>Contacts</li>
              </ul>
            </div>
          </div>
          <div className='inpage__body'>
            <div className='inner'>
              <section className='fold situational-overview'>
                <div className='inner'>
                  <div className='fold__header'>
                    <h2 className='fold__title'>Situational Overview</h2>
                    <p className='fold__description'>Drought has swept across Kenya’s coastal and semi-arid regions in the north and north-east following two consecutive failed seasonal rains in 2016, doubling the number of food-insecure people to 2.7 million, especially in pastoral areas. Farmers have been unable to plant crops, and the value of livestock has dropped. Malnutrition rates in some areas have reached crisis levels, especially among children under five and expectant mothers, putting them at further risk of disease. An IFRC emergency appeal was revised in March 2017 to assist more than one million people with health, nutrition, water, sanitation and hygiene, food security, and livelihood interventions.</p>
                  </div>
                  <div className='fold__body'>
                  </div>
                </div>
              </section>
              <section className='fold additional-graphics'>
                <div className='inner'>
                  <div className='fold__header'>
                    <h2 className='fold__title'>Additional Graphics</h2>
                  </div>
                  <div className='fold__body'>
                  </div>
                </div>
              </section>
              <section className='fold key-figures'>
                <div className='inner'>
                  <div className='fold__header'>
                    <h2 className='fold__title'>Key Figures</h2>
                  </div>
                  <div className='fold__body'>
                    <ul className='key-figures-list'>
                      <li>
                        <h3>1,700,000</h3>
                        <p className='key-figure-label'>Food Insecure People</p>
                        <p className='key-figure-source'>Source: XXX</p>
                      </li>
                      <li>
                        <h3>1,700,000</h3>
                        <p className='key-figure-label'>Food Insecure People</p>
                        <p className='key-figure-source'>Source: XXX</p>
                      </li>
                      <li>
                        <h3>1,700,000</h3>
                        <p className='key-figure-label'>Food Insecure People</p>
                        <p className='key-figure-source'>Source: XXX</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
              <section className='fold situation-reports'>
                <div className='inner'>
                  <div className='fold__header'>
                    <div className='fold__headline'>
                      <div className='fold__actions'>
                        <button className='button button--primary-plain'>Add Situation Report</button>
                      </div>
                      <h2 className='fold__title'>Situation Reports</h2>
                    </div>
                  </div>
                  <div className='fold__body'>
                    <ul className='situation-reports-list'>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                      <li><a className='link--secondary' href=''>Situation Report, 6 November 2017</a></li>
                    </ul>
                  </div>
                </div>
              </section>
              <section className='fold event-field-reports'>
                <div className='inner'>
                  <div className='fold__header'>
                    <h2 className='fold__title'>Event Field Reports</h2>
                  </div>
                  <div className='fold__body'>
                    <table className='table table--zebra'>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Name</th>
                          <th>Disaster Type</th>
                          <th>Region</th>
                          <th>Country</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>07/10/2017</td>
                          <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                          <td>Topical Cyclone</td>
                          <td><a href=''className='link--primary'>Asia Pacific</a></td>
                          <td><a href=''className='link--primary'>Viet Nam</a></td>
                        </tr>
                        <tr>
                          <td>07/10/2017</td>
                          <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                          <td>Topical Cyclone</td>
                          <td><a href=''className='link--primary'>Asia Pacific</a></td>
                          <td><a href=''className='link--primary'>Viet Nam</a></td>
                        </tr>
                        <tr>
                          <td>07/10/2017</td>
                          <td><a href=''className='link--primary'>Typhoon Damrery 2017</a></td>
                          <td>Topical Cyclone</td>
                          <td><a href=''className='link--primary'>Asia Pacific</a></td>
                          <td><a href=''className='link--primary'>Viet Nam</a></td>
                        </tr>
                      </tbody>
                    </table>
                    <footer className='fold__footer'>
                      <a href='' className='link--primary'>View More</a>
                    </footer>
                  </div>
                </div>
              </section>
              <section className='fold public-docs'>
                <div className='inner'>
                  <div className='fold__header'>
                    <h2 className='fold__title'>Public Appeals Documents</h2>
                  </div>
                  <div className='fold__body'>
                    <ul className='public-docs-list'>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                      <li>09/23/17 <a className='link--secondary' href=''>Audited Financial Statement, 01.01.2016 - 31.12.2016</a></li>
                    </ul>
                  </div>
                  <footer className='fold__footer'>
                    <a href='' className='link--primary'>View More</a>
                  </footer>
                </div>
              </section>
              <section className='fold contacts'>
                <div className='inner'>
                  <div className='fold__header'>
                    <h2 className='fold__title'>Contacts</h2>
                  </div>
                  <div className='fold__body'>
                    <ul className='contacts-list'>
                      <li><strong>Abbas Gullet</strong>, Secretary General,Kenya Red Cross Society , <a className='link--primary' href=''>gullet.abbas@redcross.or.ke</a></li>
                      <li><strong>Abbas Gullet</strong>, Secretary General,Kenya Red Cross Society , <a className='link--primary' href=''>gullet.abbas@redcross.or.ke</a></li>
                      <li><strong>Abbas Gullet</strong>, Secretary General,Kenya Red Cross Society , <a className='link--primary' href=''>gullet.abbas@redcross.or.ke</a></li>
                      <li><strong>Abbas Gullet</strong>, Secretary General,Kenya Red Cross Society , <a className='link--primary' href=''>gullet.abbas@redcross.or.ke</a></li>
                      <li><strong>Abbas Gullet</strong>, Secretary General,Kenya Red Cross Society , <a className='link--primary' href=''>gullet.abbas@redcross.or.ke</a></li>
                      <li><strong>Abbas Gullet</strong>, Secretary General,Kenya Red Cross Society , <a className='link--primary' href=''>gullet.abbas@redcross.or.ke</a></li>
                    </ul>
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
