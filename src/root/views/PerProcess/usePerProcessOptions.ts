import React from 'react';

import { ObjectSchema, PartialForm } from '@togglecorp/toggle-form';
import { ListResponse, useRequest } from '#utils/restRequest';
import { compareString } from '#utils/utils';
import LanguageContext from '#root/languageContext';

import {
  Country,
  NumericValueOption,
  BooleanValueOption,
  StringKeyValuePair,
  NumericKeyValuePair,
} from '#types';
import {
  requiredCondition,
  emailCondition,
} from '#utils/form';

import {
  PerAssessmentForm,
  emptyNumericOptionList,
  PerOverviewFields,
  WorkPlanComponent,
} from './common';

export type OverviewFormSchema = ObjectSchema<PartialForm<PerOverviewFields>>;
export type OverviewFormSchemaFields = ReturnType<OverviewFormSchema['fields']>;

export type AssessmentFormScheme = ObjectSchema<PartialForm<PerAssessmentForm>>;
export type AssessmentFormSchemeFields = ReturnType<AssessmentFormScheme['fields']>;

export type WorkPlanFormScheme = ObjectSchema<PartialForm<WorkPlanComponent>>;
export type WorkPlanFormSchemeFields = ReturnType<WorkPlanFormScheme['fields']>;

function transformKeyValueToLabelValue<O extends NumericKeyValuePair | StringKeyValuePair>(o: O): {
  label: string;
  value: O['key'];
} {
  return {
    value: o.key,
    label: o.value,
  };
}

export const overviewSchema: OverviewFormSchema = {
  fields: (value): OverviewFormSchemaFields => ({
    id: [],
    type_of_assessment_details: [],
    country_details: [],
    date_of_orientation: [],
    orientation_document: [],
    assessment_number: [],
    branches_involved: [],
    date_of_assessment: [requiredCondition],
    method_asmt_used: [],
    assess_urban_aspect_of_country: [],
    assess_climate_environment_of_country: [],
    date_of_previous_assessment: [],
    type_of_per_assessment: [],
    facilitator_name: [],
    facilitator_email: [emailCondition],
    facilitator_phone: [],
    facilitator_contact: [],
    is_epi: [],
    ns_focal_point_name: [],
    ns_focal_point_email: [emailCondition],
    ns_focal_point_phone: [],
    partner_focal_point_name: [],
    partner_focal_point_email: [emailCondition],
    partner_focal_point_phone: [],
    partner_focal_point_organization: [],
    type_of_assessment: [],
    national_society: [requiredCondition],
    ns_second_focal_point_name: [],
    ns_second_focal_point_email: [],
    ns_second_focal_point_phone: [],
  })
};

export const assessmentSchema: AssessmentFormScheme = {
  fields: (value): AssessmentFormSchemeFields => ({
    id: [],
    components: {
      keySelector: (val) => val.componentId as string,
      member: () => ({
        fields: () => ({
          id: [],
          component_num: [],
          componentId: [],
          status: [],
          benchmarks: {
            keySelector: (n) => n.benchmarkId as string,
            member: () => ({
              fields: () => ({
                id: [],
                benchmarkId: [],
                notes: [],
                is_benchmark: [],
              }),
            }),
          },
        }),
      }),
    },
  }),
};

export const workplanSchema: WorkPlanFormScheme = {
  fields: (value): WorkPlanFormSchemeFields => ({
    actions: [],
    area: [],
    component: [],
    responsible_email: [],
    responsible_name: [],
    status: [],
    due_date: [],
  })
};

function usePerProcessOptions(value: PartialForm<PerOverviewFields>) {
  const { strings } = React.useContext(LanguageContext);

  const {
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
  });

  const [
    nationalSocietyOptions,
  ] = React.useMemo(() => {
    if (!countriesResponse) {
      return [emptyNumericOptionList, emptyNumericOptionList];
    }

    const ns: NumericValueOption[] = countriesResponse.results
      .filter(d => d.independent && d.society_name)
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);

    const c: NumericValueOption[] = countriesResponse.results
      .filter(d => d.independent && d.iso)
      .map(d => ({
        value: d.id,
        label: d.name,
      })).sort(compareString);

    return [ns, c] as const;
  }, [countriesResponse]);

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: true, label: strings.yesLabel },
      { value: false, label: strings.noLabel },
    ] as BooleanValueOption[];
  }, [strings]);

  return {
    nationalSocietyOptions,
    yesNoOptions,
  };
}

export default usePerProcessOptions;
