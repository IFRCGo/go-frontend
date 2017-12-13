'use strict';
import React from 'react';

import App from './app';
import AlertsTable from '../components/connected/alerts-table';
import PresentationDash from '../components/connected/presentation-dash';

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
            <PresentationDash />
            <div className='inner'>
              <AlertsTable />
            </div>
          </div>
        </section>
      </App>
    );
  }
}
