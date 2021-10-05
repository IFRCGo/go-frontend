import React from 'react';
import {
  isFalsyString,
  caseInsensitiveSubmatch,
  compareStringSearch,
  listToMap,
} from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import SearchSelectInput from '#components/SearchSelectInput';
import LanguageContext from '#root/languageContext';

import {
  DrefFields,
  NumericValueOption,
  emptyNumericOptionList,
} from '../common';

import styles from './styles.module.scss';

export function rankedSearchOnList<T>(
  list: T[],
  searchString: string | undefined,
  labelSelector: (item: T) => string,
) {
  if (isFalsyString(searchString)) {
    return list;
  }

  return list
  .filter((option) => caseInsensitiveSubmatch(labelSelector(option), searchString))
  .sort((a, b) => compareStringSearch(
    labelSelector(a),
    labelSelector(b),
    searchString,
  ));
}

type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  userOptions: NumericValueOption[];
}

function Submission(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error,
    onValueChange,
    value,
    userOptions,
  } = props;

  const handleUserSearch = React.useCallback((input: string | undefined, callback) => {
    if (!input) {
      callback(emptyNumericOptionList);
    }

    callback(rankedSearchOnList(
      userOptions,
      input,
      d => d.label,
    ));
  }, [userOptions]);

  const userMap = React.useMemo(() => listToMap(userOptions, d => d.value, d => d.label), [userOptions]);
  const initialOptions = React.useMemo(() => (
    value.users?.map((u) => ({
      label: userMap[u],
      value: u,
    }))
  ), [userMap, value.users]);

  return (
    <>
      <Container
        heading={strings.drefFormTrackingData}
        className={styles.trackingData}
      >
        <InputSection
          title={strings.drefFormAppealCode}
          description={strings.drefFormAppealCodeDescription}
        >
          <TextInput
            name="appeal_code"
            value={value.appeal_code}
            onChange={onValueChange}
            error={error?.fields?.appeal_code}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormGlideNum}
        >
          <TextInput
            placeholder="MDR code"
            name="glide_code"
            value={value.glide_code}
            onChange={onValueChange}
            error={error?.fields?.glide_code}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormAppealManager}
          description={strings.drefFormAppealManagerDescription}
        >
          <TextInput
            label="Name"
            name="ifrc_appeal_manager_name"
            value={value.ifrc_appeal_manager_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_name}
          />
          <TextInput
            label="Email"
            name="ifrc_appeal_manager_email"
            value={value.ifrc_appeal_manager_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_appeal_manager_email}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormProjectManager}
          description={strings.drefFormProjectManagerDescription}
        >
          <TextInput
            label="Name"
            name="ifrc_project_manager_name"
            value={value.ifrc_project_manager_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_name}
          />
          <TextInput
            label="Email"
            name="ifrc_project_manager_email"
            value={value.ifrc_project_manager_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_project_manager_email}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNationalSocietyContact}
        >
          <TextInput
            label="Name"
            name="national_society_contact_name"
            value={value.national_society_contact_name}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_name}
          />
          <TextInput
            label="Email"
            name="national_society_contact_email"
            value={value.national_society_contact_email}
            onChange={onValueChange}
            error={error?.fields?.national_society_contact_email}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormIfrcEmergency}
        >
          <TextInput
            label="Name"
            name="ifrc_emergency_name"
            value={value.ifrc_emergency_name}
            onChange={onValueChange}
            error={error?.fields?.ifrc_emergency_name}
          />
          <TextInput
            label="Email"
            name="ifrc_emergency_email"
            value={value.ifrc_emergency_email}
            onChange={onValueChange}
            error={error?.fields?.ifrc_emergency_email}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormMediaContact}
        >
          <TextInput
            label="Name"
            name="media_contact_name"
            value={value.media_contact_name}
            onChange={onValueChange}
            error={error?.fields?.media_contact_name}
          />
          <TextInput
            label="Email"
            name="media_contact_email"
            value={value.media_contact_email}
            onChange={onValueChange}
            error={error?.fields?.media_contact_email}
          />
        </InputSection>
      </Container>
      <Container
        heading="Sharing"
        visibleOverflow
      >
        <InputSection
          title="Share the DREF Application with other Users"
          description="The users will be able to view, edit and add other users"
        >
          <SearchSelectInput
            name="users"
            isMulti
            initialOptions={initialOptions}
            value={value.users}
            onChange={onValueChange}
            loadOptions={handleUserSearch}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Submission;
