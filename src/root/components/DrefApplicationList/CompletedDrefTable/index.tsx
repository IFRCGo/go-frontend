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
import Pager from '#components/Pager';

import DrefApplicationTable from '../DrefApplicationTable';
import { BaseProps } from '../useDrefApplicationListOptions';
import styles from '../styles.module.scss';

const ITEM_PER_PAGE = 6;

interface Props {
  className?: string;
  history: History;
  country?: number;
  drefType?: number;
  appealCode?: string;
  disasterType?: number;
}

interface DrefDetails extends BaseProps {
  operational_update_details: BaseProps[];
  final_report_details: BaseProps[];
}

interface DrefApplicationResponse extends BaseProps {
  dref: DrefDetails;
}

function CompletedDrefTable(props:Props) {
  const {
    className,
    history,
    country,
    drefType,
    appealCode,
    disasterType,
  } = props;

  const { strings } = React.useContext(languageContext);
  const [drefId, setDrefId] = React.useState<number>();
  const [drefActivePage, setDrefActivePage] = React.useState(1);

  const {
    pending: drefPending,
    response: drefResponse,
    retrigger: refetchDrefList,
  } = useRequest<ListResponse<DrefApplicationResponse>>({
    url: 'api/v2/completed-dref/',
    query: {
      disaster_type: disasterType,
      appeal_code: appealCode,
      country,
      type_of_dref: drefType,
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (drefActivePage - 1),
    },
  });

  const data = React.useMemo(() => {
    let rowData = drefResponse?.results.map(
      (d) => {
        let obj = {
          ...d,
          firstLevel: d.dref.operational_update_details,
          secondLevel: [{
            id: d.id,
            created_at: d.dref.created_at,
            title: d.dref.title,
            appeal_code: d.dref.appeal_code,
            type_of_dref_display: d.dref.type_of_dref_display,
            submission_to_geneva: d.dref.submission_to_geneva,
            country_details: d.dref.country_details,
            application_type: d.dref.application_type,
            application_type_display: d.dref.application_type_display,
            is_published: d.dref.is_published,
            has_ops_update: d.dref.has_ops_update,
            has_final_reprot: d.dref.has_final_reprot,
            unpublished_op_update_count: d.dref.unpublished_op_update_count,
            unpublished_final_report_count: d.dref.unpublished_final_report_count,
            status_display: d.dref.status_display,
          }],
        };
        return obj;
      });
    return rowData;

  },[drefResponse]);

  const pending = drefPending;

  const getDrefId = React.useCallback(
    (applicationType, id) => {
      if(applicationType === 'FINAL_REPORT'){
        let newDrefId = drefResponse?.results.filter(
          (d) => d.dref.final_report_details.find(
            (fd) => fd.id === Number(id)
          ))[0];

        setDrefId(newDrefId?.id);
      }else if(applicationType === 'OPS_UPDATE'){
        let newDrefId = drefResponse?.results.filter(
          (d) => d.dref.operational_update_details.find(
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
      {!pending &&(
        <div className={styles.drefOperationTable}>
          <DrefApplicationTable
            className={_cs(className, styles.drefTable)}
            data={data}
            history={history}
            refetch={refetchDrefList}
            getDrefId={getDrefId}
            drefId={drefId}
          />
          <Pager
            className={styles.pagination}
            activePage={drefActivePage}
            onActivePageChange={setDrefActivePage}
            itemsCount={drefResponse?.count ?? 0}
            maxItemsPerPage={ITEM_PER_PAGE}
          />
        </div>
      )}

      {!drefPending && drefResponse?.results?.length === 0 && data?.length === 0 && (
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

export default CompletedDrefTable;

