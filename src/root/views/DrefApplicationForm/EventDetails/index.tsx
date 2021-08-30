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

    console.info(fieldReport.created_at);
    onValueSet({
      ...value,
      go_field_report_date: fieldReport.created_at?.split('T')[0],
    });
  }, [fetchedFieldReports, onValueSet, value]);

  return (
    <>
      <Container visibleOverflow>
        <InputSection
          title={strings.eventDetailsTitle}
          description={strings.eventDescription}
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
        heading={strings.previousOperations}
        className={styles.previousOperations}
      >
        <InputSection
          title={strings.affectSameArea}
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
          title={strings.affectedthePopulationTitle}
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
          title={strings.nsRespond}
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
          title={strings.nsRequest}
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
            title={strings.nsFundingDetail}
          >
            <TextInput
              placeholder={strings.nsFundingDetailDescription}
              name="ns_request_text"
              value={value.ns_request_text}
              onChange={onValueChange}
              error={error?.fields?.ns_request_text}
            />
          </InputSection>
        )}
        {isImminentOnset && (
          <InputSection
            title={strings.lessonsLearnedTitle}
            description={strings.lessonsLearnedDescription}
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
        heading={strings.descriptionEvent}
        className={styles.eventDetails}
      >
        <InputSection
          title={strings.whatWhereWhen}
          description={strings.whatWhereWhenDescription}
          oneColumn
          multiRow
        >
          <TextArea
            name="event_description"
            onChange={onValueChange}
            value={value.event_description}
            error={error?.fields?.event_description}
            placeholder={strings.whatWhereWhenPlaceholder}
          />
        </InputSection>
        <InputSection
          title={strings.uploadPhotos}
        >
          <GoFileInput
            name="images"
            value={value.images}
            onChange={onValueChange}
            accept="image/*"
            multiple
            showStatus
            error={error?.fields?.images}
          >
            Upload
          </GoFileInput>
        </InputSection>
        <InputSection
          title={strings.scopeAndScaleEvent}
          description={strings.scopeAndScaleDescription}
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
