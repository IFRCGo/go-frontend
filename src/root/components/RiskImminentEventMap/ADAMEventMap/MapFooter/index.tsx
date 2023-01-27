import React from "react";
import {
  COLOR_RED,
  COLOR_YELLOW,
  COLOR_BLUE,
  COLOR_BLACK,
} from '#utils/map';

import InfoPopup from "#components/InfoPopup";
import TextOutput from "#components/TextOutput";
import styles from "./styles.module.scss";

const legendItems = [
  { color: COLOR_RED, label: 'Orange' },
  { color: COLOR_YELLOW, label: 'Green' },
  { color: COLOR_BLUE, label: 'Cones' },
  { color: COLOR_BLACK, label: 'Unknown' },
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
                  These impacts are produced by the WFP ADAM. All-hazards Impact Model (AIM) 3.0.
                </p>
                <div>

                  {/* Note: Add wfp adam link */}
                  Click <a className={styles.pdcLink} target="_blank" href="">here</a> for more information about the model and its inputs.
                </div>
              </>
            )}
          />
        )}
      />
    </div>
  );
}
export default MapFooter;
