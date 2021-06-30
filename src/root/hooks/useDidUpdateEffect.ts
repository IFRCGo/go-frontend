import React from 'react';

function useDidUpdateEffect(fn: React.EffectCallback, inputs: React.DependencyList) {
  const didMountRef = React.useRef(false);

  React.useEffect(
    () => {
      if (didMountRef.current) {
        return fn();
      }
      didMountRef.current = true;
      return undefined;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    inputs,
  );
}

export default useDidUpdateEffect;
