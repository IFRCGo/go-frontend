import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';
import { listToMap } from '@togglecorp/fujs';

import Container from '#components/Container';
import languageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import DREFFileInput from '#components/DREFFileInput';
import DateInput from '#components/DateInput';
import CaptionInput from '#views/DrefApplicationForm/CaptionInput';
import {
  DrefFinalReportFields, FileWithCaption,
} from '../common';
import styles from './styles.module.scss';

type Value = PartialForm<DrefFinalReportFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  isImminentOnset: boolean;
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  isSuddenOnset: boolean;
}

function EventDetails(props: Props) {
  const { strings } = React.useContext(languageContext);
  const {
    value,
    error: formError,
    onValueChange,
    isImminentOnset,
    fileIdToUrlMap,
    setFileIdToUrlMap,
    isSuddenOnset,
  } = props;
  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

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


  return (
    <Container
      heading={strings.finalReportDescriptionOfEvent}
    >
      <InputSection
        title={
          isImminentOnset
            ? strings.drefFormApproximateDateOfImpact
            : isSuddenOnset
              ? strings.drefFormEventDate
              : strings.drefFormSlowEventDate
        }
      >
        {isImminentOnset ? (
          <TextArea
            name="event_text"
            value={value.event_text}
            onChange={onValueChange}
            error={error?.event_text}
          />
        ) : (
          <DateInput
            name="event_date"
            value={value.event_date}
            onChange={onValueChange}
            error={error?.event_date}
          />
        )}
      </InputSection>
      <InputSection
        title={!isImminentOnset
          ? strings.finalReportWhatWhereWhen
          : strings.finalReportImminentDisaster}
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
      <InputSection
        title={strings.finalReportUploadPhotos}
        description={strings.drefFormUploadPhotosLimitation}
        contentSectionClassName={styles.imageInputContent}
      >
        <DREFFileInput
          name="images_file"
          value={imagesValue}
          onChange={handleImageInputChange}
          accept="image/*"
          multiple
          error={error?.images_file}
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
        title={strings.finalReportScopeAndScaleEvent}
        description={strings.finalReportScopeAndScaleDescription}
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
    </Container>
  );
}

export default EventDetails;
