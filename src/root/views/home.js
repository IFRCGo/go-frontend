import React from 'react';
import { Helmet } from 'react-helmet';
import App from './app';
import PresentationDash from '#components/connected/presentation-dash';

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
            <div className=''>
              <div className='inpage__headline'>
                <h1 className='inpage__title inpage__title--home container-lg'>
                  <Translate stringId='homeHeading' />
                </h1>
                <div className='inpage__introduction container-xs'>
                  <p><Translate stringId='homeDescription' /></p>
                </div>
              </div>
              <PresentationDash />
            </div>
          </header>
        </section>
      </App>
    );
  }
}
Home.contextType = LanguageContext;
export default Home;
