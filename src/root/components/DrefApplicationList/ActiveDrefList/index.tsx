import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { History } from 'history';

import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import EmptyMessage from '#components/EmptyMessage';
import BlockLoading from '#components/block-loading';
import Pager from '#components/Pager';

import { BaseProps, ActiveDrefTableDetail } from '../useDrefApplicationListOptions';
import ActiveDrefTable from './ActiveDrefTable';
import styles from './styles.module.scss';

const ITEM_PER_PAGE = 6;

interface Props {
  className?: string;
  history: History;
  country?: number;
  drefType?: number;
  appealCode?: string;
  disasterType?: number;
}

export interface DrefApplicationResponse extends BaseProps {
  is_final_report_created: boolean;
  operational_update_details: BaseProps[];
  final_report_details: BaseProps[];
}

function ActiveDrefList(props:Props) {
  const {
    className,
    history,
    country,
    drefType,
    appealCode,
    disasterType,
  } = props;

  const [drefId, setDrefId] = React.useState<number>();
  const [drefActivePage, setDrefActivePage] = React.useState(1);

  const {
    pending: drefPending,
    response: drefResponse,
    retrigger: refetchDrefList,
  } = useRequest<ListResponse<DrefApplicationResponse>>({
    url: 'api/v2/active-dref/',
    query: {
      disaster_type: disasterType,
      appeal_code: appealCode,
      country,
      type_of_dref: drefType,
      limit: ITEM_PER_PAGE,
      offset: (disasterType || drefType || appealCode || country)
        ? 0
        : ITEM_PER_PAGE * (drefActivePage - 1),
    },
  });

  const data = React.useMemo(() => {
    let rowData = [];
    const hasOpsUpdateOnly = drefResponse?.results.filter(
      (d) => (d.operational_update_details.length > 0 && d.final_report_details.length === 0));

    const opsUpdateData = hasOpsUpdateOnly?.map(
      (d) => {
        const opsLatest = d.operational_update_details[0];
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
            unpublished_op_update_count: d.unpublished_op_update_count,
            unpublished_final_report_count: d.unpublished_final_report_count,
            status_display: d.status_display,
          }],
        };
        return obj;
      });
    rowData.push(opsUpdateData);

    const hasfinalReportOnly = drefResponse?.results.filter(
      (d) => (d.operational_update_details.length === 0 && d.final_report_details.length > 0));

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
            unpublished_op_update_count: d.unpublished_op_update_count,
            unpublished_final_report_count: d.unpublished_final_report_count,
            status_display: d.status_display,
          }],
        };
        return obj;
      });
    rowData.push(finalReportData);

    const hasfinalReportAndOpsUpdate = drefResponse?.results.filter(
      (d) => (d.operational_update_details.length > 0 && d.final_report_details.length > 0));

    const finalReportAndOpsUpdateData = hasfinalReportAndOpsUpdate?.map(
      (d) => {
        let obj = {
          ...d.final_report_details[0],
          firstLevel: d.operational_update_details,
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
            unpublished_op_update_count: d.unpublished_op_update_count,
            unpublished_final_report_count: d.unpublished_final_report_count,
            status_display: d.status_display,
          }],
        };
        return obj;
      });
    rowData.push(finalReportAndOpsUpdateData);

    const hasDrefOnly = drefResponse?.results.filter(
      (d) => (d.operational_update_details.length === 0 && d.final_report_details.length === 0));

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

    const mergeArray = rowData.flat() as ActiveDrefTableDetail[];
    const sortedData = mergeArray.sort((a,b) => Date.parse(b?.created_at) - Date.parse(a?.created_at));

    return sortedData;
  },[drefResponse]);

  const pending = drefPending;

  const getDrefId = React.useCallback(
    (applicationType, id) => {
      if(applicationType === 'FINAL_REPORT'){
        let newDrefId = drefResponse?.results.filter(
          (d) => d.final_report_details.find(
            (fd) => fd.id === Number(id)
          ))[0];

        setDrefId(newDrefId?.id);
      }else if(applicationType === 'OPS_UPDATE'){
        let newDrefId = drefResponse?.results.filter(
          (d) => d.operational_update_details.find(
            (fd) => fd.id === Number(id)
          ))[0];

        setDrefId(newDrefId?.id);
      }else{
        let newDrefId = drefResponse?.results.find(
          (fd) => fd.id === Number(id)
        );

        setDrefId(newDrefId?.id);
      }
    },[drefResponse]
  );

  return (
    <>
      {pending && <BlockLoading />}
      {!pending && drefResponse &&(
        <div className={styles.drefOperationTable}>
          <ActiveDrefTable
            className={_cs(className, styles.drefTable)}
            data={data}
            history={history}
            refetch={refetchDrefList}
            getDrefId={getDrefId}
            drefId={drefId}
          />
          {drefResponse?.results.length > 0 &&(
            <Pager
              className={styles.pagination}
              activePage={drefActivePage}
              onActivePageChange={setDrefActivePage}
              itemsCount={drefResponse?.count}
              maxItemsPerPage={ITEM_PER_PAGE}
            />
          )}
        </div>
      )}

      {!drefPending && drefResponse?.results.length === 0 && (
        <EmptyMessage />
      )}
    </>
  );
}

export default ActiveDrefList;

