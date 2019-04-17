'use strict';

import React from 'react';
import A1PolicyStrategyForm from './per-forms/a1-policy-strategy-form';
import { Helmet } from 'react-helmet';
import App from './app';

class PerForms extends React.Component {
  render () {
    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>IFRC Go - Emergencies</title>
        </Helmet>
        <section className='inpage'>
          <div className='inpage__body'>
            <div className='inner'>
              <A1PolicyStrategyForm></A1PolicyStrategyForm>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

export default PerForms;
