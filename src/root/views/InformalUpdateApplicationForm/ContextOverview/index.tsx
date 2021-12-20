import React, { useContext, useEffect } from 'react';
import Button from '#components/Button';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import SearchSelectInput from '#components/SearchSelectInput';
import { isDefined, isNotDefined, listToMap, randomString } from '@togglecorp/fujs';

import styles from './styles.module.scss';
import languageContext from '#root/languageContext';
import {
    InformalUpdateFields,
    NumericValueOption,
    BooleanValueOption,
    emptyNumericOptionList,
    CountryDistrict,
    ONSET_IMMINENT,
    ReferenceData,
} from '../common';
import {
    EntriesAsList,
    PartialForm,
    StateArg,
    Error,
    useFormArray,
} from '@togglecorp/toggle-form';
import { rankedSearchOnList } from '#utils/common';
import SelectInput from '#components/SelectInput';
import TextInput from '#components/TextInput';
import TextArea from '#components/TextArea';
import DREFFileInput from '#components/DREFFileInput';
import CountryDistrictInput from './CountryProvinceInput';
import { CountryDistrictType, ReferenceType } from '../useInformalUpdateFormOptions';
import CountryProvinceInput from './CountryProvinceInput';
import { ListResponse, useRequest } from '#utils/restRequest';
import { compareString } from '#utils/utils';
import { DistrictMini } from '#types/country';
import DateInput from '#components/DateInput';
import ReferenceInput from './CountryProvinceInput/ReferenceInput';

type Value = PartialForm<InformalUpdateFields>;
interface Props {

    error: Error<Value> | undefined;
    onValueChange: (...entries: EntriesAsList<Value>) => void;
    value: Value;
    //yesNoOptions: BooleanValueOption[];
    countryOptions: NumericValueOption[];
    disasterTypeOptions: NumericValueOption[];
    //nationalSocietyOptions: NumericValueOption[];
    //disasterCategoryOptions: NumericValueOption[];
    //onsetOptions: NumericValueOption[];
    fetchingCountries?: boolean;
    fetchingDisasterTypes?: boolean;
    fetchingDistricts?: boolean;
    districtOptions: NumericValueOption[];
    //fetchingNationalSociety?: boolean;
    fileIdToUrlMap: Record<number, string>;
    setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
    onValueSet: (value: StateArg<Value>) => void;
    onCreateAndShareButtonClick: () => void;
}

function ContextOverview(props: Props) {
    const { strings } = useContext(languageContext);
    const {
        error,
        onValueChange,
        value,
        onCreateAndShareButtonClick,
        setFileIdToUrlMap,
        fileIdToUrlMap,
        countryOptions,
        fetchingCountries,
        disasterTypeOptions,
        fetchingDisasterTypes,
        fetchingDistricts,
        districtOptions,
        onValueSet,
    } = props;

    const {
        onValueChange: onCountryDistrictChange,
        onValueRemove: onCountryDistrictRemove,
    } = useFormArray<'country_district', PartialForm<CountryDistrict>>(
        'country_district',
        onValueChange,
    );
    const {
        onValueChange: onReferenceChange,
        onValueRemove: onReferenceRemove,
    } = useFormArray<'references', PartialForm<ReferenceData>>(
        'references',
        onValueChange,
    );

    type CountryDistricts = typeof value.country_district;
    type References = typeof value.references;

    const handleCountryDistrictAdd = React.useCallback(() => {
        const clientId = randomString();
        const newList: PartialForm<CountryDistrictType> = {
            clientId,
        };
        onValueChange(
            (oldValue: PartialForm<CountryDistricts>) => (
                [...(oldValue ?? []), newList]
            ),
            'country_district' as const,
        );
    }, [onValueChange]);


    const handleAddReference = React.useCallback(() => {
        const clientId = randomString();
        const newList: PartialForm<ReferenceType> = {
            clientId,
            reference_date: value.reference_date,
            reference_name: value.reference_name,
            reference_url: value.reference_url,
            reference_image: 1,
        };
        onValueChange(
            (oldValue: PartialForm<References>) => (
                [...(oldValue ?? []), newList]
            ),
            'references' as const,
        );

    }, [onValueChange, value]);

    const handleCountrySearch = React.useCallback((input: string | undefined, callback) => {
        if (!input) {
            callback(emptyNumericOptionList);
        }

        callback(rankedSearchOnList(
            countryOptions,
            input,
            d => d.label,
        ));
    }, [countryOptions]);

    /*  const initialOptions = React.useMemo(() => (
          value.users?.map((u) => ({
              label: userMap[u],
              value: u,
          }))
      ), [userMap, value.users]);*/


    /*  React.useMemo(() => {
          const newTitle: string = `${value.country} - ${value.district} : ${value.hazard_type} `;
          onValueSet({ ...value, title: newTitle });
  
      }, [value.country, value.district, value.disaster_type]);
  */
    /* const countryQuery = React.useMemo(() => ({
         country: value.country,
         limit: 500,
     }), [value.country]);
 
     const {
         pending: fetchingDistricts,
         response: districtsResponse,
     } = useRequest<ListResponse<DistrictMini>>({
         skip: !value.country,
         url: 'api/v2/district/',
         query: countryQuery,
     });
 
     const districtOptions = React.useMemo(() => (
         districtsResponse?.results?.map(d => ({
             value: d.id,
             label: d.name,
         })).sort(compareString) ?? emptyNumericOptionList
     ), [districtsResponse]);*/

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
                        error={error?.fields?.country}
                        onChange={onValueChange}
                        options={countryOptions}
                        value={value.country}

                    />
                    <SelectInput
                        label={strings.informalUpdateFormContextProvinceLabel}
                        name="district"
                        pending={fetchingDistricts}
                        error={error?.fields?.district}
                        onChange={onValueChange}
                        options={districtOptions}
                        value={value.district}
                    />
                </InputSection>

                <InputSection>
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
                            key={c.clientId}
                            index={i}
                            value={c}
                            onChange={onCountryDistrictChange}
                            onRemove={onCountryDistrictRemove}
                            error={error?.fields?.country_district}
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
                        error={error?.fields?.hazard_type}
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
                        error={error?.fields?.title}
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
                        error={error?.fields?.situational_overview}
                    />
                </InputSection>
            </Container>

            <Container>
                <InputSection
                    title={strings.informalUpdateFormContextGraphicTitle}
                    description={strings.informalUpdateFormContextGraphicDescription}
                >
                    <DREFFileInput
                        accept="image/*"
                        error={error?.fields?.graphic_image}
                        fileIdToUrlMap={fileIdToUrlMap}
                        name="graphic_image"
                        onChange={onValueChange}
                        setFileIdToUrlMap={setFileIdToUrlMap}
                        showStatus
                        value={value.graphic_image}
                    >
                        {strings.informalUpdateFormContextReferenceUrlButtonLabel}
                    </DREFFileInput>
                </InputSection>
            </Container>

            <Container>
                <InputSection
                    title={strings.informalUpdateFormContextMapTitle}
                    description={strings.informalUpdateFormContextMapDescription}
                >
                    <DREFFileInput
                        accept="image/*"
                        error={error?.fields?.map_image}
                        fileIdToUrlMap={fileIdToUrlMap}
                        name="map_image"
                        onChange={onValueChange}
                        setFileIdToUrlMap={setFileIdToUrlMap}
                        showStatus
                        value={value.map_image}
                    >
                        {strings.informalUpdateFormContextReferenceUrlButtonLabel}
                    </DREFFileInput>
                </InputSection>
            </Container>

            <Container
                className={styles.reference}
            >
                <InputSection
                    className={styles.referenceInput}
                    title={strings.informalUpdateFormContextReferenceTitle}
                    description={strings.informalUpdateFormContextReferenceDescription}
                >
                    <DateInput
                        className={styles.referenceInputDate}
                        name="reference_date"
                        value={value.reference_date}
                        onChange={onValueChange}
                        error={error?.fields?.reference_date}
                        label={strings.informalUpdateFormContextReferenceDateLabel}
                    />
                    <TextInput
                        className={styles.referenceInputName}
                        name="reference_name"
                        value={value.reference_name}
                        onChange={onValueChange}
                        error={error?.fields?.reference_name}
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
                    <TextInput
                        className={styles.referenceInputUrl}
                        name="reference_url"
                        value={value.reference_url}
                        onChange={onValueChange}
                        error={error?.fields?.reference_url}
                        label={strings.informalUpdateFormContextReferenceUrlLabel}
                    />
                    <div className={styles.actions}>
                        <Button
                            name={undefined}
                            variant="secondary"
                            disabled={isNotDefined(value.reference_name)}
                        // onClick={onCreateAndShareButtonClick}
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
