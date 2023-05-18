import React from 'react';
import { History } from 'history';
import {
  EntriesAsList,
  Error,
  PartialForm,
} from '@togglecorp/toggle-form';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import SelectInput from '#components/SelectInput';
import Pager from '#components/Pager';
import EmptyMessage from '#components/EmptyMessage';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import { compareLabel } from '#utils/common';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import DrefApplicationTable from './DrefApplicationTable';

import styles from './styles.module.scss';

export interface BaseProps {
  id: number;
  title: string;
  appeal_code: string;
  created_at: string;
  submission_to_geneva: string;
  is_published: boolean;
  type_of_dref?: number;
  type_of_dref_display: string;
  type_of_onset_display: string;
  operational_update_number: number;
  type_application: string;
  type_application_display: string;
  status: string;
  country_details: {
    id: number;
    country: number;
    district: number[];
    name: string;
  };
}

export interface DrefApplicationResponse extends BaseProps {
  is_final_report_created: boolean;
  operational_update_details: BaseProps[];
  final_report_details: BaseProps;
}

export interface TableDataDetail extends BaseProps {
  firstLevel: BaseProps[];
  secondLevel: BaseProps[];
}

const ITEM_PER_PAGE = 6;

interface DrefImportFields {
  file: number;
  dref: number;
  id: number;
}

type Value = PartialForm<DrefImportFields>;
interface Props {
  history: History;
  value: Value,
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
}


function DrefApplicationList(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const allCountries = useReduxState('allCountries');
  const [country, setCountry] = useInputState<number | undefined>(undefined);
  const countryOptions = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.name
    )).map((c) => ({
        value: c.id,
        label: c.name,
      })).sort(compareLabel) ?? [],
    [allCountries],
  ); // a code duplication can be found in per-account.js

  const [inProgressDrefActivePage, setInProgressDrefActivePage] = React.useState(1);

  const {
    pending: drefPending,
    response: drefResponse,
    retrigger: refetchDrefList,
  } = useRequest<ListResponse<DrefApplicationResponse>>({
    url: 'api/v2/active-dref/',
    query: {
      // country,
      // is_published: false,
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (inProgressDrefActivePage - 1),
    },
  });

  const data = React.useMemo(() => {

    let rowData = [];
    const hasOpsUpdateOnly = drefResponse?.results.filter(
      (d) => d.operational_update_details.length > 0 && !d.final_report_details);
    const opsUpdateData = hasOpsUpdateOnly?.map(
      (d) => {
        const opsLatest = d.operational_update_details?.sort(
          (a,b) => b.operational_update_number - a.operational_update_number)[0];

        let obj = {
          ...opsLatest,
          type_application: "OPS_UPDATE",
          type_application_display: `Operational update #${opsLatest.operational_update_number}`,

          firstLevel:[{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            type_application:'DREF',
            type_application_display: "DREF application",
          }],
          secondLevel: [],
        };
        return obj;
      });
    rowData.push(opsUpdateData);

    const hasfinalReportOnly = drefResponse?.results.filter(
      (d) => !d.operational_update_details && d.final_report_details);
    const finalReportData = hasfinalReportOnly?.map(
      (d) => {
        let obj = {
          ...d.final_report_details,
          type_application: "FINAL_REPORT",
          type_application_display: "Final report",

          firstLevel: [{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            type_application: 'DREF',
            type_application_display: "DREF application",
          }],
          secondLevel: [],
        };
        return obj;
      });
    rowData.push(finalReportData);

    const hasfinalReportAndOpsUpdate = drefResponse?.results.filter(
      (d) => d.operational_update_details && d.final_report_details);
    const finalReportAndOpsUpdateData = hasfinalReportAndOpsUpdate?.map(
      (d) => {
        let obj = {
          ...d.final_report_details,
          type_application: "FINAL_REPORT",
          type_application_display: "Final report",

          firstLevel:[{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            type_application: 'DREF',
            type_application_display: "DREF application",
          }],
          secondLevel: d.operational_update_details.map((ops) => ({
            ...ops,
            type_application: "OPS_UPDATE",
            type_application_display: `Operational update #${ops.operational_update_number}`
          }))
        };
        return obj;
      });
    rowData.push(finalReportAndOpsUpdateData);

    const hasDrefOnly = drefResponse?.results.filter((d) => d.operational_update_details.length === 0 && !d.final_report_details);
    const drefData = hasDrefOnly?.map(
      (d) => {
        let obj = {
          ...d,
          type_application: 'DREF',
          type_application_display: "DREF application",
          firstLevel: [],
          secondLevel: [],
        };
        return obj;
      });
    rowData.push(drefData);

    return rowData.flat() as TableDataDetail[];

  },[drefResponse]);

  const pending = drefPending;

  return (
    <Container
      className={styles.drefApplicationList}
      contentClassName={styles.content}
      descriptionClassName={styles.filters}
      description={(
        <SelectInput
          name={undefined}
          className={styles.countryFilter}
          placeholder="Select Country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
          isClearable
          disabled={pending}
        />
      )}
    >

      <Container
        // heading={strings.drefTableInProgressHeading}
        heading="Active DREF Operations"
        sub
        footerActions={drefResponse && (
          <Pager
            activePage={inProgressDrefActivePage}
            onActivePageChange={setInProgressDrefActivePage}
            itemsCount={drefResponse.count}
            maxItemsPerPage={ITEM_PER_PAGE}
          />
        )}
      >
        {pending && <BlockLoading />}
        {!pending && data.length > 0 && (
          <DrefApplicationTable
            className={styles.drefTable}
            data={data}
            refetch={refetchDrefList}
          />
        )}
        {!drefPending && drefResponse?.results?.length === 0 && data.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !drefResponse && (
          <div className={styles.error}>
            {strings.drefFetchingErrorMessage}
          </div>
        )}
      </Container>
    </Container>
  );
}

export default DrefApplicationList;
