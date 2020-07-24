import React from 'react';
import { Helmet } from 'react-helmet';

import App from './app';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
export default class UhOh extends React.Component {
  render () {
    const { strings } = this.context;
    return (
      <App className='page--uhoh'>
        <Helmet>
          <title>{strings.uhohPageNotFoundTitle}</title>
        </Helmet>
        <section className='inpage inpage--uhoh'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>
                  <Translate stringId='uhohPageNotFound'/>
                </h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <p>
                  <Translate stringId='uhohPageDescription'/>
                </p>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

UhOh.contextType = LanguageContext;
