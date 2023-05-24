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
import { BaseProps } from '../useDrefApplicationListOptions';
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
    itemPerPage,
    drefActivePage,
    onChanngeDrefCount,
  } = props;

  const { strings } = React.useContext(languageContext);
  const [drefId, setDrefId] = React.useState<number>();

  const {
    pending: drefPending,
    response: drefResponse,
    retrigger: refetchDrefList,
  } = useRequest<ListResponse<DrefApplicationResponse>>({
    url: 'api/v2/completed-dref/',
    query: {
      country,
      type_of_dref: drefType,
      limit: itemPerPage,
      offset: itemPerPage * (drefActivePage - 1),
    },
  });

  onChanngeDrefCount(drefResponse?.count ?? 0);
  const data = React.useMemo(() => {
    let rowData = drefResponse?.results.map(
      (d) => {
        let obj = {
          ...d,
          firstLevel: d.dref.operational_update_details,
          secondLevel: d.dref.final_report_details,
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
        <DrefApplicationTable
          className={_cs(className, styles.drefTable)}
          data={data}
          history={history}
          refetch={refetchDrefList}
          getDrefId={getDrefId}
          drefId={drefId}
        />
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

