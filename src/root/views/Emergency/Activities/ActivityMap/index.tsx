import React from 'react';
import Map, {
  MapContainer,
  // MapSource,
  // MapLayer,
  MapBounds,
  // MapTooltip
  MapChildContext,
} from '@togglecorp/re-map';
import {
  _cs,
  listToMap,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';
import useReduxState from '#hooks/useReduxState';
import {
  defaultMapStyle,
  defaultMapOptions,
  COLOR_RED,
  COLOR_LIGHT_GREY,
  COLOR_BLUE,
  COLOR_ORANGE,
  COLOR_YELLOW,
} from '#utils/map';

import styles from './styles.module.scss';

interface ChoroplethProps {
  projectCountByDistrict: Record<number, number>;
}

function Choropleth(props: ChoroplethProps) {
  const { projectCountByDistrict } = props;
  const mc = React.useContext(MapChildContext);

  if (!mc || !mc.map || !mc.map.isStyleLoaded() || !projectCountByDistrict) {
    return null;
  }

  const colorProperty: (string | number | string[])[] = [
    'match',
    ['get', 'district_id'],
  ];

  const labelColorProperty: (string | number | string[])[] = [
    'match',
    ['get', 'district_id'],
  ];

  const labelHaloWidthProperty: (string | number | string[])[] = [
    'match',
    ['get', 'district_id'],
  ];

  const getColorForValue = (value: number) => {
    if (value > 0) {
      return COLOR_BLUE;
    }

    if (value > 3) {
      return COLOR_YELLOW;
    }

    if (value > 10) {
      return COLOR_ORANGE;
    }

    if (value > 50) {
      return COLOR_RED;
    }

    return COLOR_LIGHT_GREY;
  };

  const districtKeys = Object.keys(projectCountByDistrict) as string[];
  districtKeys.forEach((dk) => {
    colorProperty.push(+dk);
    colorProperty.push(
      getColorForValue(projectCountByDistrict[+dk])
    );
    labelColorProperty.push(+dk);
    labelColorProperty.push('#ffffff');

    labelHaloWidthProperty.push(+dk);
    labelHaloWidthProperty.push(0);
  });

  colorProperty.push(COLOR_LIGHT_GREY);
  labelColorProperty.push('#707070');
  labelHaloWidthProperty.push(1);

  mc.map.setPaintProperty(
    'admin-1-highlight',
    'fill-opacity',
    1,
  );

  mc.map.setPaintProperty(
    'admin-1-highlight',
    'fill-color',
    colorProperty,
  );

  mc.map.setPaintProperty(
    'admin-1-label',
    'text-color',
    labelColorProperty,
  );

  mc.map.setPaintProperty(
    'admin-1-label',
    'text-halo-width',
    labelHaloWidthProperty,
  );

  mc.map.setPaintProperty(
    'admin-1-label',
    'text-halo-blur',
    labelHaloWidthProperty,
  );

  mc.map.setLayoutProperty(
    'admin-1-highlight',
    'visibility',
    'visible',
  );

  return null;
}

interface Props {
  className?: string;
  countryIdList: number[];
  projectCountByDistrict: Record<number, number>;
}

function ActivityMap(props: Props) {
  const {
    className,
    countryIdList = [],
    projectCountByDistrict,
  } = props;

  const allCountries = useReduxState('allCountries');
  const activityBounds= React.useMemo(() => {
    const countryIdMap = listToMap(countryIdList, d => d, d => true);
    const coordinateList = allCountries?.data.results
      .filter(c => !!countryIdMap[c.id])
      .map(c => c.bbox)
      .map(b => b.coordinates);

    const bbox = turfBbox({
      type: 'MultiPolygon',
      coordinates: coordinateList.filter(Boolean),
    });

    return bbox as [number, number, number, number];
  }, [allCountries, countryIdList]);


  return (
    <div className={_cs(styles.activityMap, className)}>
      <Map
        mapStyle={defaultMapStyle}
        mapOptions={defaultMapOptions}
        navControlShown
        navControlPosition="top-right"
      >
        <MapContainer className={styles.mapContainer} />
        <MapBounds
          bounds={activityBounds}
        />
        <Choropleth
          projectCountByDistrict={projectCountByDistrict}
        />
      </Map>
    </div>
  );
}

export default ActivityMap;
