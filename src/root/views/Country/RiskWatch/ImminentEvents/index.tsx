import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';

import Container from '#components/Container';
import RadioInput from '#components/RadioInput';
import BlockLoading from '#components/block-loading';

import ImminentEventsADAM from './ImminentEventsADAM';
import ImminentEventsPDC from './ImminentEventsPDC';

import styles from './styles.module.scss';

export interface StringValueOption {
  value: string;
  label: string;
}
export type Option = StringValueOption;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;

const sourceOptions = [
  { value: "PDC", label: "PDC" },
  { value: "WFP", label: "WFP ADAM" },
];


interface Props {
  className?: string;
  countryId: number;
}
const titleDescription = "This map displays information about the modeled impact of specific forecasted or detected natural hazards.By hovering over the icons, if available, you can see the forecasted / observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate.";
function ImminentEvents(props: Props) {
  const { countryId } = props;
  const [sourceType, setSourceType] = React.useState<string | undefined>("PDC");
  const [numWfpEvents, setNumWfpEvents] = React.useState<number | undefined>();
  const [numPdcEvents, setNumPdcEvents] = React.useState<number | undefined>();

  const handleChangeSourceType = React.useCallback(
    (value: string | undefined) => setSourceType(value),
    [],
  );

  const handlePdcEventLoad = React.useCallback((numEvents: number | undefined) => {
    if (!numEvents) {
      setSourceType('WFP');
    }
    setNumPdcEvents(numEvents ?? 0);
  }, []);

  const handleWfpEventLoad = React.useCallback((numEvents: number | undefined) => {
    setNumWfpEvents(numEvents ?? 0);
  }, []);

  if (numWfpEvents === 0 && numPdcEvents === 0) {
    return null;
  }

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description={
        <>
          <RadioInput
            name={"sourceType"}
            options={sourceOptions}
            keySelector={stringOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={sourceType}
            onChange={handleChangeSourceType}
          />
          {titleDescription}
        </>
      }
      descriptionClassName={styles.mapDescription}
      contentClassName={styles.mainContent}
      sub
    >
      {isNotDefined(numPdcEvents) && isNotDefined(numPdcEvents) && (
        <BlockLoading className={styles.blockLoading}/>
      )}
      {sourceType === "PDC" && (
        <ImminentEventsPDC
          className={styles.map}
          countryId={countryId}
          onLoad={handlePdcEventLoad}
        />
      )}
      {sourceType === "WFP" && (
        <ImminentEventsADAM
          className={styles.map}
          countryId={countryId}
          onLoad={handleWfpEventLoad}
        />
      )}
    </Container>
  );
}

export default ImminentEvents;
