import React from 'react';
import {
  _cs,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapBounds,
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import useReduxState from '#hooks/useReduxState';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import {
  defaultMapStyle,
  defaultMapOptions,
  fixBounds,
} from '#utils/map';
import Choropleth from './Choropleth';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  regionId?: number;
  riskData: { iso3: string, value: number }[];
}

function SeasonalRiskMap(props: Props) {
  const {
    className,
    regionId,
    riskData,
  } = props;

  const allRegions = useReduxState('allRegions');
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);

  const regionBounds = React.useMemo(
    () => fixBounds(turfBbox(region?.bbox ?? [])),
    [region?.bbox],
  );

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
          // @ts-ignore
          bounds={regionBounds}
        />
        <Choropleth riskData={riskData} />
      </Map>
    </div>
  );
}

export default SeasonalRiskMap;
