import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';

import {
  ReportType,
  Option,
  FormType,
  DISASTER_TYPE_EPIDEMIC,
  NumericValueOption,
  BooleanValueOption,
} from '../common';

import styles from './styles.module.scss';
import TextArea from '#components/TextArea';

const isEpidemic = (o: Option) => o.value === DISASTER_TYPE_EPIDEMIC;

type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  yesNoOptions: BooleanValueOption[];
  reportType: ReportType;
  countryOptions: NumericValueOption[];
  districtOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  initialEventOptions?: Option[];
}

function Response(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    fetchingCountries,
    error,
    onValueChange,
    value,
    reportType,
  } = props;

  const [
    countrySectionDescription,
  ] = React.useMemo(() => {
    type MapByReportType = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in ReportType]: string | undefined;
    }

    const startDateDescriptionMap: MapByReportType = {
      EW: strings.fieldsStep1StartDateDescriptionEW,
      COVID: strings.fieldsStep1StartDateDescriptionEPI,
      EPI: strings.fieldsStep1StartDateDescriptionEPI,
      EVT: strings.fieldsStep1StartDateDescriptionEVT,
    };

    const startDateTitleMap: MapByReportType = {
      EW: strings.fieldsStep1StartDateLabelEW,
      COVID: strings.fieldsStep1StartDateLabelEPI,
      EPI: strings.fieldsStep1StartDateLabelEPI,
      EVT: strings.fieldsStep1StartDateLabelStartDate,
    };

    const countryTitleMap: MapByReportType = {
      EW: strings.fieldsStep1CountryLabelEW,
      COVID: strings.fieldsStep1CountryLabelAffected,
      EPI: strings.fieldsStep1CountryLabelAffected,
      EVT: strings.fieldsStep1CountryLabelAffected,
    };

    const countryDescriptionMap: MapByReportType = {
      EW: strings.fieldsStep1CountryDescriptionEW,
      COVID: undefined,
      EPI: undefined,
      EVT: undefined,
    };

    return [
      startDateDescriptionMap[reportType],
      startDateTitleMap[reportType],
      countryTitleMap[reportType],
      countryDescriptionMap[reportType],
    ];
  }, [strings, reportType]);

  return (
    <>
      <Container
        heading="TARGETING STRATEGY"
        className={styles.response}>
        <InputSection
          title="Which group of people will be assisted through this operation?"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 300 characters"
          />
        </InputSection>
        <InputSection
          title="What selection criteria or process has been applied to select affected people?"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 300 characters"
          />
        </InputSection>
        <InputSection
          title="How has Protection, Gender and Inclusion been considered in planning this response?"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 300 characters"
          />
        </InputSection>
        <InputSection
          title="How has the community been involved in the needs analysis and planning process?"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 300 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading="THE ASSISTED POPULATION"
        className={styles.eventDetails}>
        <InputSection>
          <div>
            <InputSection
              title="Women">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="summary"
                value={value.summary}
                onChange={onValueChange}
                error={error?.fields?.summary}
              />
            </InputSection>
          </div>
          <div>
            <InputSection
              title="Men">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="summary"
                value={value.summary}
                onChange={onValueChange}
                error={error?.fields?.summary}
              />
            </InputSection>
          </div>
        </InputSection>
        <InputSection>
          <div>
            <InputSection
              title="Girls(under18)">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="summary"
                value={value.summary}
                onChange={onValueChange}
                error={error?.fields?.summary}
              />
            </InputSection>
          </div>
          <div>
            <InputSection
              title="Boys(under18)">
              <TextInput
                // label={strings.fieldReportFormTitleSecondaryLabel}
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="summary"
                value={value.summary}
                onChange={onValueChange}
                error={error?.fields?.summary}
              />
            </InputSection>
          </div>
        </InputSection>
        <InputSection>
          <div>
            <InputSection
              title="Estimate">
              <TextInput
                label="ESTIMATED % PEOPLE WITH DISABILITY"
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="summary"
                value={value.summary}
                onChange={onValueChange}
                error={error?.fields?.summary}
              />
            </InputSection>
          </div>
          <div>
            <InputSection>
              <TextInput
                label="ESTIMATED % URBAN/RURAL"
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="summary"
                value={value.summary}
                onChange={onValueChange}
                error={error?.fields?.summary}
              />
            </InputSection>
          </div>
          <div>
            <InputSection>
              <TextInput
                label="ESTIMATED NUMBER OF DISPLACED PEOPLE"
                // placeholder={strings.fieldReportFormTitleInputPlaceholder}
                name="summary"
                value={value.summary}
                onChange={onValueChange}
                error={error?.fields?.summary}
              />
            </InputSection>
          </div>
        </InputSection>
      </Container>
      <Container
        heading="OBJECTIVE AND STRATEGY RATIONALE"
        className={styles.eventDetails}>
        <InputSection
          title=""
          description="Overall objective of the operation"
        >
          <SelectInput
            error={error?.fields?.country}
            name="country"
            onChange={onValueChange}
            options={countryOptions}
            pending={fetchingCountries}
            value={value.country}
          />
        </InputSection>
        <InputSection
          title="Response strategy rationale"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Max 300 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading="PLANNED INTERVENTIONS"
        className={styles.ActionsFields}>
        <InputSection
          title=""
          description="Select the needs that apply."
        >
          <SelectInput
            error={error?.fields?.country}
            name="country"
            onChange={onValueChange}
            options={countryOptions}
            pending={fetchingCountries}
            value={value.country}
          />
        </InputSection>
        <InputSection
          title="Secretariat services"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Example: HR deployment, logistics, international procurement, Quality programing"
          />
        </InputSection>
        <InputSection
          title="National Society strengthening"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="actions_ntls_desc"
            onChange={onValueChange}
            value={value.actions_ntls_desc}
            error={error?.fields?.actions_ntls_desc}
            placeholder="Example:Staff and valunteers involved."
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Response;
