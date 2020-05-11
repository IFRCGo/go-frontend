import React from 'react';

class GlobalHeaderBanner extends React.PureComponent {
  render () {
    return (
      <div className='global__banner global__banner--danger text-center'>
        <span>COVID-19 global situational information and technical guidance available </span>
        <a href='https://go.ifrc.org/emergencies/3972'>here.</a>
      </div>
    );
  }
}

export default GlobalHeaderBanner;
