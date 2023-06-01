import React from 'react';
import { isDefined, _cs } from '@togglecorp/fujs';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { History } from 'history';

import DateOutput from '#components/DateOutput';
import DropdownMenu from '#components/dropdown-menu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import useRowExpansion from '#components/Table/useRowExpansion';
import {
  createStringColumn,
  createDateColumn,
  createActionColumn,
  createExpandColumn,
} from '#components/Table/predefinedColumns';
import Table from '#components/Table';
import TableData from '#components/Table/TableData';
import TableRow from '#components/Table/TableRow';
import languageContext from '#root/languageContext';
import useConfirmation from '#hooks/useConfirmation';
import { useLazyRequest } from '#utils/restRequest';
import useAlertContext from '#hooks/useAlert';
import Button from '#components/Button';
import { TYPE_LOAN } from '#views/DrefApplicationForm/common';
import DrefExportButton from '#components/DrefExportButton';
import OperationalUpdateExport from '#components/OperationalUpdateExport';
import FinalReportExport from '#components/FinalReportExport';
import { BaseProps, TableDataDetail } from '#components/DrefApplicationList/useDrefApplicationListOptions';
import ShareUserModal from '#components/DrefApplicationList/ShareUserModal';

import styles from '../styles.module.scss';

interface Props {
  className?: string;
  data?: TableDataDetail[];
  refetch:() => void;
  history: History;
  getDrefId: (applicationType: string, id:number) => void;
  drefId?: number;
}

interface DrefOperationalResponseFields {
  id: number;
}

const drefKeySelector = (d: TableDataDetail) => d.id;

function CompletedDrefTable(props:Props) {
  const {
    className,
    data,
    refetch,
    history,
    getDrefId,
    drefId,
  } = props;

  const alert = useAlertContext();
  const { strings } = React.useContext(languageContext);
  const [expandedRow, setExpandedRow] = React.useState<number>();
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const {
    pending: drefPublishPending,
    trigger: postDrefPublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number>({
    url: (drefId) => drefId ? `api/v2/dref/${drefId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: () => {
      refetch();
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefFormLoadRequestFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });

  const {
    pending: newOperationalUpdatePending,
    trigger: postDrefNewOperationalUpdate,
  } = useLazyRequest<BaseProps, number>({
    url: (drefId) => drefId ? `api/v2/dref-op-update/` : undefined,
    body: (drefId) => ({ dref: drefId }),
    method: 'POST',
    onSuccess: (response) => {
      if (isDefined(response?.id)) {
        history.push(`/dref-operational-update/${response.id}/edit/`);
      }
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdateFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });
  const {
    pending: newFinalReportPending,
    trigger: postDrefNewFinalReport,
  } = useLazyRequest<BaseProps, number>({
    url: (drefId) => drefId ? `api/v2/dref-final-report/` : undefined,
    body: (drefId) => ({ dref: drefId }),
    method: 'POST',
    onSuccess: (response) => {
      if (isDefined(response?.id)) {
        history.push(`/dref-final-report/${response.id}/edit/`);
      }
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdateFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });

  const {
    pending: operationalUpdatePublishPending,
    trigger: postOperationalUpdatePublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number>({
    url: (operationalUpdateId) => operationalUpdateId ? `api/v2/dref-op-update/${operationalUpdateId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: () => {
      refetch();
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdatePublishConfirmationFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });

  const {
    pending: finalReportPublishPending,
    trigger: postFinalReportPublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number | undefined>({
    url: (finalReportId) => finalReportId ? `api/v2/dref-final-report/${finalReportId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: () => {
      refetch();
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.finalReportPublishConfirmationFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });

  const handleDrefPublishConfirm = React.useCallback((drefId: number) => {
    postDrefPublishRequest(drefId);
  }, [postDrefPublishRequest]);

  const handleOperationalUpdatePublishConfirm = React.useCallback((operationalUpdateId: number) => {
    postOperationalUpdatePublishRequest(operationalUpdateId);
  }, [postOperationalUpdatePublishRequest]);

  const handleFinalReportPublishConfirm = React.useCallback((finalReportId) => {
    postFinalReportPublishRequest(finalReportId);
  }, [
      postFinalReportPublishRequest,
    ]);

  const [
  publishDrefConfirmationModal,
  onDrefPublishClick,
] = useConfirmation({
    message: strings.drefPublishConfirmationMessage,
    onConfirm: handleDrefPublishConfirm,
  });

  const [
  publishOperationalUpdateConfirmationModal,
  onOperationalUpdatePublishClick,
] = useConfirmation({
    message: strings.drefOperationalUpdatePublishConfirmationMessage,
    onConfirm: handleOperationalUpdatePublishConfirm,
  });

  const [
  publishFinalReportConfirmationModal,
  onFinalReportPublishClick,
] = useConfirmation({
    message: strings.finalReportPublishConfirmationMessage,
    onConfirm: handleFinalReportPublishConfirm,
  });

  const handleExpandedClick = React.useCallback((rowId: number) => {
    setExpandedRow(expandedRow === rowId ? undefined : rowId);
  }, [expandedRow, setExpandedRow]);

  const handlePublishApplication = React.useCallback(
    (name, e) =>{
      const value = e.currentTarget.value;

      if(name === "DREF") {
        onDrefPublishClick(value);
      }

      if(name === "OPS_UPDATE") {
        onOperationalUpdatePublishClick(value);
      }

      if(name === "FINAL_REPORT") {
        onFinalReportPublishClick(value);
      }
    },[
      onDrefPublishClick,
      onOperationalUpdatePublishClick,
      onFinalReportPublishClick
    ]
  );

  const handleShareModal = React.useCallback(
    (name, e) => {
      getDrefId(name, e.currentTarget.value);
      setShowModal(true);
    },[getDrefId]
  );

  const getTableActions = React.useCallback(
    (item: BaseProps) => {

      if(item.application_type === "FINAL_REPORT"){
        return (
          <>
            {!item.is_published && (
              <>
                <DropdownMenuItem
                  href={`/dref-final-report/${item.id}/edit/`}
                  label="Edit"
                  disabled={item.is_published || finalReportPublishPending}
                />
                <Button
                  className={styles.menuItemButton}
                  variant='transparent'
                  name={item.application_type}
                  onClick={handleShareModal}
                  value={item.id}
                >
                  Share
                </Button>
              </>
            )}
            <FinalReportExport
              className={styles.menuItemButton}
              id={item.id}
              variant='transparent'
            />
          </>
        );
      }

      if(item.application_type === "OPS_UPDATE"){
        return(
          <>
            {!item.is_published && (
              <>
                <DropdownMenuItem
                  href={`/dref-operational-update/${item.id}/edit/`}
                  label="Edit"
                  disabled={item.is_published || operationalUpdatePublishPending}
                />
                <Button
                  className={styles.menuItemButton}
                  variant='transparent'
                  name={item.application_type}
                  onClick={handleShareModal}
                  value={item.id}
                >
                  Share
                </Button>
              </>
            )}
            <OperationalUpdateExport
              className={styles.menuItemButton}
              variant="transparent"
              operationalId={item.id}
            />
          </>
        );
      }

      if(item.application_type === "DREF"){
        const hasUnpublishedOperationalUpdate = item.unpublished_op_update_count > 0;
        const hasUnpublishedFinalReport = item.unpublished_final_report_count > 0;

        const isDrefLoan = item.type_of_dref === TYPE_LOAN;
        return(
          <>
            {!item.is_published && (
              <>
                <DropdownMenuItem
                  href={`/dref-application/${item.id}/edit/`}
                  label= {`${strings.drefTableEdit} ${item.application_type_display}`}
                />
                <Button
                  className={styles.menuItemButton}
                  variant='transparent'
                  name={item.application_type}
                  onClick={handleShareModal}
                  value={item.id}
                >
                  Share
                </Button>
              </>
            )}
            {!hasUnpublishedOperationalUpdate
              && item.is_published
              && !item.has_final_reprot
              && (
                <DropdownMenuItem
                  name={item.id}
                  onClick={postDrefNewOperationalUpdate}
                  label={strings.drefOperationalUpdateNewLabel}
                  disabled={newOperationalUpdatePending}
                />
              )}
            {!hasUnpublishedFinalReport
              && !hasUnpublishedOperationalUpdate
              && item.is_published
              && !item.has_final_reprot
              && (
                <DropdownMenuItem
                  name={item.id}
                  onClick={postDrefNewFinalReport}
                  label={strings.finalReportCreateButtonLabel}
                  disabled={isDrefLoan || newFinalReportPending}
                />
              )}
            <DrefExportButton
              className={styles.menuItemButton}
              variant="transparent"
              drefId={item.id}
            />
          </>
        );
      }

      return;
    },[
      strings,
      postDrefNewOperationalUpdate,
      postDrefNewFinalReport,
      operationalUpdatePublishPending,
      finalReportPublishPending,
      newOperationalUpdatePending,
      newFinalReportPending,
      handleShareModal,
    ]);

  const getRowLevelData = React.useCallback(
    (expandedData?: BaseProps[])=> {
      return (
        expandedData?.sort(
          (a,b) => Date.parse(b.created_at) - Date.parse(a.created_at)).map(
          (detail) => (
            <TableRow key={detail.id} className={styles.expandedRow}>
              <TableData>
                <DateOutput value={detail.created_at} />
              </TableData>
              <TableData>{detail.appeal_code}</TableData>
              <TableData>{detail.title}</TableData>
              <TableData>{detail.application_type_display}</TableData>
              <TableData>{detail.country_details.name}</TableData>
              <TableData>{detail.type_of_dref_display}</TableData>
              <TableData>
                {detail.status_display === 'Completed'
                  ? 'Approved'
                  : detail.status_display}
              </TableData>
              <TableData colSpan={2} className={styles.expandedRowActions}>
                <span>
                  <DropdownMenu
                    label={<IoEllipsisHorizontal />}
                  >
                    {getTableActions(detail)}
                  </DropdownMenu>
                </span>
              </TableData>
            </TableRow>
          )
        ));
    },[ getTableActions ]);

  const rowModifier = useRowExpansion<TableDataDetail, number>(
    expandedRow,
    ({datum}) => {
      return(
        <>
          {getRowLevelData(datum.firstLevel)}
          {getRowLevelData(datum.secondLevel)}
        </>
      );
    }
  );

  const [
  drefApplicationColumns,
] = React.useMemo(() => {
    const baseDrefColumns = [
      createDateColumn<TableDataDetail, string | number>(
        'created_at',
        strings.drefTableCreatedOn,
        (item) => item?.created_at,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'appeal_code',
        strings.drefTableAppealNumber,
        (item) => item?.appeal_code,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'title',
        strings.drefTableName,
        (item) => item?.title,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'type',
        'Type',
        (item) => item.application_type_display,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'country_details',
        'Country',
        (item) => item.country_details.name,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'type_of_dref_display',
        'Type of DREF',
        (item) => item?.type_of_dref_display,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'status_display',
        'Status',
        (item) => item.status_display === 'Completed' ? 'Approved' : item.status_display,
      ),
    ];

    const columnWithActions = [
      createActionColumn<TableDataDetail, number>(
        'actions',
        (rowKey: number, item: TableDataDetail) => ({
          children: (
            !item.is_published && (
              <Button
                variant='secondary'
                name={item.application_type}
                value={rowKey}
                onClick={handlePublishApplication}
                disabled={drefPublishPending
                  || operationalUpdatePublishPending
                  || finalReportPublishPending}
              >
                Approve
              </Button>
            )
          ),
          extraActions: (
            getTableActions(item)
          ),
        }),
        {
          cellRendererClassName: styles.actionsCell,
          headerContainerClassName: styles.actionsHeader,
        },
      ),
    ];
    return ([
      [
        ...baseDrefColumns,
        ...columnWithActions,
        createExpandColumn<TableDataDetail, number>(
          'expand-button',
          '',
          handleExpandedClick,
          expandedRow,
        ),
      ],
    ]);
  }, [
      expandedRow,
      handleExpandedClick,
      strings,
      getTableActions,
      handlePublishApplication,
      drefPublishPending,
      operationalUpdatePublishPending,
      finalReportPublishPending,
    ]);

  return (
    <>
      <Table
        className={_cs(className, styles.drefTable)}
        headerRowClassName={styles.tableHeader}
        data={data}
        columns={drefApplicationColumns}
        keySelector={drefKeySelector}
        variant="large"
        rowModifier={rowModifier}
      />
      {publishDrefConfirmationModal}
      {publishOperationalUpdateConfirmationModal}
      {publishFinalReportConfirmationModal}
      {showModal && (
        <ShareUserModal
          id={drefId}
          onClose={()=> setShowModal(!showModal)}
        />
      )}
    </>
  );
}

export default CompletedDrefTable;

