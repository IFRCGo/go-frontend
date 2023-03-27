import React from "react";
import InfoPopup from "#components/InfoPopup";
import TextOutput from "#components/TextOutput";
import {
  COLOR_CYCLONE,
  COLOR_DROUGHT,
  COLOR_EARTHQUAKE,
  COLOR_FLOOD,
  COLOR_STORM,
} from "#utils/risk";
import styles from "./styles.module.scss";

const legendItems = [
  { color: COLOR_EARTHQUAKE, label: 'Earthquake' },
  { color: COLOR_FLOOD, label: 'Flood' },
  { color: COLOR_CYCLONE, label: 'Cyclone' },
  { color: COLOR_STORM, label: 'Storm' },
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
            value="Pacific Disaster Center"
            description={(
              <InfoPopup
                title="Source: Pacific Disaster Center"
                description={(
                  <>
                    <p>
                      These impacts are produced by the Pacific Disaster Center's All-hazards Impact Model (AIM) 3.0.
                    </p>
                    <div>
                      Click <a className={styles.pdcLink} target="_blank" href="https://www.pdc.org/wp-content/uploads/AIM-3-Fact-Sheet-Screen-1.pdf">here</a> for more information about the model and its inputs.
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
