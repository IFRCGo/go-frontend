import React from "react";
import InfoPopup from "#components/InfoPopup";
import TextOutput from "#components/TextOutput";
import Link from '#components/Link';
import {
  COLOR_CYCLONE,
  COLOR_DROUGHT,
  COLOR_EARTHQUAKE,
  COLOR_FLOOD,
} from "#utils/risk";
import styles from "./styles.module.scss";

const legendItems = [
  { color: COLOR_FLOOD, label: 'Flood' },
  { color: COLOR_CYCLONE, label: 'Cyclone/Storm' },
  { color: COLOR_EARTHQUAKE, label: 'Earthquake' },
  { color: COLOR_DROUGHT, label: 'Drought' },
];

function MapFooter() {
  return (
    <div className={styles.footer}>
      <div className={styles.legend}>
        <div className={styles.legendTitle}>
          Types of Hazards:
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
