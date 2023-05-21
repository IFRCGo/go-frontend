import React from 'react';
import { NumericKeyValuePair, StringKeyValuePair } from '#types/common';
import { useRequest } from '#utils/restRequest';

interface DrefOptions {
  type_of_dref: NumericKeyValuePair[];
}

function transformKeyValueToLabelValue<O extends NumericKeyValuePair | StringKeyValuePair>(o: O): {
  label: string;
  value: O['key'];
} {
  return {
    value: o.key,
    label: o.value,
  };
}

function useDrefApplicationListOptions() {
  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<DrefOptions>({
    url: 'api/v2/dref-options/',
  });

  const drefTypeOptions = React.useMemo(
    () => {
      return drefOptions?.type_of_dref.map(transformKeyValueToLabelValue);
    },[drefOptions]
  );

  return {
    fetchingDrefOptions,
    drefTypeOptions,
  };
}

export default useDrefApplicationListOptions;


