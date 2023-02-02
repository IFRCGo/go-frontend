import React from 'react';

import Container from '#components/Container';
import RadioInput from '#components/RadioInput';
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

interface Props {
  className?: string;
  countryId: number;
}
const titleDescription = "This map displays information about the modeled impact of specific forecasted or detected natural hazards.By hovering over the icons, if available, you can see the forecasted / observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate.";
function ImminentEvents(props: Props) {
  const { countryId } = props;

  const [sourceType, setSourceType] = React.useState<string | undefined>("PDC");

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: "PDC", label: "PDC" },
      { value: "WFP", label: "WFP ADAM" },
    ] as StringValueOption[];
  }, []);

  const handleChangeSourceType = React.useCallback(
    (value: string | undefined) => setSourceType(value),
    [],
  );

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description={
        <>
          <div>
            <RadioInput
              name={"sourceType"}
              options={yesNoOptions}
              keySelector={stringOptionKeySelector}
              labelSelector={optionLabelSelector}
              value={sourceType}
              onChange={handleChangeSourceType}
            />
          </div>
          <div>{titleDescription}</div>
        </>
      }
      descriptionClassName={styles.mapDescription}
      contentClassName={styles.mainContent}
      sub
    >
      {sourceType === "PDC" && (
        <ImminentEventsPDC
          className={styles.map}
          countryId={countryId}
        />
      )}
      {sourceType === "WFP" && (
        <ImminentEventsADAM
          className={styles.map}
          countryId={countryId}
        />
      )}
    </Container>
  );
}

export default ImminentEvents;
