'use strict';
import React from 'react';

import App from './app';
import AlertsTable from '../components/connected/alerts-table';
import Sumstats from '../components/connected/sumstats';
import Homemap from '../components/connected/homemap';

export default class Home extends React.Component {
  render () {
    return (
      <App className='page--homepage'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>IFRC Disaster Response and Prepardness</h1>
                <p className='inpage__introduction'>In the beginning the Universe was created. This has made a lot of people very upset and been widely regarded as a bad move.</p>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <section className='fold--stats'>
              <h1 className='visually-hidden'>Statistics</h1>
              <div className='inner'>
                <Sumstats />
              </div>
              <Homemap />
              <div className='stats-chart'>
                <div className='inner'>
                  <figure className='chart'>
                    <figcaption>DREFS and Appeals Over the Last Year</figcaption>
                    <div className='chart__container'>chart</div>
                  </figure>
                  <figure className='chart'>
                    <figcaption>DREFS and Appeals by Year</figcaption>
                    <div className='chart__container'>chart</div>
                  </figure>
                </div>
              </div>
            </section>
            <div className='inner'>
              <AlertsTable />
            </div>
          </div>
        </section>
      </App>
    );
  }
}
