import React from 'react';
import {
  isNotDefined,
  unique,
} from '@togglecorp/fujs';
import {
  PartialForm,
  Error,
  EntriesAsList,
  StateArg,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import Button from '#components/Button';
import SearchSelectInput from '#components/SearchSelectInput';
import RadioInput from '#components/RadioInput';
import TextArea from '#components/TextArea';
import LanguageContext from '#root/languageContext';
import useInputState from '#hooks/useInputState';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import { FieldReportAPIResponseFields } from '#views/FieldReportForm/common';
import GoFileInput from '#components/GoFileInput';

import {
  optionLabelSelector,
  BooleanValueOption,
  booleanOptionKeySelector,
  DrefFields,
  NumericValueOption,
  emptyNumericOptionList,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<DrefFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  yesNoOptions: BooleanValueOption[];
  isImminentOnset: boolean;
  onValueSet: (value: StateArg<Value>) => void;
  fileIdToUrlMap?: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function EventDetails(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error,
    onValueChange,
    value,
    yesNoOptions,
    isImminentOnset,
    onValueSet,
    fileIdToUrlMap,
    setFileIdToUrlMap,
  } = props;

  type FRCallback = (options: NumericValueOption[]) => void;
  const [fieldReport, setFieldReport] = useInputState<number | undefined>(undefined);
  const [fieldReportSearch, setFieldReportSearch] = React.useState<string | undefined>();
  const [fetchedFieldReports, setFetchedFieldReports] = React.useState<FieldReportAPIResponseFields[]>([]);
  const fieldReportCallbackRef = React.useRef<FRCallback>();

  useRequest<ListResponse<FieldReportAPIResponseFields>>({
    skip: isNotDefined(fieldReportSearch),
    url: 'api/v2/field_report/',
    query: {
      summary: fieldReportSearch,
      limit: 20,
    },
    onSuccess: (response) => {
      if (fieldReportCallbackRef.current) {
        const frOptions = response?.results?.map((fr) => ({
          value: fr.id,
          label: fr.summary,
        }));
        fieldReportCallbackRef.current(frOptions ?? emptyNumericOptionList);
        setFetchedFieldReports((oldFieldReports) => {
          const newFieldReports = unique(
            [
              ...oldFieldReports,
              ...(response?.results ?? []),
            ],
            d => d.id
          ) ?? [];

          return newFieldReports;
        });
      }
    }
  });

  const handleFieldReportLoad = React.useCallback((
    input: string | undefined,
    callback: FRCallback,
  ) => {
    if (!input) {
      callback(emptyNumericOptionList);
    }

    setFieldReportSearch(input);
    fieldReportCallbackRef.current = callback;
  }, []);

  const copyFieldReportData = React.useCallback((fieldReportId: number | undefined) => {
    if (isNotDefined(fieldReportId)) {
      return;
    }

    const fieldReport = fetchedFieldReports.find(fr => fr.id === fieldReportId);
    if (!fieldReport) {
      return;
    }

    onValueSet({
      ...value,
      go_field_report_date: fieldReport.created_at?.split('T')[0],
    });
  }, [fetchedFieldReports, onValueSet, value]);

  return (
    <>
      <Container visibleOverflow>
        <InputSection
          title={strings.drefFormEventDetailsTitle}
          description={strings.drefFormEventDescription}
        >
          <SearchSelectInput
            name={undefined}
            value={fieldReport}
            onChange={setFieldReport}
            loadOptions={handleFieldReportLoad}
          />
          <div className={styles.actions}>
            <Button
              disabled={isNotDefined(fieldReport)}
              onClick={copyFieldReportData}
              name={fieldReport}
            >
              Copy
            </Button>
          </div>
        </InputSection>
      </Container>
      <Container
        heading={strings.drefFormPreviousOperations}
        className={styles.previousOperations}
      >
        <InputSection
          title={strings.drefFormAffectSameArea}
        >
          <RadioInput
            name="affect_same_area"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.affect_same_area}
            onChange={onValueChange}
            error={error?.fields?.affect_same_area}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormAffectedthePopulationTitle}
        >
          <RadioInput
            name="affect_same_population"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.affect_same_population}
            onChange={onValueChange}
            error={error?.fields?.affect_same_population}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNsRespond}
        >
          <RadioInput
            name="ns_respond"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.ns_respond}
            onChange={onValueChange}
            error={error?.fields?.ns_respond}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormNsRequest}
        >
          <RadioInput
            name="ns_request_fund"
            options={yesNoOptions}
            radioKeySelector={booleanOptionKeySelector}
            radioLabelSelector={optionLabelSelector}
            value={value.ns_request_fund}
            onChange={onValueChange}
            error={error?.fields?.ns_request_fund}
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
              error={error?.fields?.ns_request_text}
            />
          </InputSection>
        )}
        {isImminentOnset && (
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
              error={error?.fields?.lessons_learned}
              placeholder="Max 500 characters"
            />
          </InputSection>
        )}
      </Container>
      <Container
        heading={strings.drefFormDescriptionEvent}
        className={styles.eventDetails}
      >
        <InputSection
          title={strings.drefFormWhatWhereWhen}
          description={strings.drefFormWhatWhereWhenDescription}
          oneColumn
          multiRow
        >
          <TextArea
            name="event_description"
            onChange={onValueChange}
            value={value.event_description}
            error={error?.fields?.event_description}
            placeholder={strings.drefFormWhatWhereWhenPlaceholder}
          />
        </InputSection>
        <InputSection
          title={strings.drefFormUploadPhotos}
        >
          <GoFileInput
            name="images"
            value={value.images}
            onChange={onValueChange}
            accept="image/*"
            multiple
            showStatus
            error={error?.fields?.images}
            fileIdToUrlMap={fileIdToUrlMap}
            setFileIdToUrlMap={setFileIdToUrlMap}
          >
            Select images
          </GoFileInput>
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
            error={error?.fields?.event_scope}
            placeholder="Max 800 characters"
          />
        </InputSection>
      </Container>
    </>
  );
}

export default EventDetails;
