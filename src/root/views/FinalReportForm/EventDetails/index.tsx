import React from 'react';
import {
  PartialForm,
  Error,
  EntriesAsList,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import languageContext from '#root/languageContext';
import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import DREFFileInput from '#components/DREFFileInput';

import {
  BooleanValueOption,
  DrefFinalReportFields,
} from '../common';

type Value = PartialForm<DrefFinalReportFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  isImminentOnset: boolean;
  fileIdToUrlMap?: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
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
  } = props;
  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  return (
    <Container
      heading={strings.finalReportDescriptionOfEvent}>
      <InputSection
        title={strings.finalReportUploadMap}
      >
        <DREFFileInput
          accept="image/*"
          name="photos"
          value={value.photos}
          onChange={onValueChange}
          showStatus
          multiple
          error={error?.photos}
          fileIdToUrlMap={fileIdToUrlMap}
          setFileIdToUrlMap={setFileIdToUrlMap}
        >
          Select images
        </DREFFileInput>
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
      >
        <DREFFileInput
          accept="image/*"
          name="images"
          value={value.images}
          onChange={onValueChange}
          showStatus
          multiple
          error={error?.images}
          fileIdToUrlMap={fileIdToUrlMap}
          setFileIdToUrlMap={setFileIdToUrlMap}
        >
          Select images
        </DREFFileInput>
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
