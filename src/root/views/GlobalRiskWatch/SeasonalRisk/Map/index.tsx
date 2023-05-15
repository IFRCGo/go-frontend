import React from 'react';
import {
  _cs,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapBounds,
} from '@togglecorp/re-map';

import GoMapDisclaimer from '#components/GoMapDisclaimer';
import {
  defaultMapStyle,
  defaultMapOptions,
  BBOXType,
} from '#utils/map';

import Choropleth from './Choropleth';

import styles from './styles.module.scss';

const globalBounds: BBOXType = [-180, -90, 180, 90];

interface Props {
  className?: string;
  riskData: { iso3: string, value: number }[];
}

function SeasonalRiskMap(props: Props) {
  const {
    className,
    riskData,
  } = props;

  return (
    <div className={_cs(styles.map, className)}>
      <Map
        mapStyle={defaultMapStyle}
        mapOptions={defaultMapOptions}
        navControlShown
        navControlPosition="top-right"
      >
        <MapContainer className={styles.mapContainer} />
        <GoMapDisclaimer className={styles.mapDisclaimer} />
        <MapBounds
          bounds={globalBounds}
        />
        <Choropleth riskData={riskData} />
      </Map>
    </div>
  );
}

export default SeasonalRiskMap;
