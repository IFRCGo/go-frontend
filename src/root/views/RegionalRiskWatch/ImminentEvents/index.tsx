import React from 'react';

import Container from '#components/Container';
import WikiLink from '#components/WikiLink';
// import RadioInput from '#components/RadioInput';
import ImminentEventsPDC from './ImminentEventsPDC';

import styles from './styles.module.scss';
// import ImminentEventsADAM from './ImminentEventsADAM';

export interface StringValueOption {
  value: string;
  label: string;
}
export type Option = StringValueOption;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;
interface Props {
  className?: string;
  regionId: number;
}

function ImminentEvents(props: Props) {
  const { regionId } = props;

  /* @TEMP
  const [sourceType, setSourceType] = React.useState<string | undefined>("PDC");

  const sourceOptions = React.useMemo(() => {
    return [
      { value: "PDC", label: "PDC" },
      { value: "WFP", label: "WFP ADAM" },
    ] as StringValueOption[];
  }, []);

  const handleChangeSourceType = React.useCallback(
    (value: string | undefined) => setSourceType(value),
    [],
  );
  */

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description={
        <>
          {/* @TEMP
          <RadioInput
            name={"sourceType"}
            options={sourceOptions}
            keySelector={stringOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={sourceType}
            onChange={handleChangeSourceType}
          />
          */}
          <div>
            This map displays information about the modeled impact of specific forecasted or detected natural hazards. By hovering over the icons, if available, you can see the forecasted/observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate.
          </div>
        </>
      }
      descriptionClassName={styles.mapDescription}
      contentClassName={styles.mainContent}
      actions={<WikiLink pathName='user_guide/risk_module#imminent-events' />}
      sub
    >
      {/* @TEMP (sourceType === "PDC") && (
        <ImminentEventsPDC
          className={styles.map}
          regionId={regionId}
        />
      )}
      {(sourceType === "WFP") && (
        <ImminentEventsADAM
          className={styles.map}
          regionId={regionId}
        />
      ) */}
      <ImminentEventsPDC
        className={styles.map}
        regionId={regionId}
      />
    </Container>
  );
}

export default ImminentEvents;
