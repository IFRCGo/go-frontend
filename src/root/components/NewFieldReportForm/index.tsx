import React from 'react';
import Page from '#components/draft/Page';
import {
  useForm,
  createSubmitHandler,
  PartialForm,
} from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';

import BreadCrumb from '#components/breadcrumb';
import NonFieldError from '#components/draft/NonFieldError';

import {
} from '#utils/field-report-constants';

import LanguageContext from '#root/languageContext';

import ContextFields from './ContextFields';
import SituationFields from './SituationFields';
import RiskAnalysisFields from './RiskAnalysisFields';
import ActionsFields from './ActionsFields';
import EarlyActionsFields from './EarlyActionsFields';
import ResponseFields from './ResponseFields';

import useFieldReportOptions, { schema } from './useFieldReportOptions';
import {
  STATUS_EVENT,
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
  VISIBILITY_PUBLIC,
  FormType,
  transformFormFieldsToAPIFields,
} from './common';
import styles from './styles.module.scss';

const defaultFormValues: PartialForm<FormType> = {
  status: STATUS_EVENT,
  is_covid_report: false,
  visibility: VISIBILITY_PUBLIC,
};


interface Props {
  className?: string;
  history: {
    push: (url: string) => void;
  };
  location: {
    pathname: string;
  };
}

function NewFieldReportForm(props: Props) {
  const {
    className,
    location,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const crumbs = React.useMemo(() => [
    {link: location?.pathname, name: 'Create new field report'},
    {link: '/', name: strings.breadCrumbHome},
  ], [strings.breadCrumbHome, location]);

  const {
    value,
    error,
    onValueChange,
    validate,
    onErrorSet,
    onValueSet,
  } = useForm(defaultFormValues, schema);

  const {
    orgGroupedActionForCurrentReport,
    disasterTypeOptions,
    yesNoOptions,
    statusOptions,
    bulletinOptions,
    countryOptions,
    districtOptions,
    fetchingCountries,
    fetchingDistricts,
    reportType,
    supportedActivityOptions,
    externalPartnerOptions,
    sourceOptions,
  } = useFieldReportOptions(value);

  const handleSubmit = React.useCallback((finalValues) => {
    onValueSet(finalValues);

    const apiFields = transformFormFieldsToAPIFields(finalValues as FormType);

    const definedValues = (Object.keys(apiFields) as (keyof PartialForm<FormType>)[]).reduce((acc, key) => {
      const newAcc = { ...acc } as PartialForm<FormType>;

      if (finalValues[key] !== null) {
        newAcc[key] = finalValues[key];
      }

      return newAcc;
    }, {});

    console.info(definedValues);
  }, [onValueSet]);

  React.useEffect(() => {
    if (value.status === STATUS_EARLY_WARNING) {
      onValueChange(false, 'is_covid_report');

      if (value.dtype === DISASTER_TYPE_EPIDEMIC) {
        onValueChange(undefined, 'dtype');
      }
    }
  }, [value.status, onValueChange, value.dtype]);

  React.useEffect(() => {
    if (value.is_covid_report) {
      onValueChange(DISASTER_TYPE_EPIDEMIC, 'dtype');
    }
  }, [value.is_covid_report, onValueChange]);

  return (
    <Page
      className={_cs(styles.newFieldReportForm, className)}
      title="IFRC GO - New Field Report"
      heading="Create Field Report"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <form
        onSubmit={createSubmitHandler(validate, onErrorSet, handleSubmit)}
      >
        <NonFieldError error={error} />
        <hr />
        <ContextFields
          error={error}
          onValueChange={onValueChange}
          statusOptions={statusOptions}
          value={value}
          yesNoOptions={yesNoOptions}
          disasterTypeOptions={disasterTypeOptions}
          reportType={reportType}
          countryOptions={countryOptions}
          districtOptions={districtOptions}
          fetchingCountries={fetchingCountries}
          fetchingDistricts={fetchingDistricts}
        />
        <hr />
        {value.status === STATUS_EVENT && (
          <>
            <SituationFields
              sourceOptions={sourceOptions}
              reportType={reportType}
              error={error}
              onValueChange={onValueChange}
              value={value}
            />
            <hr />
            <ActionsFields
              bulletinOptions={bulletinOptions}
              actionOptions={orgGroupedActionForCurrentReport}
              reportType={reportType}
              error={error}
              onValueChange={onValueChange}
              value={value}
              externalPartnerOptions={externalPartnerOptions}
              supportedActivityOptions={supportedActivityOptions}
            />
          </>
        )}
        {value.status === STATUS_EARLY_WARNING && (
          <>
            <RiskAnalysisFields
              sourceOptions={sourceOptions}
              error={error}
              onValueChange={onValueChange}
              value={value}
            />
            <hr />
            <EarlyActionsFields
              bulletinOptions={bulletinOptions}
              options={orgGroupedActionForCurrentReport}
              error={error}
              onValueChange={onValueChange}
              value={value}
            />
          </>
        )}
        <ResponseFields
          reportType={reportType}
          error={error}
          onValueChange={onValueChange}
          value={value}
        />
        <button type="submit">
          Submit
        </button>
      </form>
    </Page>
  );
}

export default NewFieldReportForm;
