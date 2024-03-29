import React from 'react';
import { _cs } from '@togglecorp/fujs';

import InfoPopup from '#components/InfoPopup';
import Link from '#components/Link';

import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function GoMapDisclaimer(props: Props) {
  const {
    className,
  } = props;

  return (
    <InfoPopup
      infoLabel="Map Sources: ICRC, UN CODs"
      className={_cs(styles.goMapDisclaimer, className)}
      description={(
        <>
          <p>
            The maps used do not imply the expression of any opinion on the part of the International Federation of Red Cross and Red Crescent Societies or National Society concerning the legal status of a territory or of its authorities.
          </p>
          <p>
            Map Sources: ICRC, <Link href="https://cod.unocha.org/">UNCODs</Link>
          </p>
          <div
            className={_cs(styles.attribution, "mapboxgl-ctrl-attrib-inner")}
            role="list"
          >
            <Link
              href="https://www.mapbox.com/about/maps/"
              title="Mapbox"
              aria-label="Mapbox"
              role="listitem"
            >
              © Mapbox
            </Link>
            <Link
              href="https://www.openstreetmap.org/about/"
              title="OpenStreetMap"
              aria-label="OpenStreetMap"
              role="listitem"
            >
              © OpenStreetMap
            </Link>
            <Link
              className="mapbox-improve-map"
              href={`https://apps.mapbox.com/feedback/?owner=go-ifrc&amp;id=ckrfe16ru4c8718phmckdfjh0&amp;access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
              title="Map feedback"
              aria-label="Map feedback"
              role="listitem"
            >
              Improve this map
            </Link>
          </div>
        </>
      )}
    />
  );
}

export default GoMapDisclaimer;
