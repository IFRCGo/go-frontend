import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
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

function Submission(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
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
    heading="SUBMISSION FLOW"
    className={styles.submission}
    >
      </Container>
      <Container
        heading="TRACKING DATA AND CONTACTS"
        className={styles.submission}
      >
        <InputSection
          title="Appeal Code"
          description="Add at approval"
        >
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            placeholder="MDR code"
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </InputSection>
        <InputSection
          title="GLIDE number"
          description="Added by the regional office"
        >
          <TextInput
            // label={strings.fieldReportFormTitleSecondaryLabel}
            placeholder="MDR code"
            name="summary"
            value={value.summary}
            onChange={onValueChange}
            error={error?.fields?.summary}
          />
        </InputSection>
        <InputSection
          title="Appeal manager"
          description="Added by the regional office"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
        </InputSection>
        <InputSection
          title="Project manager"
          description="Added by the regional office"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
        </InputSection>
        <InputSection
          title="Requestor"
          description="Added by the regional office"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
        </InputSection>
        <InputSection
          title="National Society contact"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
        </InputSection>
        <InputSection
          title="IFRC focal point for the emergency"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
        </InputSection>
        <InputSection
          title="Media contact"
        >
          <div>
            <TextInput
              label="NAME"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
          <div>
            <TextInput
              label="EMAIL"
              // placeholder={strings.fieldReportFormTitleInputPlaceholder}
              name="summary"
              value={value.summary}
              onChange={onValueChange}
              error={error?.fields?.summary}
            />
          </div>
        </InputSection>
      </Container>
    </>
  );
}

export default Submission;
