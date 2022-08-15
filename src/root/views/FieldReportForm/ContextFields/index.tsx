import React from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import RadioInput from '#components/RadioInput';
import DateInput from '#components/DateInput';
import TextInput from '#components/TextInput';
import SearchSelectInput, { Option as SearchSelectOption } from '#components/SearchSelectInput';
import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';

import {
  ReportType,
  optionLabelSelector,
  optionDescriptionSelector,
  Option,
  FormType,
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
  NumericValueOption,
  numericOptionKeySelector,
  BooleanValueOption,
  booleanOptionKeySelector,
  fetchEventsFromApi,
  EVENT_RELATED,
  IMMINENT_EVENT_EAP_ACTIVATION,
  EapActivation,
} from '../common';

import styles from './styles.module.scss';
import TextArea from '#components/TextArea';
import DREFFileInput from '#components/DREFFileInput';

const isEpidemic = (o: Option) => o.value === DISASTER_TYPE_EPIDEMIC;

type Value = PartialForm<FormType>;
type EapValue = PartialForm<EapActivation>;

interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  eapValue: EapValue;
  yesNoOptions: BooleanValueOption[];
  reportType: ReportType;
  countryOptions: NumericValueOption[];
  countryIsoOptions: NumericValueOption[];
  districtOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  initialEventOptions?: Option[];
  eventOptions: NumericValueOption[];
  imminentEventOptions: NumericValueOption[];
  reportId: any;
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function ContextFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    districtOptions,
    fetchingCountries,
    fetchingDistricts,
    fetchingDisasterTypes,
    disasterTypeOptions,
    error: formError,
    onValueChange,
    statusOptions,
    value,
    yesNoOptions,
    reportType,
    initialEventOptions,
    eventOptions,
    reportId,
    countryIsoOptions,
    setFileIdToUrlMap,
    fileIdToUrlMap,
    imminentEventOptions,
    eapValue,
  } = props;

  const [
    startDateSectionDescription,
    startDateSectionTitle,
    countrySectionTitle,
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
      EAP_ACTV: "Early Action",
    };

    const startDateTitleMap: MapByReportType = {
      EW: strings.fieldsStep1StartDateLabelEW,
      COVID: strings.fieldsStep1StartDateLabelEPI,
      EPI: strings.fieldsStep1StartDateLabelEPI,
      EVT: strings.fieldsStep1StartDateLabelStartDate,
      EAP_ACTV: "Early Action",
    };

    const countryTitleMap: MapByReportType = {
      EW: strings.fieldsStep1CountryLabelEW,
      COVID: strings.fieldsStep1CountryLabelAffected,
      EPI: strings.fieldsStep1CountryLabelAffected,
      EVT: strings.fieldsStep1CountryLabelAffected,
      EAP_ACTV: "Early Action",
    };

    const countryDescriptionMap: MapByReportType = {
      EW: strings.fieldsStep1CountryDescriptionEW,
      COVID: undefined,
      EPI: undefined,
      EVT: undefined,
      EAP_ACTV: undefined,
    };

    return [
      startDateDescriptionMap[reportType],
      startDateTitleMap[reportType],
      countryTitleMap[reportType],
      countryDescriptionMap[reportType],
    ];
  }, [strings, reportType]);

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  return (
    <Container
      // FIXME: use translation
      heading="Context"
      className={styles.contextFields}
    >
      <InputSection
        title={strings.fieldReportFormEventTypeLabel}
      >
        <RadioInput
          name={"status" as const}
          options={statusOptions}
          keySelector={numericOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.status}
          error={error?.status}
          onChange={onValueChange}
        />
      </InputSection>
      <InputSection
        title={strings.fieldReportFormImminentEventReportType}
      >
        <RadioInput
          name={"eap_activation" as const}
          options={imminentEventOptions}
          keySelector={numericOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.eap_activation}
          error={error?.eap_activation}
          onChange={onValueChange}
          disabled={value.status === EVENT_RELATED}
        />
      </InputSection>



      <InputSection
        // FIXME: This is field for Eap field report
        title="EAP Number"
      >
        <SelectInput
          name={"eap" as const}
          value={eapValue?.eap}
          onChange={onValueChange}
          options={eapValue}
          // disabled={!isDefined(value.eap_activation)}
          pending={fetchingDistricts}
          error={error?.districts}
          disabled={value.status === EVENT_RELATED}
        />
      </InputSection>
      <div className={styles.eapCountry}>
        <InputSection
          title="Country And Province/Region*"
        >
          <SelectInput
            pending={fetchingCountries}
            error={error?.country}
            name={"country" as const}
            onChange={onValueChange}
            options={countryOptions}
            value={value.country}
            disabled={value.status === EVENT_RELATED}
          />
          <SelectInput
            pending={fetchingDistricts}
            error={error?.districts}
            name={"districts" as const}
            onChange={onValueChange}
            options={districtOptions}
            value={value.districts}
            disabled={value.status === EVENT_RELATED}
          />
        </InputSection>
      </div>
      <InputSection
        title="Date the Trigger was Met*"
      >
        <DateInput
          name="trigger_met_date"
          value={undefined}
          disabled={value.status === EVENT_RELATED}
        >
        </DateInput>
      </InputSection>
      <InputSection
        title="Report Title"
        description="The title is automatically populated based on your selection above with the date of this report. You may edit it with any required details."
      >
        <TextInput
          name="title"
          value={undefined}
          disabled={value.status === EVENT_RELATED}
          placeholder="e.g. Malawi - Central Region: Floods Early Action Activation 02/2022"
        >
        </TextInput>
      </InputSection>
      <InputSection
        title="Key Dates"
        twoColumn
      >
        <DateInput
          name={"disaster_type" as const}
          label="Date of Eap Approval"
          onChange={onValueChange}
          error={undefined}
          value={value?.disaster_type}
          disabled={value.status === EVENT_RELATED}
        />
        <TextInput
          name={"disaster_type" as const}
          label="Operation Timeframe(Months)"
          onChange={onValueChange}
          error={undefined}
          value={value?.disaster_type}
          disabled={value.status === EVENT_RELATED}
        />
      </InputSection>
      <InputSection>
        <TextInput
          name={"disaster_type" as const}
          label="Lead Time"
          onChange={onValueChange}
          error={undefined}
          value={value?.disaster_type}
          disabled={value.status === EVENT_RELATED}
        />
        <DateInput
          name={"disaster_type" as const}
          label="Eap Timeframe(Years)"
          onChange={onValueChange}
          error={undefined}
          value={value?.disaster_type}
          disabled={value.status === EVENT_RELATED}
        />
      </InputSection>
      <InputSection
        title="Number of People Targeted"
      >
        <TextInput
          name={"disaster_type" as const}
          value={undefined}
          onChange={onValueChange}
          error={undefined}
          disabled={value.status === EVENT_RELATED}
        >
        </TextInput>
      </InputSection>
      <InputSection
        title="Total Budget (CHF)"
        twoColumn
      >
        <TextInput
          name={"disaster_type" as const}
          placeholder="Total Budget"
          value={undefined}
          onChange={onValueChange}
          disabled={value.status === EVENT_RELATED}
          error={undefined}
        >
        </TextInput>
        <TextInput
          name={"disaster_type" as const}
          placeholder="Total Budget"
          value={undefined}
          onChange={onValueChange}
          error={undefined}
          disabled={value.status === EVENT_RELATED}
        >
        </TextInput>
        <TextInput
          name={"disaster_type" as const}
          placeholder="Total Budget"
          value={undefined}
          onChange={onValueChange}
          error={undefined}
          disabled={value.status === EVENT_RELATED}
        >
        </TextInput>
        <TextInput
          name={"disaster_type" as const}
          placeholder="Total Budget"
          value={undefined}
          onChange={onValueChange}
          disabled={value.status === EVENT_RELATED}
          error={undefined}
        >
        </TextInput>
      </InputSection>
      <InputSection
        title="Trigger Statement(Threshold for Activation)"
      >
        <TextInput
          name={"disaster_type" as const}
          placeholder="Description"
          value={undefined}
          onChange={onValueChange}
          error={undefined}
          disabled={value.status === EVENT_RELATED}
          >
        </TextInput>
      </InputSection>
      <InputSection
        title="Eap Overview"
      >
        <TextArea
          name={"disaster_type" as const}
          placeholder="Which hazard is being addressed by this Early Action Protocol? Provide a brief rationale about the hazard selected for this EAP and why it is a major problem in the country. Which priority impacts (risks) are being addressed by the EAP? Explain which people are most likely to experience the impacts of this hazard? Which specific population groups are most likely to be affected? Explain how the EAP will be activated, including lead time and forecast to be used. Describe in general the early actions to be taken."
          value={undefined}
          onChange={onValueChange}
          error={undefined}
          disabled={value.status === EVENT_RELATED}
          >
        </TextArea>
      </InputSection>
      <InputSection
        title="Description of EAP Activation*"
      >
        <TextArea
          name={"disaster_type" as const}
          placeholder="The [Name of the National Society] has activated its Early Action Protocol for [Hazard]. Describe the situation, the monitoring of the trigger, when the trigger was met, the predicted geographical areas where the action will take place, who will be targeted and the duration of the actions. Example: The Bangladesh Red Crescent Society (BDRCS) has activated its Early Action Protocol (EAP) for cyclone AMPHAN. The EAP trigger was met on May 18 using the Indian Meteorological Department’s (IMD) and Bangladesh Meteorological Department’s (BMD) Numerical Weather Product. The forecast of a cyclone making landfall in Bangladesh with wind speeds greater than 125km/h was combined with an exposure and vulnerability map to estimate the percentage of houses that could be at risk of destruction in each union. All unions with greater than 25% of houses at risk of being totally damaged were placed on a “priority” list and ranked according to a vulnerability index. Over the next 72 hours BDRCS will target 40 cyclone shelters in as many unions as possible, starting with the most vulnerable on the priority list and proceeding down in order of vulnerability. Most areas in Shatkhira, Khulna, Bagerhat, Potuakhali, Pirojpur, Borguna, Bhola, Noakhali, and Lakshmipur districts are expected to experience house damage. Evacuation activities will target people who cannot self-evacuate including elderly people and people with disabilities etc. Basic first aid services will target anyone who requires assistance and food and water will be distributed to everyone in the targeted evacuation shelter."
          value={undefined}
          onChange={onValueChange}
          error={undefined}
          disabled={value.status === EVENT_RELATED}
          >
        </TextArea>
      </InputSection>
      <InputSection
        title="Upload Documents"
        description="Include map of at-risk Provinces/Region, Met forecast, trajectory map, photographs, media reports etc."
      >
        <DREFFileInput
          name={"document" as const}
          accept=".pdf"
          error={undefined}
          fileIdToUrlMap={fileIdToUrlMap}
          onChange={onValueChange}
          setFileIdToUrlMap={setFileIdToUrlMap}
          showStatus
          value={undefined}
          disabled={value.status === EVENT_RELATED}
        >
          <div className={styles.uploadDocument}>
            Upload
          </div>
        </DREFFileInput>
      </InputSection>
      <InputSection
        title={strings.fieldReportFormCovidLabel}
      >
        <RadioInput
          name={"is_covid_report" as const}
          options={yesNoOptions}
          keySelector={booleanOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.is_covid_report}
          onChange={onValueChange}
          error={error?.is_covid_report}
          disabled={value.status === STATUS_EARLY_WARNING}
        />
      </InputSection>
      <InputSection
        title="National Society Requests International Assistance*"
        description="Indicate if the National Society requested international assistance."
      >
        <RadioInput
          name={"is_covid_report" as const}
          options={yesNoOptions}
          keySelector={booleanOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.is_covid_report}
          onChange={onValueChange}
          error={error?.is_covid_report}
          disabled={value.status === STATUS_EARLY_WARNING}
        />
      </InputSection>
      <InputSection
        title='Search for existing emergency *'
        description='Type the name of the country you want to report on in the box above to begin the search.'
      >
        <SearchSelectInput
          label={strings.fieldReportFormTitleSelectLabel}
          placeholder={strings.fieldReportFormTitleSelectPlaceholder}
          name={"event" as const}
          value={value.event}
          onChange={onValueChange}
          loadOptions={fetchEventsFromApi}
          initialOptions={initialEventOptions as SearchSelectOption[]}
          error={error?.event}
        />
      </InputSection>
      <InputSection
        title={countrySectionTitle}
        description={countrySectionDescription}
      >
        <SelectInput
          //className={reportId === undefined ? 'visually-hidden' : ''}
          error={error?.country}
          label={strings.projectFormCountryLabel}
          name={"country" as const}
          onChange={onValueChange}
          options={countryOptions}
          pending={fetchingCountries}
          value={value.country}
        />
        <SelectInput<"districts", number>
          disabled={!isDefined(value.country)}
          pending={fetchingDistricts}
          error={error?.districts}
          isMulti
          label={strings.projectFormDistrictLabel}
          name={"districts" as const}
          onChange={onValueChange}
          options={districtOptions}
          value={value.districts}
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1DisasterTypeLabel}
        description={strings.fieldsStep1DisasterTypeDescription}
      >
        <SelectInput
          name={"dtype" as const}
          isOptionDisabled={value.status === STATUS_EARLY_WARNING ? isEpidemic : undefined}
          value={value.dtype}
          options={disasterTypeOptions}
          pending={fetchingDisasterTypes}
          onChange={onValueChange}
          error={error?.dtype}
          disabled={value.is_covid_report}
        />
      </InputSection>
      <InputSection
        title={startDateSectionTitle}
        description={startDateSectionDescription}
      >
        <DateInput
          name="start_date"
          value={value.start_date}
          onChange={onValueChange}
          error={error?.start_date}
        />
      </InputSection>

      <InputSection
        title={strings.fieldsStep1SummaryLabel}
        description={strings.fieldsStep1SummaryDescription}
      >
        <table cellSpacing={0} cellPadding={0}>
          <tbody>
            <tr>
              {
                reportId === undefined ? (
                  <>
                    <td style={{ width: '35%' }} >
                      <TextInput
                        style={{ backgroundColor: '#E0DDDD', borderRadius: 0, padding: 'offset' }}
                        label='prefix '//{strings.fieldReportFormCountryLabel}
                        placeholder=""
                        name="pref2"
                        //value={(countryIsoOptions.find(x=> x.value === value.country)?.label + ': ' +  disasterTypeOptions.find(x=>x.value === value.dtype)?.label + ' -' + value.start_date?.substring(0,7)).replaceAll('undefined',' ' )}
                        value={value.country !== undefined && value.dtype !== undefined && value.start_date !== undefined ? countryIsoOptions.find(x => x.value === value.country)?.label + ': ' + (value.is_covid_report ? strings.fieldReportCOVID19 : disasterTypeOptions.find(x => x.value === value.dtype)?.label) + ' -' + value.start_date?.substring(0, 7) : ' '}
                        error={error?.event}
                      />
                    </td>
                  </>
                ) : null
              }
              <td>
                <TextInput
                  label={strings.fieldReportFormTitleSecondaryLabel}
                  placeholder={strings.fieldReportFormTitleInputPlaceholder}
                  name="summary"
                  value={value.summary}
                  maxLength={256}
                  onChange={onValueChange}
                  error={error?.summary}
                />
              </td>
              {
                reportId === undefined && value.event !== undefined ? (
                  <>
                    <td style={{ width: '7%' }}>
                      <TextInput
                        style={{ backgroundColor: '#E0DDDD', borderRadius: 5, padding: 'offset' }}
                        label="#" // {strings.fieldReportUpdateNo}
                        placeholder="1"
                        name="event"
                        value={eventOptions.find(x => x.value === value.event)?.label}
                        error={error?.event}
                      />
                    </td>
                  </>
                ) : null}
            </tr>
          </tbody>
        </table>
      </InputSection>
      <InputSection
        title={strings.fieldsStep1AssistanceLabel}
        description={strings.fieldsStep1AssistanceDescription}
      >
        <RadioInput
          name={"request_assistance" as const}
          options={yesNoOptions}
          keySelector={booleanOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.request_assistance}
          onChange={onValueChange}
          error={error?.request_assistance}
          clearable
        />
      </InputSection>
      <InputSection
        title={strings.fieldsStep1NSAssistanceLabel}
        description={strings.fieldsStep1NSAssistanceDescription}
      >
        <RadioInput
          name={"ns_request_assistance" as const}
          options={yesNoOptions}
          keySelector={booleanOptionKeySelector}
          labelSelector={optionLabelSelector}
          descriptionSelector={optionDescriptionSelector}
          value={value.ns_request_assistance}
          onChange={onValueChange}
          error={error?.ns_request_assistance}
          clearable
        />
      </InputSection>
    </Container>
  );
}

export default ContextFields;
