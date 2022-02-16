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
import InformalUpdateFileInput from '#components/InformalUpdateFileInput';

import { NumericValueOption } from '#types';

import {
  InformalUpdateFields,
  CountryDistrict,
  Reference,
  FileWithCaption,
} from '../common';

import CountryProvinceInput from './CountryProvinceInput';
import ReferenceInput from './ReferenceInput';
import GraphicInput from './GraphicInput';
import MapInput from './MapInput';

import styles from './styles.module.scss';

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

function Context(props: Props) {
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
  } = useFormArray<'references', PartialForm<Reference>>(
    'references',
    onValueChange,
  );

  const {
    setValue: onMapChange,
    removeValue: onMapRemove,
  } = useFormArray<'map_files', PartialForm<FileWithCaption>>(
    'map_files',
    onValueChange,
  );

  const {
    setValue: onGraphicChange,
    removeValue: onGraphicRemove,
  } = useFormArray<'graphics_files', PartialForm<FileWithCaption>>(
    'graphics_files',
    onValueChange,
  );

  type CountryDistricts = typeof value.country_district;
  type References = typeof value.references;

  const handleCountryDistrictAdd = React.useCallback(() => {
    const newList: PartialForm<CountryDistrict> = {
      client_id: randomString(),
    };

    onValueChange(
      (oldValue: PartialForm<CountryDistricts>) => (
        [...(oldValue ?? []), newList]
      ),
      'country_district' as const,
    );
  }, [onValueChange,]);

  const handleAddReference = React.useCallback(() => {
    const newList: PartialForm<Reference> = {
      client_id: randomString(),
    };

    onValueChange(
      (oldValue: PartialForm<References>) => (
        [...(oldValue ?? []), newList]
      ),
      'references' as const,
    );
  }, [onValueChange]);

  const handleGraphicsInputChange = React.useCallback((newValue: number[] | undefined) => {
    const newList: undefined | PartialForm<FileWithCaption[]> = newValue?.map((v) => ({
      client_id: randomString(),
      id: v,
    }));

    onValueChange(newList, 'graphics_files' as const);
  }, [onValueChange]);

  const handleMapInputChange = React.useCallback((newValue: number[] | undefined) => {
    const newList: undefined | PartialForm<FileWithCaption[]> = newValue?.map((v) => ({
      client_id: randomString(),
      id: v,
    }));

    onValueChange(newList, 'map_files' as const);
  }, [onValueChange]);

  const mapValue = React.useMemo(() => (
    value?.map_files?.map(d => d.id).filter(d => !!d) as number[] | undefined
  ), [value?.map_files]);

  const graphicsValue = React.useMemo(() => (
    value?.graphics_files?.map(d => d.id).filter(d => !!d) as number[] | undefined
  ), [value?.graphics_files]);

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
              key={c.client_id}
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
        <InputSection
          title={strings.informalUpdateFormContextGraphicTitle}
          description={strings.informalUpdateFormContextGraphicDescription}
          contentSectionClassName={styles.graphicsInputContent}
        >
          <InformalUpdateFileInput
            accept="image/*"
            error={error?.graphics_files}
            fileIdToUrlMap={fileIdToUrlMap}
            name="graphics"
            onChange={handleGraphicsInputChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            showStatus
            multiple
            value={graphicsValue}
            hidePreview
          >
            {strings.informalUpdateFormContextReferenceUrlButtonLabel}
          </InformalUpdateFileInput>
          <div className={styles.previewList}>
            {value?.graphics_files?.map((g, i) => (
              <GraphicInput
                key={g.client_id}
                index={i}
                value={g}
                onChange={onGraphicChange}
                onRemove={onGraphicRemove}
                error={getErrorObject(error?.graphics_files)}
                fileIdToUrlMap={fileIdToUrlMap}
              />
            ))}
          </div>
        </InputSection>
        <InputSection
          title={strings.informalUpdateFormContextMapTitle}
          description={strings.informalUpdateFormContextMapDescription}
          contentSectionClassName={styles.mapInputContent}
        >
          <InformalUpdateFileInput
            accept="image/*"
            error={error?.map_files}
            fileIdToUrlMap={fileIdToUrlMap}
            name="map"
            onChange={handleMapInputChange}
            setFileIdToUrlMap={setFileIdToUrlMap}
            multiple
            showStatus
            value={mapValue}
            hidePreview
          >
            {strings.informalUpdateFormContextReferenceUrlButtonLabel}
          </InformalUpdateFileInput>
          <div className={styles.previewList}>
            {value?.map_files?.map((m, i) => (
              <MapInput
                key={m.client_id}
                index={i}
                value={m}
                onChange={onMapChange}
                onRemove={onMapRemove}
                error={getErrorObject(error?.map_files)}
                fileIdToUrlMap={fileIdToUrlMap}
              />
            ))}
          </div>
        </InputSection>
        <InputSection
          title={strings.informalUpdateFormContextReferenceTitle}
          description={strings.informalUpdateFormContextReferenceDescription}
          multiRow
          oneColumn
        >
          {value.references?.map((c, i) => (
            <ReferenceInput
              key={i}
              index={i}
              value={c}
              error={getErrorObject(error?.references)}
              onChange={onReferenceChange}
              onRemove={onReferenceRemove}
              fileIdToUrlMap={fileIdToUrlMap}
              setFileIdToUrlMap={setFileIdToUrlMap}
            />
          ))}
          <div className={styles.actions}>
            <Button
              name={undefined}
              variant="secondary"
              onClick={handleAddReference}
            >
              {strings.informalUpdateFormContextReferenceAddButtonLabel}
            </Button>
          </div>
        </InputSection>
      </Container>
    </>
  );
}

export default Context;
