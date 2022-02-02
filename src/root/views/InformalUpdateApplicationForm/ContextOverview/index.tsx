import React, { useContext } from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  EntriesAsList,
  PartialForm,
  Error,
  useFormArray,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Button from '#components/Button';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import languageContext from '#root/languageContext';
import SelectInput from '#components/SelectInput';
import TextInput from '#components/TextInput';
import TextArea from '#components/TextArea';
import { CountryDistrictType, ReferenceType } from '../useInformalUpdateFormOptions';
import CountryProvinceInput from './CountryProvinceInput';
import {
  InformalUpdateFields,
  NumericValueOption,
  CountryDistrict,
  ReferenceData,
} from '../common';

import styles from './styles.module.scss';
import InformalUpdateFileInput from '#components/InformalUpdateFileInput';
import ReferenceInput from './ReferenceInput';
import MapFileUpload from '#components/InformalUpdateFileInput/MapFileUpload';

type Value = PartialForm<InformalUpdateFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  countryOptions: NumericValueOption[];
  disasterTypeOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDisasterTypes?: boolean;
  fetchingDistricts?: boolean;
  districtOptions: NumericValueOption[];
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onCreateAndShareButtonClick: () => void;
}

function ContextOverview(props: Props) {
  const { strings } = useContext(languageContext);
  const {
    error: formError,
    onValueChange,
    value,
    setFileIdToUrlMap,
    fileIdToUrlMap,
    countryOptions,
    fetchingCountries,
    disasterTypeOptions,
    fetchingDisasterTypes,
  } = props;
  const error = getErrorObject(formError);
  const {
    setValue: onCountryDistrictChange,
    removeValue: onCountryDistrictRemove,
  } = useFormArray<'country_district', PartialForm<CountryDistrict>>(
    'country_district',
    onValueChange,
  );
  const {
    setValue: onReferenceChange,
    removeValue: onReferenceRemove,
  } = useFormArray<'reference', PartialForm<ReferenceData>>(
    'reference',
    onValueChange,
  );

  type CountryDistricts = typeof value.country_district;
  type References = typeof value.reference;

  const handleCountryDistrictAdd = React.useCallback(() => {
    const newList: PartialForm<CountryDistrictType> = {
      clientId: randomString(),
      country: undefined,
      district: undefined
    };
    onValueChange(
      (oldValue: PartialForm<CountryDistricts>) => (
        [...(oldValue ?? []), newList]
      ),
      'country_district' as const,
    );
  }, [onValueChange,]);

  const handleAddReference = React.useCallback(() => {
    const newList: PartialForm<ReferenceType> = {
      clientId: randomString(),
      date: undefined,
      source_description: undefined,
      url: undefined,
      document: undefined
    };
    onValueChange(
      (oldValue: PartialForm<References>) => (
        [...(oldValue ?? []), newList]
      ),
      'reference' as const,
    );
  }, [onValueChange]);

  return (
    <>
      <Container
        className={styles.context}
        heading={strings.informalUpdateFormContextHeading}
        visibleOverflow
      >
        <InputSection
          title={strings.informalUpdateFormContextCountryTitle}
          description={strings.informalUpdateFormContextCountryDescription}
          multiRow
          oneColumn
        >
          {value.country_district?.map((c, i) => (
            <CountryProvinceInput
              key={c.clientId}
              index={i}
              value={c}
              onChange={onCountryDistrictChange}
              onRemove={onCountryDistrictRemove}
              error={getErrorObject(error?.country_district)}
              countryOptions={countryOptions}
              fetchingCountries={fetchingCountries}
            />
          ))}
        </InputSection>
        <InputSection className={styles.addCountryButtonContainer} >
          <div className={styles.actions}>
            <Button
              name={undefined}
              onClick={handleCountryDistrictAdd}
              variant="secondary"
            >
              {strings.informalUpdateFormContextCountryButton}
            </Button>
          </div>
        </InputSection>
      </Container>
      <Container
        className={styles.context}
        visibleOverflow
      >
        <InputSection
          title={strings.informalUpdateFormContextHazardTypeTitle}
        >
          <SelectInput
            error={error?.hazard_type}
            name="hazard_type"
            onChange={onValueChange}
            options={disasterTypeOptions}
            pending={fetchingDisasterTypes}
            value={value.hazard_type}
          />
        </InputSection>
      </Container>
      <Container>
        <InputSection
          title={strings.informalUpdateFormContextTitle}
          description={strings.informalUpdateFormContextTitleDescription}
        >
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.title}
            placeholder={strings.informalUpdateFormContextTitlePlaceholder}
          />
        </InputSection>
      </Container>
      <Container >
        <InputSection
          title={strings.informalUpdateFormContextSituationalTitle}
          description={strings.informalUpdateFormContextSituationalDescription}
        >
          <TextArea
            name="situational_overview"
            onChange={onValueChange}
            value={value.situational_overview}
            error={error?.situational_overview}
          />
        </InputSection>
      </Container>
      <Container>
        <InputSection
          title={strings.informalUpdateFormContextGraphicTitle}
          description={strings.informalUpdateFormContextGraphicDescription}
        >
          <InformalUpdateFileInput
            accept="image/*"
            error={error?.graphics_id}
            fileIdToUrlMap={fileIdToUrlMap}
            name="graphics_id"
            onChange={onValueChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
            multiple
            value={value?.graphics_id}
            allValue={value && value}
            onCaptionValueChange={onValueChange}
          >
            {strings.informalUpdateFormContextReferenceUrlButtonLabel}
          </InformalUpdateFileInput>
        </InputSection>
      </Container>
      <Container>
        <InputSection
          title={strings.informalUpdateFormContextMapTitle}
          description={strings.informalUpdateFormContextMapDescription}
        >
          <MapFileUpload
            accept="image/*"
            error={error?.map_id}
            fileIdToUrlMap={fileIdToUrlMap}
            name="map_id"
            onChange={onValueChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            multiple
            showStatus
            value={value.map_id}
            allValue={value && value}
            onCaptionValueChange={onValueChange}
          >
            {strings.informalUpdateFormContextReferenceUrlButtonLabel}
          </MapFileUpload>
        </InputSection>
      </Container>
      <Container
      >
        <InputSection
          title={strings.informalUpdateFormContextReferenceTitle}
          description={strings.informalUpdateFormContextReferenceDescription}
          multiRow
          oneColumn
        >
          {value.reference?.map((c, i) => (
            <ReferenceInput
              key={c.clientId}
              index={i}
              value={c}
              error={error}
              onChange={onReferenceChange}
              onRemove={onReferenceRemove}
              handleAddReference={handleAddReference}
            />
          ))}
        </InputSection>
      </Container>
    </>
  );
}

export default ContextOverview;
