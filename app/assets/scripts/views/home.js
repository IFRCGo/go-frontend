'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import App from './app';
import PresentationDash from '../components/connected/presentation-dash';
import AlertsTable from '../components/connected/alerts-table';
import AppealsTable from '../components/connected/appeals-table';
import FeaturedEmergencies from '../components/connected/featured-emergencies';

class Home extends React.Component {
  render () {
    return (
      <App className='page--homepage'>
        <Helmet>
          <title>IFRC Go - Home</title>
        </Helmet>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>IFRC Disaster Response and Preparedness</h1>
                <p className='inpage__introduction'>IFRC Go aims to make all disaster information universally accessible and useful to IFRC responders for better decision making.</p>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <PresentationDash />
            <FeaturedEmergencies />
            <div className='inner'>
              <AppealsTable />
            </div>
            <div className='inner'>
              <AlertsTable />
            </div>
          </div>
        </section>
      </App>
    );
  }
}
export default Home;
