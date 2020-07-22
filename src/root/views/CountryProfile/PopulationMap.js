import React from 'react';
import _cs from 'classnames';

import Map from './Map';
import Translate from '#components/Translate';

class PopulationMap extends React.PureComponent {
  render () {
    const {
      className,
      countryId,
      data,
    } = this.props;

    return (
      <div className={_cs(className, 'overview-population-map')}>
        <div className='fold__header__block'>
          <h3 className='tc-heading fold__title'>
            <Translate stringId='populationMapTitle'/>
          </h3>
        </div>
        <div className='tc-content'>
          <Map
            className='overview-map-container'
            countryId={countryId}
            districtList={data.districts}
          />
        </div>
      </div>
    );
  }
}

export default PopulationMap;
