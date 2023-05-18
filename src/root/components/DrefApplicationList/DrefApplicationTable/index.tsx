import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoEllipsisHorizontal } from 'react-icons/io5';

import DateOutput from '#components/DateOutput';
import DropdownMenu from '#components/dropdown-menu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import OperationalUpdateExport from '#components/OperationalUpdateExport';
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

import { BaseProps, TableDataDetail } from '..';
import styles from '../styles.module.scss';

interface Props {
  className?: string;
  data?: TableDataDetail[];
  refetch:() => void;
}

interface DrefOperationalResponseFields {
  id: number;
}

const drefKeySelector = (d: TableDataDetail) => d.id;

function DrefApplicationTable(props:Props) {
  const {
    className,
    data,
    refetch,
  } = props;

  const alert = useAlertContext();
  const { strings } = React.useContext(languageContext);
  const [expandedRow, setExpandedRow] = React.useState<number>();

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
    pending: operationalUpdatePublishPending,
    trigger: postOperationalUpdatePublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number>({
    url: (operationalUpdateId) => operationalUpdateId ? `api/v2/dref-op-update/${operationalUpdateId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: () => {
      // refetch();
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
    pending: newOperationalUpdatePending,
    trigger: postDrefNewOperationalUpdate,
  } = useLazyRequest<BaseProps, number>({
    url: (drefId) => drefId ? `api/v2/dref-op-update/` : undefined,
    body: (drefId) => ({ dref: drefId }),
    method: 'POST',
    onSuccess: (response) => {
      // if (isDefined(response?.id)) {
      //   history.push(`/dref-operational-update/${response.id}/edit/`);
      // }
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
      // if (isDefined(response?.id)) {
      //   history.push(`/dref-final-report/${response.id}/edit/`);
      // }
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
    pending: finalReportPublishPending,
    trigger: postFinalReportPublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number | undefined>({
    url: (finalReportId) => finalReportId ? `api/v2/dref-final-report/${finalReportId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: () => {
      // refetch();
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

  const getTableActions = React.useCallback(
    (item: BaseProps) => {

      // NOTE: This has to be fix in server
      // const hasOperationalUpdate = item.operational_update_details && item.operational_update_details.length > 0;
      // const hasUnpublishedOperationalUpdate = item.operational_update_details?.some(d => !d.is_published) ?? false;
      //
      // const hasFinalReport = !!item.dref_final_report_details;
      //
      // const canAddNewOperationalUpdate = item.is_published && !hasUnpublishedOperationalUpdate && !hasFinalReport;
      // const lastOperationalUpdateId = item.operational_update_details?.find(ou => !ou.is_published)?.id;
      //
      // const canAddFinalReport = canAddNewOperationalUpdate;
      // const hasUnpublishedFinalReport = hasFinalReport && !item.dref_final_report_details?.is_published;
      //
      // const lastFinalReportId = item.dref_final_report_details?.id;
      //
      // const isDrefLoan = item.type_of_dref === TYPE_LOAN;
      if(item.type_application === "FINAL_REPORT"){
        return (
          <>
            <DropdownMenuItem
              href={`/dref-final-report/${item.id}/edit/`}
              label="Edit"
              disabled={item.is_published}
            />
            <DropdownMenuItem
              name={item.id}
              label={strings.drefPublishButtonLabel}
              onClick={onFinalReportPublishClick}
              disabled={operationalUpdatePublishPending || item.is_published}
            />
            <OperationalUpdateExport
              operationalId={item.id}
            />
          </>
        );
      }

      if(item.type_application === "OPS_UPDATE"){
        return(
          <>
            <DropdownMenuItem
              href={`/dref-operational-update/${item.id}/edit/`}
              label="Edit"
              disabled={item.is_published}
            />
            <DropdownMenuItem
              name={item.id}
              label={strings.drefPublishButtonLabel}
              onClick={onOperationalUpdatePublishClick}
              disabled={item.is_published}
            />
            <OperationalUpdateExport
              operationalId={item.id}
            />
          </>
        );
      }

      if(item.type_application === "DREF"){
        return(
          <>
            <DropdownMenuItem
              href={`/dref-application/${item.id}/edit/`}
              label={strings.drefTableEdit}
            />
            <DropdownMenuItem
              name={item.id}
              label={strings.drefPublishButtonLabel}
              onClick={onDrefPublishClick}
              disabled={drefPublishPending}
            />
            <DropdownMenuItem
              name={item.id}
              onClick={postDrefNewFinalReport}
              label={strings.finalReportCreateButtonLabel}
              disabled={true}
            />
            <DropdownMenuItem
              name={item.id}
              onClick={postDrefNewOperationalUpdate}
              label={strings.drefOperationalUpdateNewLabel}
              disabled={true}
            />
          </>
        );
      }

      return;
    },[
      strings,
      drefPublishPending,
      operationalUpdatePublishPending,
      onDrefPublishClick,
      onOperationalUpdatePublishClick,
      onFinalReportPublishClick,
      postDrefNewOperationalUpdate,
      postDrefNewFinalReport,
    ]);

  const rowLevelTableRow = React.useCallback(
    (opsData?: BaseProps[])=> {

      return (
        opsData?.sort(
          (a,b) => Date.parse(b.created_at) - Date.parse(a.created_at)).map(
          (detail) => (
            <TableRow key={detail.id} className={styles.expandedRow}>
              <TableData>
                <DateOutput value={detail.created_at} />
              </TableData>
              <TableData>{detail.appeal_code}</TableData>
              <TableData>{detail.title}</TableData>
              <TableData>{detail.type_application_display}</TableData>
              <TableData>{detail.country_details.name}</TableData>
              <TableData>{detail.type_of_dref_display}</TableData>
              <TableData>{detail.status}</TableData>
              <TableData colSpan={2} className={styles.expandedRowActions}>
                <span>
                  {/* <Button name={detail.id}> Approved </Button> */}
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
    },[getTableActions]);

  const rowModifier = useRowExpansion<TableDataDetail, number>(
    expandedRow,
    ({datum}) => {
      return(
        <>
          {rowLevelTableRow(datum.secondLevel)}
          {rowLevelTableRow(datum.firstLevel)}
        </>
      );
    }
  );

  const [
  inProgressApplicationColumns,
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
        (item) => item.type_application_display,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'country_details',
        'Country',
        (item) => item.country_details.name,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'type_of_dref_display',
        'Type of display',
        (item) => item?.type_of_dref_display,
      ),
      createStringColumn<TableDataDetail, string | number>(
        'status',
        'Status',
        (item) => item.status,
      ),
    ];

    const columnWithActions = [
      createActionColumn<TableDataDetail, number>(
        'actions',
        (rowKey: number, item: TableDataDetail) => ({
          /* children: (
            <Button name={rowKey}> Approved </Button>
            ), */
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
      getTableActions
    ]);

  return (
    <>
      <Table
        className={_cs(className, styles.drefTable)}
        data={data}
        columns={inProgressApplicationColumns}
        keySelector={drefKeySelector}
        variant="large"
        rowModifier={rowModifier}
        headerRowClassName={styles.tableHeader}
      />
      {publishDrefConfirmationModal}
      {publishOperationalUpdateConfirmationModal}
      {publishFinalReportConfirmationModal}
    </>
  );
}

export default DrefApplicationTable;

