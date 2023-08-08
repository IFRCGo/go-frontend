import React from "react";
import { Tooltip } from "react-tooltip";
import { IoInformationCircleOutline } from "react-icons/io5";
import ReactDOMServer from 'react-dom/server';
import TextOutput from "#components/TextOutput";
import Link from '#components/Link';
import {
  COLOR_STORM,
  COLOR_DROUGHT,
  COLOR_EARTHQUAKE,
  COLOR_FLOOD,
  COLOR_WILDFIRE,
} from "#utils/risk";
import RadioInput from "#components/RadioInput";
import {
  optionLabelSelector,
  stringOptionKeySelector,
  StringValueOption
} from "#views/RegionalRiskWatch/ImminentEvents";
import Container from "#components/Container";

import styles from "./styles.module.scss";

const gdacsPopupTitle = " Source: GDACS";
const gdacsPopupDescription = (
  <p>
    Click <Link
      target="_blank"
      href="https://www.gdacs.org/default.aspx"
    >
      here
    </Link> for more information about the model and its inputs.
  </p>
);

const meteoSwissPopupTitle = "Source: MeteoSwiss";
const meteoSwissPopupDescription = (
  <>
    <p>
      This impact estimates are produced by MeteoSwiss HydroMet Impact Outlook. © 2022 MeteoSwiss. All Rights reserved.
    </p>
    <p>
      Disclaimer: HydroMet Impact Outlook is in a pilot phase. MeteoSwiss makes no warranty with respect to the correctness or completeness of this information.
      This information does not replace the advice and guidance provided by the official meteorological and hydrological services for these regions. For further information click&nbsp;
      <Link
        target="_blank"
        href="https://www.meteoswiss.admin.ch/about-us/research-and-cooperation/projects/2021/weather4un.html"
      >
        [here]
      </Link>
    </p>
  </>
);

const pdcPopupTitle ="Source: Pacific Disaster Center";
const pdcPopupDescription = (
  <>
    <p>
      These impacts are produced by the Pacific Disaster Center's All-hazards Impact Model (AIM) 3.0.
    </p>
    <p>
      Click <Link
        target="_blank"
        href="https://www.pdc.org/wp-content/uploads/AIM-3-Fact-Sheet-Screen-1.pdf"
      >
        here
      </Link> for more information about the model and its inputs.
    </p>
  </>
);

const adamPopupTitle = "Source: WFP ADAM";
const adamPopupDescription = (
  <>
    <p>
      These data points are recieved from the WFP ADAM, which performs a 24/7 automated data harvesting, analysis and mapping of natural hazards events.
    </p>
    <p>
      Click <Link
        target="_blank"
        href="https://gis.wfp.org/adam/"
      >
        here
      </Link> for more information.
    </p>
  </>
);

const pdcIconLabel = (
  <div className={styles.sourceLabel}>
    <TextOutput value="PDC" />
    <React.Fragment>
      <IoInformationCircleOutline
        data-event="click"
        data-tooltip-id="pdc"
        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
          tooltip(pdcPopupTitle, pdcPopupDescription)
        )}
      />
      <Tooltip
        className={styles.tooltip}
        id="pdc"
        place="top"
        clickable={true}
      />
    </React.Fragment>
  </div>
);

const adamIconLabel = (
  <div className={styles.sourceLabel}>
    <TextOutput value="WFP ADAM" />
    <React.Fragment>
      <IoInformationCircleOutline
        data-event="click"
        data-tooltip-id="adam"
        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
          tooltip(adamPopupTitle, adamPopupDescription)
        )}
      />
      <Tooltip
        className={styles.tooltip}
        id="adam"
        place="top"
        clickable={true}
      />
    </React.Fragment>
  </div>
);

const gdacsIconLabel = (
  <div className={styles.sourceLabel}>
    <TextOutput value="GDACS" />
    <React.Fragment>
      <IoInformationCircleOutline
        data-event="click"
        data-tooltip-id="gdacs"
        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
          tooltip(gdacsPopupTitle, gdacsPopupDescription)
        )}
      />
      <Tooltip
        className={styles.tooltip}
        id="gdacs"
        place="top"
        clickable={true}
      />
    </React.Fragment>
  </div>
);

const meteoSwissIconLabel = (
  <div className={styles.sourceLabel}>
    <TextOutput value="MeteoSwiss" />
    <React.Fragment>
      <IoInformationCircleOutline
        data-event="click"
        data-tooltip-id="ms"
        data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
          tooltip(meteoSwissPopupTitle, meteoSwissPopupDescription)
        )}
      />
      <Tooltip
        className={styles.tooltip}
        id="ms"
        place="top"
        clickable={true}
      />
    </React.Fragment>
  </div>
);

const legendItems = [
  { color: COLOR_FLOOD, label: 'Flood' },
  { color: COLOR_STORM, label: 'Storm' },
  { color: COLOR_EARTHQUAKE, label: 'Earthquake' },
  { color: COLOR_DROUGHT, label: 'Drought' },
  { color: COLOR_WILDFIRE, label: 'Wildfire' }
];

function tooltip(title:string, description: React.ReactNode) {
  return (
    <Container
      heading={title}
      contentClassName={styles.tooltipContent}
      hideHeaderBorder
      sub
    >
      {description}
    </Container>
  );
}

interface Props {
  sourceType?: string;
  onSourceChange: (source?: string) => void;
}

function MapFooter(props: Props) {
  const {
    sourceType,
    onSourceChange,
  } = props;

  const sourceOptions =[
    { value: "PDC", label: pdcIconLabel },
    { value: "WFP", label: adamIconLabel },
    { value: "GDACS", label: gdacsIconLabel },
    { value: "MeteoSwiss", label: meteoSwissIconLabel },
  ] as StringValueOption[];

  const handleChangeSourceType = React.useCallback(
    (value?: string) => {
      onSourceChange(value);
    },[onSourceChange],
  );

  return (
    <div className={styles.footer}>
      <div className={styles.legend}>
        <div className={styles.legendContent}>
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
        <div>
          <RadioInput
            className={styles.sourceContainer}
            label="Source: "
            name={"sourceType"}
            options={sourceOptions}
            keySelector={stringOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={sourceType}
            onChange={handleChangeSourceType}
          />
        </div>
      </div>
    </div>
  );
}
export default MapFooter;

