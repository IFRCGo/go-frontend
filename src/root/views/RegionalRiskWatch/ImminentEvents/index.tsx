import React from 'react';

import Container from '#components/Container';
import WikiLink from '#components/WikiLink';
import MapFooter from '#components/RiskImminentEventMap/MapFooter';
import ImminentEventsPDC from './ImminentEventsPDC';
import ImminentEventsADAM from './ImminentEventsADAM';
import ImminentEventsGDACS from './ImminentEventsGDACS';
import ImminentEventsMeteoSwiss from './ImminentEventsMeteoSwiss';

import styles from './styles.module.scss';

const eventDescription = "This map displays information about the modeled impact of specific forecasted or detected natural hazards (floods, storms, droughts, wildfires, earthquakes). By hovering over the icons, if available, you can see the forecasted/observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate.";
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;

export type Option = StringValueOption;
export interface StringValueOption {
  value: string;
  label: React.ReactNode;
}

interface Props {
  className?: string;
  regionId: number;
}

function ImminentEvents(props: Props) {
  const { regionId } = props;
  const [mapSource, setMapSource] = React.useState<string | undefined>("PDC");

  const sourceType = React.useCallback(
    (data?: string) => setMapSource(data),
    [],
  );

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description={
        <div>
          {eventDescription}
        </div>
      }
      descriptionClassName={styles.mapDescription}
      contentClassName={styles.mainContent}
      actions={<WikiLink pathName='user_guide/risk_module#imminent-events' />}
      sub
    >
      {(mapSource === "PDC") && (
        <ImminentEventsPDC
          className={styles.map}
          regionId={regionId}
        />
      )}
      {(mapSource === "WFP") && (
        <ImminentEventsADAM
          className={styles.map}
          regionId={regionId}
        />
      )}
      {(mapSource === "GDACS") && (
        <ImminentEventsGDACS
          className={styles.map}
          regionId={regionId}
        />
      )}
      {(mapSource ==="MeteoSwiss") && (
        <ImminentEventsMeteoSwiss
          className={styles.map}
          regionId={regionId}
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
