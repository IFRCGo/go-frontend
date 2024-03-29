import React from 'react';
import { NumericKeyValuePair, StringKeyValuePair } from '#types/common';
import { useRequest } from '#utils/restRequest';

export interface BaseProps {
  drefId: number;
  initial_row: boolean;
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
  status: number;
  status_display: string;
  has_ops_update: boolean;
  has_final_reprot: boolean;
  unpublished_op_update_count: number;
  unpublished_final_report_count: number;
  date_of_approval: string;
  country_details: {
    id: number;
    country: number;
    district: number[];
    name: string;
  };
}

export interface ActiveDrefTableDetail extends BaseProps {
  firstLevel: BaseProps[];
  secondLevel: BaseProps[];
}

export interface CompletedDrefDetails extends BaseProps {
  operational_update_details: BaseProps[];
  final_report_details: BaseProps[];
}

export interface CompletedDrefResponse extends BaseProps {
  dref: CompletedDrefDetails;
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


