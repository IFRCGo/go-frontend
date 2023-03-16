import React from "react";
import {
  ADAM_COlOR_ORANGE,
  ADAM_COlOR_GREEN,
  ADAM_COlOR_CONES,
  COLOR_BLACK,
  ADAM_COlOR_RED,
} from '#utils/map';

import InfoPopup from "#components/InfoPopup";
import TextOutput from "#components/TextOutput";
import Link from '#components/Link';
import styles from "./styles.module.scss";

const legendItems = [
  { color: ADAM_COlOR_ORANGE, label: 'Orange' },
  { color: ADAM_COlOR_GREEN, label: 'Green' },
  { color: ADAM_COlOR_RED, label: 'Red' },
  { color: ADAM_COlOR_CONES, label: 'Cones' },
  { color: COLOR_BLACK , label: 'Unknown' },
];

function MapFooter() {
  return (
    <div className={styles.footer}>
      <div className={styles.legend}>
        <div className={styles.legendTitle}>
          Alert Level:
        </div>
        {legendItems.map((li) => (
          <div
            key={li.label}
            className={styles.legendItem}
          >
            <div
              className={styles.color}
              style={{ backgroundColor: li.color }}
            />
            <div className={styles.label}>
              {li.label}
            </div>
          </div>
        ))}
      </div>
      <TextOutput
        className={styles.source}
        label="Source"
        value="WFP ADAM"
        description={(
          <InfoPopup
            title="Source: WFP ADAM"
            description={(
              <>
                <p>
                  These data points are recieved from the WFP ADAM, which performs a 24/7 automated data harvesting, analysis and mapping of natural hazards events.
                </p>
                <p>
                  Click <Link href="https://gis.wfp.org/adam/">here</Link> for more information.
                </p>
              </>
            )}
          />
        )}
      />
    </div>
  );
}
export default MapFooter;
