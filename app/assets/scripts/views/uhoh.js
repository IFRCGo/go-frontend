'use strict';
import React from 'react';

export default class UhOh extends React.Component {
  render () {
    return (
      <section className='inpage inpage--uhoh'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Page not found</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <div className='prose prose--responsive'>
              <p>The requested page does not exist or may have been removed.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
