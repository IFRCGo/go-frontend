import React from 'react';
import { Helmet } from 'react-helmet';
import App from './app';
import PresentationDash from '#components/connected/presentation-dash';
import AlertsTable from '#components/connected/alerts-table';
import HighlightedOperations from '#components/highlighted-operations';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class Home extends React.Component {
  render () {
    const { strings } = this.context;
    return (
      <App className='page--homepage'>
        <section className='inpage'>
          <Helmet>
            <title>{strings.homeTitle}</title>
          </Helmet>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>
                  <Translate stringId='homeHeading' />
                </h1>
                <p className='inpage__introduction line-brand-deco'>
                  <Translate stringId='homeDescription' />
                </p>
              </div>
            </div>
          </header>
          <div className='inpage__body inpage__body__main'>
            <HighlightedOperations opsType='all'/>
            <PresentationDash />
            <div className='inner'>
              <AlertsTable
                title={strings.homeSurgeNotification}
                limit={5}
                viewAll={'/alerts/all'}
                showRecent={true}
              />
            </div>
          </div>
        </section>
      </App>
    );
  }
}
Home.contextType = LanguageContext;
export default Home;
