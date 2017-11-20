'use strict';
import React from 'react';

import App from './app';

export default class About extends React.Component {
  render () {
    return (
      <App className='page--about'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>About</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='inner'>
              <div className='prose prose--responsive'>
                <p>There isn't much to say about why this text is here. But if you want to know more:</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem voluptate aliquid sit, nam commodi quaerat ea vitae nihil deleniti hic, impedit magnam! Quos fugiat hic saepe aliquid. Illum, nostrum, error!</p>
              </div>
            </div>
          </div>
        </section>
      </App>
    );
  }
}
