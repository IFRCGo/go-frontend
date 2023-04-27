import GoMapDisclaimer from '#components/GoMapDisclaimer';
import { defaultMapOptions, defaultMapStyle } from '#utils/map';
import { _cs } from '@togglecorp/fujs';
import Map, { MapContainer } from '@togglecorp/re-map';
import React from 'react';

import styles from './styles.module.scss';

const footprintLayerOptions = {
  type: 'fill',
  paint: {
    // 'fill-color': alertLevelFillColorPaint,
    'fill-color': '',
  },
  filter: ['==', ['get', 'type'], 'MultiPolygon'],
};

const mapPadding = {
  left: 0,
  top: 0,
  right: 320,
  bottom: 50,
};

const MAP_BOUNDS_ANIMATION_DURATION = 1800;

interface Props {
  className?: string;
  // hazardList: MeteoSwissEvent[];
  activeEventUuid: string | undefined;
  onActiveEventChange: (eventUuid: string | undefined) => void;
  sidebarHeading?: React.ReactNode;
}

function MeteoSwissEevnt(props: Props) {
  const {
    className,
    // hazardList,
    activeEventUuid,
    onActiveEventChange,
    sidebarHeading,
  } = props;

  return(
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-left"
    >
      <div className={_cs(styles.mapContainer, className)}>
        <div className={styles.wrapperForSidebar}>
          <MapContainer className={styles.map} />
          {/* <Sidebar
            heading={sidebarHeading}
            className={styles.sidebar}
            hazardList={hazardList}
            onActiveEventChange={onActiveEventChange}
            activeEventUuid={activeEventUuid}
          /> */}
          <GoMapDisclaimer className={styles.mapDisclaimer} />
        </div>
      </div>
      </Map>
  );
}

export default MeteoSwissEevnt;

