import React from 'react';
import { isDefined } from '@togglecorp/fujs';
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
  optionLabelSelector,
  optionDescriptionSelector,
  Option,
  FormType,
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
  NumericValueOption,
  BooleanValueOption,
  booleanOptionKeySelector,
} from '../common';

import styles from './styles.module.scss';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';


type Value = PartialForm<FormType>;
interface Props {
  disasterTypeOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  statusOptions: NumericValueOption[];
  value: Value;
  yesNoOptions: BooleanValueOption[];
  countryOptions: NumericValueOption[];
  districtOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDistricts?: boolean;
  fetchingDisasterTypes?: boolean;
  initialEventOptions?: Option[];
}

function ActionsFields(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    countryOptions,
    fetchingCountries,
    error,
    onValueChange,
    value,
    yesNoOptions,
  } = props;

  return (
    <>
      <Container
        heading="NATIONAL SOCIETY ACTIONS"
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
      </Container>
      <Container
        heading="Other Actors"
        className={styles.ActionsFields}>
        <InputSection
          title="Government has requested international assistance"
        >
          <RadioInput
            name="government_requested_assistance"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            radioDescriptionSelector={optionDescriptionSelector}
            value={value.government_requested_assistance}
            onChange={onValueChange}
            error={error?.fields?.government_requested_assistance}
          />
        </InputSection>
        <InputSection
          title="National authorities"
          oneColumn
          multiRow
        >
          <TextArea
            // label={strings.cmpActionDescriptionLabel}
            name="national_authorities"
            onChange={onValueChange}
            value={value.national_authorities}
            error={error?.fields?.national_authorities}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="RCRC Partner NSs"
          oneColumn
          multiRow
        >
          <TextArea
            // label={strings.cmpActionDescriptionLabel}
            name="rcrc_partners"
            onChange={onValueChange}
            value={value.rcrc_partners}
            error={error?.fields?.rcrc_partners}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="ICRC"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="icrc"
            onChange={onValueChange}
            value={value.icrc}
            error={error?.fields?.icrc}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="UN or other actors"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="un_or_other"
            onChange={onValueChange}
            value={value.un_or_other}
            error={error?.fields?.un_or_other}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
        <InputSection
          title="List major coordination mechanism in place"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="major_coordination_mechanism"
            onChange={onValueChange}
            value={value.major_coordination_mechanism}
            error={error?.fields?.major_coordination_mechanism}
            placeholder="If selected, max 300 characters"
          />
        </InputSection>
      </Container>
      <Container
        heading="NEEDS IDENTIFIED"
        className={styles.eventDetails}>
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
          title="Any identified gaps/limitations in the assessment*"
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="identified_gaps"
            onChange={onValueChange}
            value={value.identified_gaps}
            error={error?.fields?.identified_gaps}
            placeholder="Max 300 characters"
          />
        </InputSection>
      </Container>
    </>
  );
}

export default ActionsFields;
