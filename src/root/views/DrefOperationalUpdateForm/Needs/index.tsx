import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';
import {
  isNotDefined,
  listToMap,
  randomString,
} from '@togglecorp/fujs';

import Container from '#components/Container';
import languageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import NeedInput from '#views/DrefApplicationForm/ActionsFields/NeedInput';
import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
import RadioInput from '#components/RadioInput';
import NsActionInput from '#views/DrefApplicationForm/ActionsFields/NSActionInput';
import DREFFileInput from '#components/DREFFileInput';

import {
  booleanOptionKeySelector,
  BooleanValueOption,
  DrefOperationalUpdateFields,
  Need,
  NsAction,
  optionLabelSelector,
  FileWithCaption,
  StringValueOption,
} from '../common';

import styles from './styles.module.scss';
import CaptionInput from '#views/DrefApplicationForm/CaptionInput';

type Value = PartialForm<DrefOperationalUpdateFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  needOptions: StringValueOption[];
  nsActionOptions: StringValueOption[];
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  isAssessmentReport?: boolean;
  isImminentOnset?: boolean;
}

function Needs(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    value,
    yesNoOptions,
    needOptions,
    nsActionOptions,
    fileIdToUrlMap,
    setFileIdToUrlMap,
    isAssessmentReport,
    isImminentOnset,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const [need, setNeed] = React.useState<string | undefined>();
  const [nsAction, setNsAction] = React.useState<string | undefined>();
  const {
    setValue: onNeedChange,
    removeValue: onNeedRemove,
  } = useFormArray<'needs_identified', PartialForm<Need>>(
    'needs_identified',
    onValueChange,
  );
  const {
    setValue: onNsActionChange,
    removeValue: onNsActionRemove,
  } = useFormArray<'national_society_actions', PartialForm<NsAction>>(
    'national_society_actions',
    onValueChange,
  );

  type Needs = typeof value.needs_identified;
  const handleNeedAddButtonClick = React.useCallback((title?: string) => {
    const clientId = randomString();
    const newList: PartialForm<Need> = {
      clientId,
      title,
    };

    onValueChange(
      (oldValue: PartialForm<Needs>) => (
        [...(oldValue ?? []), newList]
      ),
      'needs_identified' as const,
    );
    setNeed(undefined);
  }, [onValueChange, setNeed]);

  type NsActions = typeof value.needs_identified;
  const handleNsActionAddButtonClick = React.useCallback((title?: string) => {
    const clientId = randomString();
    const newList: PartialForm<NsAction> = {
      clientId,
      title,
    };

    onValueChange(
      (oldValue: PartialForm<NsActions>) => (
        [...(oldValue ?? []), newList]
      ),
      'national_society_actions' as const,
    );
    setNsAction(undefined);
  }, [onValueChange, setNsAction]);

  const needsIdentifiedMap = React.useMemo(() => (
    listToMap(
      value.needs_identified,
      d => d.title ?? '',
      d => true,
    )
  ), [value.needs_identified]);

  const filteredNeedOptions = needsIdentifiedMap ? needOptions.filter(n => !needsIdentifiedMap[n.value]) : [];

  const nsActionsMap = React.useMemo(() => (
    listToMap(
      value.national_society_actions,
      d => d.title ?? '',
      d => true,
    )
  ), [value.national_society_actions]);

  const filteredNsActionOptions = nsActionsMap ? nsActionOptions.filter(n => !nsActionsMap[n.value]) : [];
  const isThereCoordinationMechanism = value.is_there_major_coordination_mechanism;

  const imagesValue = React.useMemo(() => (
    value?.photos_file?.map(d => d.id).filter(d => !!d) as number[] | undefined
  ), [value?.photos_file]);

  const {
    setValue: onImageChange,
    removeValue: onImageRemove,
  } = useFormArray<'photos_file', PartialForm<FileWithCaption>>(
    'photos_file',
    onValueChange,
  );
  const handleImageInputChange = React.useCallback((newValue: number[] | undefined) => {
    const imageCaptionByIdMap = listToMap(
      value?.photos_file ?? [],
      img => img.id as number,
      img => img.caption,
    );

    const newImageList: undefined | PartialForm<FileWithCaption[]> = newValue?.map((v) => ({
      client_id: String(v),
      id: v,
      caption: imageCaptionByIdMap[v],
    }));

    onValueChange(newImageList, 'photos_file' as const);
  }, [value?.photos_file, onValueChange]);

  return (
    <>
      <Container
        heading={strings.drefFormNationalSocietiesActions}
        className={styles.nationalSocietyActions}
        visibleOverflow
      >
        <InputSection
          contentSectionClassName={styles.imageInputContent}
        >
          <DREFFileInput
            name="photos_file"
            value={imagesValue}
            onChange={handleImageInputChange}
            accept="image/*"
            multiple
            error={error?.photos_file}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            hidePreview
          >
            {strings.operationalUpdateCurrentNsImageLabel}
          </DREFFileInput>
          <div className={styles.previewList}>
            {value?.photos_file?.map((g, i) => (
              <CaptionInput
                key={g.client_id}
                index={i}
                value={g}
                onChange={onImageChange}
                onRemove={onImageRemove}
                error={getErrorObject(error?.photos_file)}
                fileIdToUrlMap={fileIdToUrlMap}
              />
            ))}
          </div>
        </InputSection>
        <InputSection>
          <SelectInput
            label={strings.drefFormNationalSocietiesActionsLabel}
            name={undefined}
            options={filteredNsActionOptions}
            value={nsAction}
            onChange={setNsAction}
          />
          <div className={styles.actions}>
            <Button
              variant="secondary"
              name={nsAction}
              onClick={handleNsActionAddButtonClick}
              disabled={isNotDefined(nsAction)}
            >
              Add
            </Button>
          </div>
        </InputSection>
        {value?.national_society_actions?.map((n, i) => (
          <NsActionInput
            key={n.clientId}
            index={i}
            value={n}
            onChange={onNsActionChange}
            onRemove={onNsActionRemove}
            error={getErrorObject(error?.national_society_actions)}
            nsActionOptions={nsActionOptions}
          />
        ))}
      </Container>
      <Container
        heading={strings.drefOperationalUpdateMovementPartners}
      >
        <InputSection
          title={strings.drefFormIfrc}
          description={strings.drefFormIfrcDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="ifrc"
            onChange={onValueChange}
            value={value.ifrc}
            error={error?.ifrc}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormIcrc}
          description={strings.drefFormIcrcDescription}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="icrc"
            onChange={onValueChange}
            value={value.icrc}
            error={error?.icrc}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormPartnerNationalSociety}
          description={strings.drefFormPartnerNationalSocietyDescription}
        >
          <TextArea
            name="partner_national_society"
            onChange={onValueChange}
            value={value.partner_national_society}
            error={error?.partner_national_society}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormNationalOtherActors}
        className={styles.otherActors}
      >
        <InputSection
          title={strings.drefFormInternationalAssistance}
        >
          <RadioInput
            name={"government_requested_assistance" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.government_requested_assistance}
            onChange={onValueChange}
            error={error?.government_requested_assistance}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNationalAuthorities}
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="national_authorities"
            onChange={onValueChange}
            value={value.national_authorities}
            error={error?.national_authorities}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormUNorOtherActors}
          oneColumn
          multiRow
        >
          <TextArea
            label={strings.cmpActionDescriptionLabel}
            name="un_or_other_actor"
            onChange={onValueChange}
            value={value.un_or_other_actor}
            error={error?.un_or_other_actor}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormCoordinationMechanism}
          oneColumn
          multiRow
        >
          <RadioInput
            name={"is_there_major_coordination_mechanism" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.is_there_major_coordination_mechanism}
            onChange={onValueChange}
            error={error?.is_there_major_coordination_mechanism}
          />
        </InputSection>

        {isThereCoordinationMechanism &&
          <InputSection
            description={strings.drefFormCoordinationMechanismDescription}
          >
            <TextArea
              label={strings.cmpActionDescriptionLabel}
              name="major_coordination_mechanism"
              onChange={onValueChange}
              value={value.major_coordination_mechanism}
              error={error?.major_coordination_mechanism}
            />
          </InputSection>
        }
      </Container>
      {!isAssessmentReport &&
        <Container
          className={styles.needsIdentified}
          heading={
            isImminentOnset
              ? strings.drefFormImminentNeedsIdentified
              : strings.drefFormNeedsIdentified
          }
          visibleOverflow
        >
          {!isImminentOnset &&
            <InputSection>
              <DREFFileInput
                accept=".pdf, .docx, .pptx"
                label={strings.drefFormAssessmentReportUploadLabel}
                name="assessment_report"
                value={value.assessment_report}
                onChange={onValueChange}
                error={error?.assessment_report}
                fileIdToUrlMap={fileIdToUrlMap}
                setFileIdToUrlMap={setFileIdToUrlMap}
              >
                {strings.drefFormAssessmentReportUploadButtonLabel}
              </DREFFileInput>
            </InputSection>
          }
          <InputSection>
            <SelectInput
              label={strings.drefFormActionFieldsLabel}
              name={undefined}
              onChange={setNeed}
              options={filteredNeedOptions}
              value={need}
            />
            <div className={styles.actions}>
              <Button
                variant="secondary"
                name={need}
                onClick={handleNeedAddButtonClick}
                disabled={isNotDefined(need)}
              >
                Add
              </Button>
            </div>
          </InputSection>
          {value?.needs_identified?.map((n, i) => (
            <NeedInput
              key={n.clientId}
              index={i}
              value={n}
              onChange={onNeedChange}
              onRemove={onNeedRemove}
              error={getErrorObject(error?.needs_identified)}
              needOptions={needOptions}
            />
          ))}
          {!isImminentOnset && (
            <InputSection
              title={strings.drefFormGapsInAssessment}
              oneColumn
              multiRow
            >
              <TextArea
                label={strings.cmpActionDescriptionLabel}
                name="identified_gaps"
                onChange={onValueChange}
                value={value.identified_gaps}
                error={error?.identified_gaps}
              />
            </InputSection>
          )}
        </Container>
      }
    </>
  );
}

export default Needs;
