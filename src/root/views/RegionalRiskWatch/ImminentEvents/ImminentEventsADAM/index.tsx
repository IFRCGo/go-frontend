import React from 'react';

interface Props {
  className?: string;
  regionId: number;
}

function ImminentEventsADAM(props: Props) {
  const {
    className,
    regionId,
  } = props;

  return (
    <div className={className}>
      ImminentEventSourceADAM {regionId}
    </div>
  );
}

export default ImminentEventsADAM;
