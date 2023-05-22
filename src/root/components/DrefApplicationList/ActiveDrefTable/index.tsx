import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { History } from 'history';

import languageContext from '#root/languageContext';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import EmptyMessage from '#components/EmptyMessage';
import BlockLoading from '#components/block-loading';

import DrefApplicationTable from '../DrefApplicationTable';
import { BaseProps, TableDataDetail } from '..';
import styles from '../styles.module.scss';

interface Props {
  className?: string;
  history: History;
  country?: number;
  drefType?: number;
  itemPerPage: number;
  onChanngeDrefCount: (count: number) => void;
  drefActivePage: number;
}

export interface DrefApplicationResponse extends BaseProps {
  is_final_report_created: boolean;
  operational_update_details: BaseProps[];
  final_report_details: BaseProps[];
}

function ActiveDrefTable(props:Props) {
  const {
    className,
    history,
    country,
    drefType,
    itemPerPage,
    onChanngeDrefCount,
    drefActivePage,
  } = props;

  const { strings } = React.useContext(languageContext);

  const {
    pending: drefPending,
    response: drefResponse,
    retrigger: refetchDrefList,
  } = useRequest<ListResponse<DrefApplicationResponse>>({
    url: 'api/v2/active-dref/',
    query: {
      country,
      type_of_dref: drefType,
      // created_at__lte: '',
      // created_at__gte: '',
      limit: itemPerPage,
      offset: itemPerPage * (drefActivePage - 1),
    },
  });

  onChanngeDrefCount(drefResponse?.count ?? 0);
  const data = React.useMemo(() => {

    let rowData = [];
    const hasOpsUpdateOnly = drefResponse?.results.filter(
      (d) => d.operational_update_details.length > 0 && d.final_report_details.length === 0);

    const opsUpdateData = hasOpsUpdateOnly?.map(
      (d) => {
        const opsLatest = d.operational_update_details?.sort(
          (a,b) => b.operational_update_number - a.operational_update_number)[0];

        const filterSubRowOpsUpdate = d.operational_update_details.filter(
          (ops) => ops.id !== opsLatest.id
        );
        let obj = {
          ...opsLatest,
          firstLevel: filterSubRowOpsUpdate,
          secondLevel: [{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            application_type: d.application_type,
            application_type_display: d.application_type_display,
            is_published: d.is_published,
            has_ops_update: d.has_ops_update,
            has_final_reprot: d.has_final_reprot,
          }],
        };
        return obj;
      });
    rowData.push(opsUpdateData);

    const hasfinalReportOnly = drefResponse?.results.filter(
      (d) => d.operational_update_details.length === 0 && d.final_report_details.length > 0);

    const finalReportData = hasfinalReportOnly?.map(
      (d) => {
        let obj = {
          ...d.final_report_details[0],
          firstLevel: [],
          secondLevel: [{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            application_type: d.application_type,
            application_type_display: d.application_type_display,
            is_published: d.is_published,
            has_ops_update: d.has_ops_update,
            has_final_reprot: d.has_final_reprot,
          }],
        };
        return obj;
      });
    rowData.push(finalReportData);

    const hasfinalReportAndOpsUpdate = drefResponse?.results.filter(
      (d) => d.operational_update_details.length > 0 && d.final_report_details.length > 0);

    const finalReportAndOpsUpdateData = hasfinalReportAndOpsUpdate?.map(
      (d) => {
        let obj = {
          ...d.final_report_details[0],
          firstLevel: d.operational_update_details.map((ops) => ({
            ...ops,
          })),
          secondLevel:[{
            id: d.id,
            created_at: d.created_at,
            title: d.title,
            appeal_code: d.appeal_code,
            type_of_dref_display: d.type_of_dref_display,
            submission_to_geneva: d.submission_to_geneva,
            country_details: d.country_details,
            application_type: d.application_type,
            application_type_display: d.application_type_display,
            is_published: d.is_published,
            has_ops_update: d.has_ops_update,
            has_final_reprot: d.has_final_reprot,
          }],
        };
        return obj;
      });
    rowData.push(finalReportAndOpsUpdateData);

    const hasDrefOnly = drefResponse?.results.filter(
      (d) => d.operational_update_details.length === 0 && d.final_report_details.length === 0);
    const drefData = hasDrefOnly?.map(
      (d) => {
        let obj = {
          ...d,
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
    <>
      {pending && <BlockLoading />}
      {!pending &&(
        <DrefApplicationTable
          className={_cs(className, styles.drefTable)}
          data={data}
          history={history}
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
    </>
  );
}

export default ActiveDrefTable;

