import React from 'react';
import {
  EntriesAsList,
  Error,
  getErrorObject,
  PartialForm,
} from '@togglecorp/toggle-form';
import { IoHelpCircle } from 'react-icons/io5';
import { isNotDefined } from '@togglecorp/fujs';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import languageContext from '#root/languageContext';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import UserSearchSelectInput from '#components/UserSearchSelectInput';
import { Option } from '#components/SearchSelectInput';
import ImageWithCaptionInput from '#views/DrefApplicationForm/DrefOverview/ImageWithCaptionInput';
import { ListResponse, useRequest } from '#utils/restRequest';
import { compareString } from '#utils/utils';
import { DistrictMini } from '#types/country';
import {
  BooleanValueOption,
  DrefFinalReportFields,
  emptyNumericOptionList,
  NumericValueOption,
  TYPE_IMMINENT,
} from '../common';

import styles from './styles.module.scss';
import TextArea from '#components/TextArea';

type Value = PartialForm<DrefFinalReportFields>;
interface Props {
  countryOptions: NumericValueOption[];
  fetchingCountries?: boolean;
  fetchingDisasterTypes?: boolean;
  fetchingNationalSociety?: boolean;
  disasterTypeOptions: NumericValueOption[];
  nationalSocietyOptions: NumericValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  disasterCategoryOptions: NumericValueOption[];
  onsetOptions: NumericValueOption[];
  userOptions: Option[];
  onCreateAndShareButtonClick: () => void;
  yesNoOptions: BooleanValueOption[];
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  drefType?: number;
  fetchingDrefTypeOptions?: boolean;
  drefTypeOptions: NumericValueOption[];
}

const totalPopulationRiskImminentLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";
const totalPeopleAffectedSlowSuddenLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";
const peopleTargetedLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";
const peopleInNeedLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";
const peopleAssistedLink = "https://ifrcorg.sharepoint.com/sites/IFRCSharing/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF%2FHum%20Pop%20Definitions%20for%20DREF%20Form%5F21072022%2Epdf&parent=%2Fsites%2FIFRCSharing%2FShared%20Documents%2FDREF&p=true&ga=1";

function Overview(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    countryOptions,
    fetchingCountries,
    fetchingNationalSociety,
    fetchingDisasterTypes,
    disasterTypeOptions,
    nationalSocietyOptions,
    error: formError,
    onValueChange,
    value,
    disasterCategoryOptions,
    onsetOptions,
    userOptions,
    onCreateAndShareButtonClick,
    fileIdToUrlMap,
    setFileIdToUrlMap,
    drefType,
    drefTypeOptions,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const countryQuery = React.useMemo(() => ({
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
  ), [districtsResponse]);

  return (
    <>
      <Container
        className={styles.sharing}
        heading={strings.drefFormSharingHeading}
        visibleOverflow
      >
        <InputSection
          title={strings.drefFormSharingTitle}
          description={strings.drefFormSharingDescription}
        >
          <UserSearchSelectInput<"users", number>
            name={"users" as const}
            isMulti
            initialOptions={userOptions}
            value={value.users}
            onChange={onValueChange}
          />
          {isNotDefined(value.id) && (
            <div className={styles.actions}>
              <Button
                name={undefined}
                variant="secondary"
                disabled={isNotDefined(value.users) || value.users.length === 0}
                onClick={onCreateAndShareButtonClick}
              >
                {strings.drefFormInstantShareLabel}
              </Button>
            </div>
          )}
        </InputSection>
      </Container>
      <Container
        visibleOverflow
        heading={strings.finalReportEssentialInformationTitle}
        className={styles.essentialInformation}
      >
        <InputSection
          title={strings.finalReportNationalSociety}
          multiRow
          oneColumn
        >
          <SelectInput
            name={"national_society" as const}
            value={value.national_society}
            onChange={onValueChange}
            options={nationalSocietyOptions}
            error={error?.national_society}
            pending={fetchingNationalSociety}
          />
        </InputSection>
        <InputSection title={strings.drefOperationalUpdateDREFType}>
          <SelectInput
            error={error?.type_of_dref}
            label={strings.drefOperationalUpdateTypeOfDREF}
            name={"type_of_dref" as const}
            onChange={onValueChange}
            options={drefTypeOptions}
            value={value.type_of_dref}
          />
        </InputSection>
        <InputSection
          title={drefType === TYPE_IMMINENT
            ? strings.finalReportImminentDisasterDetails
            : strings.finalReportDisasterDetails}
          multiRow
          twoColumn
        >
          <SelectInput
            error={error?.disaster_type}
            label={drefType === TYPE_IMMINENT
              ? strings.finalReportImminentDisasterTypeLabel
              : strings.finalReportDisasterTypeLabel}
            name={"disaster_type" as const}
            onChange={onValueChange}
            options={disasterTypeOptions}
            pending={fetchingDisasterTypes}
            value={value.disaster_type}
          />
          <SelectInput
            error={error?.type_of_onset}
            label={strings.finalReportTypeOfOnsetLabel}
            name={"type_of_onset" as const}
            onChange={onValueChange}
            options={onsetOptions}
            value={value.type_of_onset}
          />
          <SelectInput
            error={error?.disaster_category}
            label={(
              <>
                {strings.finalReportDisasterCategoryLabel}
                <a
                  className={styles.disasterCategoryHelpLink}
                  target="_blank"
                  title={strings.clickToViewEmergencyResponseFramework}
                  href="https://www.ifrc.org/sites/default/files/2021-07/IFRC%20Emergency%20Response%20Framework%20-%202017.pdf"
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name={"disaster_category" as const}
            onChange={onValueChange}
            options={disasterCategoryOptions}
            value={value.disaster_category}
          />
        </InputSection>
        <InputSection
          title={drefType !== TYPE_IMMINENT
            ? strings.finalReportAffectedCountryAndProvinceImminent
            : strings.finalReportRiskCountryLabel}
          twoColumn
        >
          <SelectInput
            label={strings.drefFormAddCountry}
            pending={fetchingCountries}
            error={error?.country}
            name={"country" as const}
            onChange={onValueChange}
            options={countryOptions}
            value={value.country}

          />
          <SelectInput<"district", number>
            label={strings.drefFormAddRegion}
            pending={fetchingDistricts}
            isMulti={true}
            error={error?.district}
            name="district"
            onChange={onValueChange}
            options={districtOptions}
            value={value.district}
          />
        </InputSection>
        <InputSection title={strings.finalReportEssentialTitle}>
          <TextInput
            name="title"
            value={value.title}
            onChange={onValueChange}
            error={error?.title}
            placeholder={strings.finalReportEssentialDescription}
          />
        </InputSection>
        <InputSection
          multiRow
          twoColumn
        >
          <NumberInput
            label={drefType === TYPE_IMMINENT ?
              <>
                {strings.finalReportRiskPeopleLabel}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={totalPopulationRiskImminentLink}
                >
                  <IoHelpCircle />
                </a>
              </>
              :
              <>
                {strings.finalReportPeopleAffected}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={totalPeopleAffectedSlowSuddenLink}
                >
                  <IoHelpCircle />
                </a>
              </>
            }
            name="number_of_people_affected"
            value={value.number_of_people_affected}
            onChange={onValueChange}
            error={error?.number_of_people_affected}
            hint={drefType === TYPE_IMMINENT
              ? strings.drefFormPeopleAffectedDescriptionImminent
              : strings.drefFormPeopleAffectedDescriptionSlowSudden
            }
          />
          <NumberInput
            label={(
              <>
                {
                  drefType === TYPE_IMMINENT
                    ? strings.drefFormEstimatedPeopleInNeed
                    : strings.drefFormPeopleInNeed
                }
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={peopleInNeedLink}
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name="people_in_need"
            value={value.people_in_need}
            onChange={onValueChange}
            error={error?.people_in_need}
            hint={drefType === TYPE_IMMINENT
              ? strings.drefFormPeopleInNeedDescriptionImminent
              : strings.drefFormPeopleInNeedDescriptionSlowSudden
            }
          />
          <NumberInput
            label={(
              <>
                {strings.finalReportPeopleTargeted}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={peopleTargetedLink}
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name="number_of_people_targeted"
            value={value.number_of_people_targeted}
            onChange={onValueChange}
            error={error?.number_of_people_targeted}
            hint={strings.drefFormPeopleTargetedDescription}
          />
          <NumberInput
            label={(
              <>
                {strings.finalReportPeopleAssisted}
                <a
                  className={styles.peopleTargetedHelpLink}
                  target="_blank"
                  title="Click to view Emergency Response Framework"
                  href={peopleAssistedLink}
                >
                  <IoHelpCircle />
                </a>
              </>
            )}
            name="num_assisted"
            value={value.num_assisted}
            onChange={onValueChange}
            error={error?.num_assisted}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportTotalAllocation}
        >
          <NumberInput
            name="total_dref_allocation"
            value={value.total_dref_allocation}
            error={error?.total_dref_allocation}
            readOnly
          />
        </InputSection>
        <InputSection
          title={strings.drefFormUploadMap}
          description={strings.drefFormUploadMapDescription}
          contentSectionClassName={styles.imageInputContent}
        >
          <ImageWithCaptionInput
            name={"event_map_file" as const}
            value={value?.event_map_file}
            onChange={onValueChange}
            error={error?.event_map_file}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            label={strings.drefFormUploadAnImageLabel}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormUploadCoverImage}
          description={strings.drefFormUploadCoverImageDescription}
          contentSectionClassName={styles.imageInputContent}
        >
          <ImageWithCaptionInput
            name={"cover_image_file" as const}
            value={value?.cover_image_file}
            onChange={onValueChange}
            error={error?.cover_image_file}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            label={strings.drefFormUploadAnImageLabel}
          />
        </InputSection>
        <InputSection
          title={strings.finalReportMainDonor}
        >
          <TextArea
            name="main_donors"
            value={value.main_donors}
            onChange={onValueChange}
            error={error?.main_donors}
          />
        </InputSection>
      </Container>
    </>
  );
}

export default Overview;
