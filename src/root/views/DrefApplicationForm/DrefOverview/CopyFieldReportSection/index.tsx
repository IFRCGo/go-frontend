import React from 'react';
import {
  isNotDefined,
  unique,
  randomString,
} from '@togglecorp/fujs';
import {
  PartialForm,
  StateArg,
} from '@togglecorp/toggle-form';

import Button from '#components/Button';
import SearchSelectInput from '#components/SearchSelectInput';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import LanguageContext from '#root/languageContext';
import useInputState from '#hooks/useInputState';
import useAlert from '#hooks/useAlert';

import {
  useRequest,
  useLazyRequest,
  ListResponse,
} from '#utils/restRequest';
import { FieldReportAPIResponseFields } from '#views/FieldReportForm/common';

import {
  NumericValueOption,
  emptyNumericOptionList,
  DrefFields,
} from '../../common';

import styles from './styles.module.scss';

type Value = PartialForm<DrefFields>;
type FieldReportListItem = Omit<FieldReportAPIResponseFields, 'districts'> & { districts: number[]};
interface Props {
  value: Value;
  onValueSet: (value: StateArg<Value>) => void;
}

function CopyFieldReportSection (props: Props) {
  const {
    value,
    onValueSet,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const alert = useAlert();

  type FRCallback = (options: NumericValueOption[]) => void;
  const [fieldReport, setFieldReport] = useInputState<number | undefined>(value?.field_report);
  const [fieldReportSearch, setFieldReportSearch] = React.useState<string | undefined>();
  const [fetchedFieldReports, setFetchedFieldReports] = React.useState<FieldReportListItem[]>([]);
  const fieldReportCallbackRef = React.useRef<FRCallback>();

  useRequest<ListResponse<FieldReportListItem>>({
    skip: (fieldReportSearch?.length ?? 0) === 0,
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

  const {
    trigger: triggerSelectedFrRequest,
    pending: selectedFrPending,
  } = useLazyRequest<FieldReportAPIResponseFields, number>({
    url: (frId) => `api/v2/field_report/${frId}`,
    onSuccess: (fr) => {
      if (fieldReportCallbackRef.current) {
        const frOption = {
          value: fr.id,
          label: fr.summary,
        };
        fieldReportCallbackRef.current([frOption] ?? emptyNumericOptionList);
      }
    }
  });

  const {
    pending: frDetailPending,
    trigger: triggerDetailRequest,
  } = useLazyRequest<FieldReportAPIResponseFields, number>({
    url: (frId) => `api/v2/field_report/${frId}`,
    onSuccess: (fieldReport) => {
      if (!fieldReport) {
        alert.show(
          strings.drefFormCopyFRFailureMessage,
          { variant: 'danger' },
        );
        return;
      }

      const frDate = fieldReport.created_at?.split('T')[0];
      const go_field_report_date = value.go_field_report_date ?? frDate;
      const disaster_type = value.disaster_type ?? fieldReport.dtype?.id;
      const event_description = value.event_description ?? fieldReport.description;
      const un_or_other_actor = value.un_or_other_actor ?? fieldReport.actions_others;
      let country_district = value.country_district ?? [];

      let {
        national_society_contact_name,
        national_society_contact_email,
        ifrc_emergency_name,
        ifrc_emergency_email,
        media_contact_name,
        media_contact_email,
      } = value;

      if (country_district.length === 1 && isNotDefined(country_district[0].country)) {
        country_district = [{
          clientId: randomString(),
          country: fieldReport.countries[0]?.id,
          district: fieldReport.districts?.map(d => d.id),
        }];
      }

      if (!national_society_contact_name && !national_society_contact_email) {
        const contact = fieldReport.contacts?.find(c => c.ctype === 'NationalSociety');
        if (contact) {
          national_society_contact_name = contact.name;
          national_society_contact_email = contact.email;
        }
      }

      if (!ifrc_emergency_name && !ifrc_emergency_email) {
        const contact = fieldReport.contacts?.find(c => c.ctype === 'Federation');
        if (contact) {
          ifrc_emergency_name = contact.name;
          ifrc_emergency_email = contact.email;
        }
      }

      if (!media_contact_name && !media_contact_email) {
        const contact = fieldReport.contacts?.find(c => c.ctype === 'Media');
        if (contact) {
          media_contact_name = contact.name;
          media_contact_email = contact.email;
        }
      }

      onValueSet({
        ...value,
        go_field_report_date,
        disaster_type,
        event_description,
        country_district,
        un_or_other_actor,
        national_society_contact_name,
        national_society_contact_email,
        ifrc_emergency_name,
        ifrc_emergency_email,
        media_contact_name,
        media_contact_email,
        field_report: fieldReport.id,
      });

      alert.show(
        strings.drefFormCopyFRSuccessMessage,
        { variant: 'success' },
      );
    },
  });

  const handleFieldReportLoad = React.useCallback((
    input: string | undefined,
    callback: FRCallback,
  ) => {
    if (!input) {
      if (isNotDefined(value.field_report)) {
        callback(emptyNumericOptionList);
      } else {
        triggerSelectedFrRequest(value.field_report);
      }
    }

    setFieldReportSearch(input);
    fieldReportCallbackRef.current = callback;
  }, [value.field_report, triggerSelectedFrRequest]);

  const handleCopyButtonClick = React.useCallback((fieldReportId: number | undefined) => {
    if (isNotDefined(fieldReportId)) {
      return;
    }

    triggerDetailRequest(fieldReportId);
  }, [triggerDetailRequest]);

  const initialOptions = React.useMemo(() => {
    const optionList = fetchedFieldReports.map((fr) => ({
      value: fr.id,
      label: fr.summary,
    }));

    return optionList;
  }, [fetchedFieldReports]);

  return (
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
          initialOptions={initialOptions}
          pending={selectedFrPending}
          defaultOptions
        />
        <div className={styles.actions}>
          <Button
            disabled={isNotDefined(fieldReport) || frDetailPending}
            onClick={handleCopyButtonClick}
            name={fieldReport}
          >
            {strings.drefFormCopyButtonLabel}
          </Button>
        </div>
      </InputSection>
    </Container>
  );
}

export default CopyFieldReportSection;
