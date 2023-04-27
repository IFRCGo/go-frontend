import BlockLoading from '#components/block-loading';
import MeteoSwissEevnt from '#components/RiskImminentEventMap/MeteoSwissEvent';
import useReduxState from '#hooks/useReduxState';
import { _cs } from '@togglecorp/fujs';
import React from 'react';
import styles from './styles.module.scss';

interface Props {
  className: string;
  regionId: number;
}
function ImminentEventsMeteoSwiss(props: Props) {
  const {
    className,
    regionId,
  } = props;

  const allRegions = useReduxState('allRegions');

  const [activeEventUuid, setActiveEventUuid] = React.useState<string | undefined>(undefined);
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);

  const handleEventClick = React.useCallback((eventUuid: string | undefined) => {
    setActiveEventUuid((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }

      return eventUuid;
    });
  }, []);

  // const hasMeteoSwissEvents = response && response.results && response.results.length > 0;
  const hasMeteoSwissEvents = false;
  const pending = false;

  return  (
    <>
      {pending && <BlockLoading />}
      {!pending && (
        // NOTE: check data is empty or not
        <MeteoSwissEevnt
          className={_cs(className, styles.map)}
          sidebarHeading={region?.region_name}
          // hazardList={data}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
        />
      )}
      {!hasMeteoSwissEvents && (
        <div className={styles.emptyMessage}>
          <div className={styles.text}>
            No MeteoSwiss events
          </div>
        </div>
      )}
    </>
  );
}

export default ImminentEventsMeteoSwiss;

