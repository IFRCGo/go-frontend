import React from 'react';
import _cs from 'classnames';

import Map from './Map';

class PopulationMap extends React.PureComponent {
  render () {
    const {
      className,
      countryId,
    } = this.props;

    return (
      <div className={_cs(className, 'overview-population-map')}>
        <h3 className='tc-heading'>
          Population map
        </h3>
        <div className='tc-content'>
          <Map className='overview-map-container' countryId={countryId} />
        </div>
      </div>
    );
  }
}

export default PopulationMap;
