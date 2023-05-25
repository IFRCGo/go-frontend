import React from 'react';
import { NumericKeyValuePair, StringKeyValuePair } from '#types/common';
import { useRequest } from '#utils/restRequest';

export interface BaseProps {
  id: number;
  title: string;
  appeal_code: string;
  created_at: string;
  submission_to_geneva: string;
  is_published: boolean;
  type_of_dref?: number;
  type_of_dref_display: string;
  type_of_onset_display: string;
  operational_update_number: number;
  application_type: string;
  application_type_display: string;
  status: string;
  has_ops_update: boolean;
  has_final_reprot: boolean;
  unpublished_op_update_count: number;
  unpublished_final_report_count: number;
  country_details: {
    id: number;
    country: number;
    district: number[];
    name: string;
  };
}

export interface TableDataDetail extends BaseProps {
  firstLevel: BaseProps[];
  secondLevel: BaseProps[];
}

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


