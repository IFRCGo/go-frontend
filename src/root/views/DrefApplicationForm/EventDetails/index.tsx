import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';
import { listToMap } from '@togglecorp/fujs';
import sanitizeHtml from 'sanitize-html';

import { resolveUrl } from '#utils/resolveUrl';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';
import LanguageContext from '#root/languageContext';
import DREFFileInput from '#components/DREFFileInput';
import DateInput from '#components/DateInput';

import CaptionInput from '../CaptionInput/CaptionInput';
import {
  optionLabelSelector,
  BooleanValueOption,
  booleanOptionKeySelector,
  DrefFields,
  FileWithCaption,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  isImminentOnset: boolean;
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function EventDetails(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error: formError,
    onValueChange,
    value,
    yesNoOptions,
    isImminentOnset,
    fileIdToUrlMap,
    setFileIdToUrlMap,
  } = props;

  const error = getErrorObject(formError);
  const imagesValue = React.useMemo(() => (
    value?.images_file?.map(d => d.id).filter(d => !!d) as number[] | undefined
  ), [value?.images_file]);

  const {
    setValue: onImageChange,
    removeValue: onImageRemove,
  } = useFormArray<'images_file', PartialForm<FileWithCaption>>(
    'images_file',
    onValueChange,
  );
  const handleImageInputChange = React.useCallback((newValue: number[] | undefined) => {
    const imageCaptionByIdMap = listToMap(
      value?.images_file ?? [],
      img => img.id as number,
      img => img.caption,
    );

    const newImageList: undefined | PartialForm<FileWithCaption[]> = newValue?.map((v) => ({
      client_id: String(v),
      id: v,
      caption: imageCaptionByIdMap[v],
    }));

    onValueChange(newImageList, 'images_file' as const);
  }, [value?.images_file, onValueChange]);

  const sanitizedValue = sanitizeHtml(value.event_description ?? '', {
    allowedTags: [],
  });
  onValueChange(sanitizedValue, 'event_description');

  return (
    <>
      <Container
        heading={strings.drefFormPreviousOperations}
        className={styles.previousOperations}
        description={
          <a href={resolveUrl(window.location.origin, 'preparedness#operational-learning')}>
            {strings.drefOperationalLearningPlatformLabel}
          </a>
        }
      >
        <InputSection
          title={strings.drefFormAffectSameArea}
        >
          <RadioInput
            name={"affect_same_area" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.affect_same_area}
            onChange={onValueChange}
            error={error?.affect_same_area}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormAffectedthePopulationTitle}
        >
          <RadioInput
            name={"affect_same_population" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.affect_same_population}
            onChange={onValueChange}
            error={error?.affect_same_population}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNsRespond}
        >
          <RadioInput
            name={"ns_respond" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.ns_respond}
            onChange={onValueChange}
            error={error?.ns_respond}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNsRequestFund}
        >
          <RadioInput
            name={"ns_request_fund" as const}
            options={yesNoOptions}
            keySelector={booleanOptionKeySelector}
            labelSelector={optionLabelSelector}
            value={value.ns_request_fund}
            onChange={onValueChange}
            error={error?.ns_request_fund}
          />
        </InputSection>
        {value.ns_request_fund && (
          <InputSection
            title={strings.drefFormNsFundingDetail}
          >
            <TextInput
              placeholder={strings.drefFormNsFundingDetailDescription}
              name="ns_request_text"
              value={value.ns_request_text}
              onChange={onValueChange}
              error={error?.ns_request_text}
            />
          </InputSection>
        )}
        {
          value.ns_request_fund &&
          value.ns_respond &&
          value.affect_same_population &&
          value.affect_same_area && (
            <InputSection
              title={strings.drefFormRecurrentText}
            >
              <TextArea
                name="dref_recurrent_text"
                value={value.dref_recurrent_text}
                onChange={onValueChange}
                error={error?.dref_recurrent_text}
              />
            </InputSection>
          )}
        <InputSection
          title={strings.drefFormLessonsLearnedTitle}
          description={strings.drefFormLessonsLearnedDescription}
          oneColumn
          multiRow
        >
          <TextArea
            name="lessons_learned"
            onChange={onValueChange}
            value={value.lessons_learned}
            error={error?.lessons_learned}
          />
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormDescriptionEvent}
      >
        <InputSection
          title={strings.drefFormEventDate}
        >
          {!isImminentOnset ?
            <DateInput
              name="event_date"
              value={value.event_date}
              onChange={onValueChange}
              error={error?.event_date}
            />
            :
            <TextArea
              label={strings.drefFormApproximateDateOfImpact}
              name="event_text"
              value={value.event_text}
              onChange={onValueChange}
              error={error?.event_text}
            />
          }
        </InputSection>
        <InputSection
          title={
            !isImminentOnset
              ? strings.drefFormWhatWhereWhen
              : strings.drefFormImminentDisaster
          }
          oneColumn
          multiRow
        >
          <TextArea
            name="event_description"
            onChange={onValueChange}
            value={value.event_description}
            error={error?.event_description}
          />
        </InputSection>
        {isImminentOnset &&
          <InputSection
            title={strings.drefFormTargetCommunities}
            description={strings.drefFormTargetCommunitiesDescription}
            oneColumn
            multiRow
          >
            <TextArea
              name="anticipatory_actions"
              onChange={onValueChange}
              value={value.anticipatory_actions}
              error={error?.anticipatory_actions}
            />
          </InputSection>
        }
        <InputSection
          title={strings.drefFormUploadPhotos}
          description={strings.drefFormUploadPhotosLimitation}
          contentSectionClassName={styles.imageInputContent}
        >
          <DREFFileInput
            name="images_file"
            value={imagesValue}
            onChange={handleImageInputChange}
            accept="image/*"
            multiple
            showStatus
            error={getErrorObject(error?.images_file)?.id}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
            hidePreview
          >
            Select images
          </DREFFileInput>
          <div className={styles.previewList}>
            {value?.images_file?.map((g, i) => (
              <CaptionInput
                key={g.client_id}
                index={i}
                value={g}
                onChange={onImageChange}
                onRemove={onImageRemove}
                error={getErrorObject(error?.images_file)}
                fileIdToUrlMap={fileIdToUrlMap}
              />
            ))}
          </div>
        </InputSection>
        <InputSection
          title={strings.drefFormScopeAndScaleEvent}
          description={strings.drefFormScopeAndScaleDescription}
          oneColumn
          multiRow
        >
          <TextArea
            name="event_scope"
            onChange={onValueChange}
            value={value.event_scope}
            error={error?.event_scope}
          />
        </InputSection>
        {isImminentOnset &&
          <InputSection
            title={strings.drefFormUploadSupportingDocument}
          >
            <DREFFileInput
              accept=".pdf,.docx,.pptx"
              error={error?.supporting_document}
              fileIdToUrlMap={fileIdToUrlMap}
              name="supporting_document"
              onChange={onValueChange}
              setFileIdToUrlMap={setFileIdToUrlMap}
              showStatus
              value={value.supporting_document}
            >
              {strings.drefFormUploadSupportingDocumentButtonLabel}
            </DREFFileInput>
          </InputSection>
        }
      </Container>
    </>
  );
}

export default EventDetails;
