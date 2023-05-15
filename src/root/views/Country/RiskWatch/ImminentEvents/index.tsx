import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';

import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import MapFooter from '#components/RiskImminentEventMap/MapFooter';
import ImminentEventsADAM from './ImminentEventsADAM';
import ImminentEventsPDC from './ImminentEventsPDC';
import ImminentEventsGDACS from '../ImminentEventsGDACS';

import styles from './styles.module.scss';

export interface StringValueOption {
  value: string;
  label: string;
}
export type Option = StringValueOption;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;

interface Props {
  className?: string;
  countryId: number;
}
const titleDescription = "This map displays information about the modeled impact of specific forecasted or detected natural hazards.By hovering over the icons, if available, you can see the forecasted / observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate.";
function ImminentEvents(props: Props) {
  const { countryId } = props;
  const [numWfpEvents, setNumWfpEvents] = React.useState<number | undefined>();
  const [numPdcEvents, setNumPdcEvents] = React.useState<number | undefined>();
  const [mapSource, setMapSource] = React.useState<string | undefined>("PDC");
  const triggered = React.useRef(false);

  const sourceType = React.useCallback(
    (data?: string) => setMapSource(data),
    [],
  );

  // FIXME: handle for GDACS and other sources
  const handlePdcEventLoad = React.useCallback((numEvents: number | undefined) => {
    if (!numEvents && triggered.current === false) {
      sourceType('WFP');
      triggered.current = true;
    }
    setNumPdcEvents(numEvents ?? 0);
  }, [sourceType, triggered]);

  const handleWfpEventLoad = React.useCallback((numEvents: number | undefined) => {
    if (!numEvents && triggered.current === false) {
      sourceType('PDC');
      triggered.current = true;
    }
    setNumWfpEvents(numEvents ?? 0);
  }, [sourceType, triggered]);

  if (numWfpEvents === 0 && numPdcEvents === 0) {
    return null;
  }

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description={
        <div>
          {titleDescription}
        </div>
      }
      descriptionClassName={styles.mapDescription}
      contentClassName={styles.mainContent}
      sub
    >
      {isNotDefined(numPdcEvents) && isNotDefined(numPdcEvents) && (
        <BlockLoading className={styles.blockLoading}/>
      )}
      {mapSource === "PDC" && (
        <ImminentEventsPDC
          className={styles.map}
          countryId={countryId}
          onLoad={handlePdcEventLoad}
        />
      )}
      {mapSource === "WFP" && (
        <ImminentEventsADAM
          className={styles.map}
          countryId={countryId}
          onLoad={handleWfpEventLoad}
        />
      )}
      {(mapSource === "GDACS") && (
        <ImminentEventsGDACS
          className={styles.map}
          countryId={countryId}
        />
      )}
      <MapFooter
        sourceType={mapSource}
        onSourceChange={sourceType}
      />
    </Container>
  );
}

export default ImminentEvents;
