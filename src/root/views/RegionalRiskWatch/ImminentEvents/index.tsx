import React from 'react';

import Container from '#components/Container';
import WikiLink from '#components/WikiLink';
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
  regionId: number;
}

function ImminentEvents(props: Props) {
  const { regionId } = props;

  //TODO: will continue after complete on country page
  // const [sourceType, setSourceType] = React.useState<string | undefined>("PDC");
  // const {
  //   pending: adamResponsePending,
  //   response: adamResponse,
  // } = useRequest({
  //   skip: isNotDefined(regionId),
  //   url: 'risk://api/v1/adam-exposure',
  //   query: {
  //     region: regionId,
  //   },
  // });

  // const yesNoOptions = React.useMemo(() => {
  //   return [
  //     { value: "PDC", label: "PDC" },
  //     { value: "WFP", label: "WFP ADAM" },
  //   ] as StringValueOption[];
  // }, []);

  // const handleChangeSourceType = React.useCallback(
  //   (value: string | undefined) => setSourceType(value),
  //   [],
  // );

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description={
        <>
          {/* <RadioInput
            name={"sourceType"}
            options={yesNoOptions}
            keySelector={stringOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={sourceType}
            onChange={handleChangeSourceType}
          /> */}
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
      <ImminentEventsPDC
        className={styles.map}
        regionId={regionId}
      />
      {/* TODO
       {(sourceType === "PDC") && (
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
      )} */}
    </Container>
  );
}

export default ImminentEvents;
