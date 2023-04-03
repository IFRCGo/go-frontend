import React from 'react';
import { MapImage } from '@togglecorp/re-map';

import {
  imminentHazardTypeToIconMap,
  pointImageOptions,
} from '#utils/risk';
import { ImminentHazardTypes } from '#types';

interface Props<HK> {
  hazardKey: HK,
  onLoad: (hazardKey: HK) => void,
}

function HazardMapImage<HK extends ImminentHazardTypes>(props: Props<HK>) {
  const {
    hazardKey,
    onLoad,
  } = props;

  const handleLoad = React.useCallback(() => {
    if (onLoad) {
      onLoad(hazardKey);
    }
  }, [hazardKey, onLoad]);

  return (
    <MapImage
      name={`${hazardKey}-icon`}
      url={imminentHazardTypeToIconMap[hazardKey]}
      onLoad={handleLoad}
      imageOptions={pointImageOptions}
    />
  );
}

export default HazardMapImage;
