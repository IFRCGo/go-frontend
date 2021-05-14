import React from 'react';
import Page from '#components/draft/Page';
import {
  useForm,
  createSubmitHandler,
  PartialForm,
} from '@togglecorp/toggle-form';
// import { _cs } from '@togglecorp/fujs';

import BreadCrumb from '#components/breadcrumb';
import Container from '#components/draft/Container';
import NonFieldError from '#components/draft/NonFieldError';

import {
  STATUS_EVENT,
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
} from '#utils/field-report-constants';

import LanguageContext from '#root/languageContext';

import ContextFields from './ContextFields';
import SituationFields from './SituationFields';
import RiskAnalysisFields from './RiskAnalysisFields';
import ActionsFields from './ActionsFields';

import useFieldReportOptions, { schema } from './useFieldReportOptions';
import { FormType } from './common';

const defaultFormValues: PartialForm<FormType> = {
  status: STATUS_EVENT,
  is_covid_report: 'false',
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
    actionOptions,
    disasterTypeOptions,
    yesNoOptions,
    statusOptions,
    // sourceOptions,
    // estimationFields,
    reportType,
  } = useFieldReportOptions(value);

  const handleSubmit = React.useCallback((finalValues) => {
    onValueSet(finalValues);
    console.info(finalValues);
  }, [onValueSet]);

  React.useEffect(() => {
    if (value.is_covid_report === 'true') {
      onValueChange(DISASTER_TYPE_EPIDEMIC, 'disaster_type');
    }
  }, [value.is_covid_report, onValueChange]);

  return (
    <Page
      className={className}
      title="IFRC GO - New Field Report"
      heading="Create Field Report"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        <form
          onSubmit={createSubmitHandler(validate, onErrorSet, handleSubmit)}
        >
          <NonFieldError error={error} />
          <ContextFields
            error={error}
            onValueChange={onValueChange}
            statusOptions={statusOptions}
            value={value}
            yesNoOptions={yesNoOptions}
            disasterTypeOptions={disasterTypeOptions}
            reportType={reportType}
          />
          <hr />
          {value.status === STATUS_EVENT && (
            <>
              <SituationFields
                error={error}
                onValueChange={onValueChange}
                value={value}
              />
              <hr />
              <ActionsFields
                options={actionOptions}
                error={error}
                onValueChange={onValueChange}
                value={value}
              />
            </>
          )}
          {value.status === STATUS_EARLY_WARNING && (
            <RiskAnalysisFields
              error={error}
              onValueChange={onValueChange}
              value={value}
            />
          )}
        </form>
      </Container>
    </Page>
  );
}

export default NewFieldReportForm;
