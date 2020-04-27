'use strict';
import React from 'react';

class GlobalHeaderBanner extends React.PureComponent {
  render () {
    return (
      <div className='global__banner global__banner--danger text-center'>
        <span>You may find more information related to the ongoing COVID-19 Global Operation by clicking </span>
        <a href='https://go.ifrc.org/emergencies/3972'>here.</a>
      </div>
    );
  }
}

export default GlobalHeaderBanner;
