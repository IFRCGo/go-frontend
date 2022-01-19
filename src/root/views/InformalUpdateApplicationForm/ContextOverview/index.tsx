import React, { useContext, } from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import {
  EntriesAsList,
  PartialForm,
  SetBaseValueArg,
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
import DateInput from '#components/DateInput';
import { CountryDistrictType, ReferenceType } from '../useInformalUpdateFormOptions';
import CountryProvinceInput from './CountryProvinceInput';
import ReferenceInput from './CountryProvinceInput/ReferenceInput';
import {
  InformalUpdateFields,
  NumericValueOption,
  CountryDistrict,
  ReferenceData,
} from '../common';

import styles from './styles.module.scss';
import InformalUpdateFileInput from '#components/InformalUpdateFileInput';
import BulletTextArea from '#components/BulletTextArea';

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
  onValueSet: (value: SetBaseValueArg<Value>) => void;
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
    fetchingDistricts,
    districtOptions,
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
  } = useFormArray<'references', PartialForm<ReferenceData>>(
    'references',
    onValueChange,
  );

  type CountryDistricts = typeof value.country_district;
  type References = typeof value.references;

  const handleCountryDistrictAdd = React.useCallback(() => {
    const newList: PartialForm<CountryDistrictType> = {
      // clientId,
      country: value.country,
      district: value.district,
    };

    onValueChange(
      (oldValue: PartialForm<CountryDistricts>) => (
        [...(oldValue ?? []), newList]
      ),
      'country_district' as const,
    );

  }, [onValueChange, value]);


  const handleAddReference = React.useCallback(() => {
    const newList: PartialForm<ReferenceType> = {
      date: value.reference_date,
      source_description: value.reference_name,
      url: value.reference_url,
      document: '',
    };
    onValueChange(
      (oldValue: PartialForm<References>) => (
        [...(oldValue ?? []), newList]
      ),
      'references' as const,
    );

  }, [onValueChange, value]);

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
        >
          <SelectInput
            label={strings.informalUpdateFormContextCountryLabel}
            name="country"
            pending={fetchingCountries}
            error={error?.country}
            onChange={onValueChange}
            options={countryOptions}
            value={value.country}

          />
          <SelectInput
            label={strings.informalUpdateFormContextProvinceLabel}
            name="district"
            pending={fetchingDistricts}
            error={error?.district}
            onChange={onValueChange}
            options={districtOptions}
            value={value.district}
          />
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

        <InputSection
          multiRow
          oneColumn
        >
          {value.country_district?.map((c, i) => (
            <CountryProvinceInput
              key={i}
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
            error={error?.graphic}
            fileIdToUrlMap={fileIdToUrlMap}
            name="graphic"
            onChange={onValueChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
            multiple
            value={value.graphic}
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
          <InformalUpdateFileInput
            accept="image/*"
            error={error?.map}
            fileIdToUrlMap={fileIdToUrlMap}
            name="map"
            onChange={onValueChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            multiple
            showStatus
            value={value.map}
          >
            {strings.informalUpdateFormContextReferenceUrlButtonLabel}
          </InformalUpdateFileInput>
        </InputSection>
      </Container>

      <Container
        className={styles.reference}
      >
        <InputSection
          title={strings.informalUpdateFormContextReferenceTitle}
          description={strings.informalUpdateFormContextReferenceDescription}
        >
          <DateInput
            className={styles.inputDate}
            name="reference_date"
            value={value.reference_date}
            onChange={onValueChange}
            error={error?.reference_date}
            label={strings.informalUpdateFormContextReferenceDateLabel}
          />
          <TextInput
            className={styles.inputName}
            name="reference_name"
            value={value.reference_name}
            onChange={onValueChange}
            error={error?.reference_name}
            label={strings.informalUpdateFormContextReferenceNameLabel}
          />
          <div className={styles.actions}>
            <Button
              name={undefined}
              variant="secondary"
              disabled={isNotDefined(value.reference_name)}
              onClick={handleAddReference}
            >
              {strings.informalUpdateFormContextReferenceAddButtonLabel}
            </Button>
          </div>
        </InputSection>
        <InputSection
          className={styles.referenceInput}
        >
          <BulletTextArea
            className={styles.inputUrl}
            label={strings.informalUpdateFormContextReferenceUrlLabel}
            name="reference_url"
            value={value.reference_url}
            onChange={onValueChange}
            error={error?.reference_url}
          />
          <div className={styles.actions}>
            <Button
              name={undefined}
              variant="secondary"
              disabled={isNotDefined(value.reference_name)}
            >
              {strings.informalUpdateFormContextReferenceUrlButtonLabel}
            </Button>
            <span>
              {isNotDefined(value.reference_image) && (
                strings.informalUpdateFormContextReferenceUrlPlaceholder
              )}
            </span>
          </div>
        </InputSection>

        {value.references?.map((c, i) => (
          <ReferenceInput
            key={i}
            index={i}
            value={c}
            error={error}
            onChange={onReferenceChange}
            onRemove={onReferenceRemove}
          />
        ))}


      </Container>
    </>
  );
}

export default ContextOverview;
