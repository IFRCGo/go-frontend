import React from 'react';
import { Helmet } from 'react-helmet';
import App from './app';

import PresentationDash from '#components/connected/presentation-dash';
import useTranslation from '#hooks/useTranslation';

function Home() {
  const strings = useTranslation('common');

  return (
    <App className='page--homepage'>
      <section className='inpage'>
        <Helmet>
          <title>
            {strings.homeTitle}
          </title>
        </Helmet>
        <header className='inpage__header'>
          <div className=''>
            <div className='inpage__headline'>
              <h1 className='inpage__title inpage__title--home container-lg'>
                {strings.homeHeading}
              </h1>
              <div className='inpage__introduction container-xs'>
                <p>
                  {strings.homeDescription}
                </p>
              </div>
            </div>
            <PresentationDash />
          </div>
        </header>
      </section>
    </App>
  );
}

export default Home;
