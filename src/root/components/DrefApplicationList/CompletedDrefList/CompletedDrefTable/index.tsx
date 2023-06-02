import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { History } from 'history';

import DateOutput from '#components/DateOutput';
import DropdownMenu from '#components/dropdown-menu';
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
import Button from '#components/Button';
import DrefExportButton from '#components/DrefExportButton';
import OperationalUpdateExport from '#components/OperationalUpdateExport';
import FinalReportExport from '#components/FinalReportExport';
import { BaseProps, CompletedDrefResponse } from '#components/DrefApplicationList/useDrefApplicationListOptions';
import ShareUserModal from '#components/DrefApplicationList/ShareUserModal';

import styles from '../styles.module.scss';

interface Props {
  className?: string;
  data?: CompletedDrefResponse[];
  refetch:() => void;
  history: History;
  getDrefId: (applicationType: string, id:number) => void;
  drefId?: number;
}

const APPROVED = 1;
const drefKeySelector = (d: CompletedDrefResponse) => d.id;

function CompletedDrefTable(props:Props) {
  const {
    className,
    data,
    getDrefId,
    drefId,
  } = props;

  const { strings } = React.useContext(languageContext);
  const [expandedRow, setExpandedRow] = React.useState<number>();
  const [showModal, setShowModal] = React.useState<boolean>(false);

  const handleExpandedClick = React.useCallback((rowId: number) => {
    setExpandedRow(expandedRow === rowId ? undefined : rowId);
  }, [expandedRow, setExpandedRow]);

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
            <Button
              className={styles.menuItemButton}
              variant='transparent'
              name={item.application_type}
              onClick={handleShareModal}
              value={item.id}
            >
              Share
            </Button>
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
            <Button
              className={styles.menuItemButton}
              variant='transparent'
              name={item.application_type}
              onClick={handleShareModal}
              value={item.id}
            >
              Share
            </Button>
            <OperationalUpdateExport
              className={styles.menuItemButton}
              variant="transparent"
              operationalId={item.id}
            />
          </>
        );
      }

      if(item.application_type === "DREF"){
        return(
          <>
            <Button
              className={styles.menuItemButton}
              variant='transparent'
              name={item.application_type}
              onClick={handleShareModal}
              value={item.id}
            >
              Share
            </Button>
            <DrefExportButton
              className={styles.menuItemButton}
              variant="transparent"
              drefId={item.id}
            />
          </>
        );
      }

      return;
    },[ handleShareModal ]);

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
              <TableData>{detail.application_type_display}</TableData>
              <TableData>{detail.title}</TableData>
              <TableData>{detail.appeal_code}</TableData>
              <TableData>{detail.country_details.name}</TableData>
              <TableData></TableData>
              <TableData>
                {detail.status === APPROVED
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

  const rowModifier = useRowExpansion<CompletedDrefResponse, number>(
    expandedRow,
    ({datum}) => {
      return(
        <>
          {getRowLevelData(datum.dref.operational_update_details)}
          {getRowLevelData([datum.dref])}
        </>
      );
    }
  );

  const [
  drefApplicationColumns,
] = React.useMemo(() => {
    const baseDrefColumns = [
      createDateColumn<CompletedDrefResponse, string | number>(
        'created_at',
        strings.drefTableCreatedOn,
        (item) => item?.created_at,
      ),
      createStringColumn<CompletedDrefResponse, string | number>(
        'type',
        'Type',
        (item) => item.application_type_display,
      ),
      createStringColumn<CompletedDrefResponse, string | number>(
        'title',
        strings.drefTableName,
        (item) => item?.title,
      ),
      createStringColumn<CompletedDrefResponse, string | number>(
        'appeal_code',
        strings.drefTableAppealNumber,
        (item) => item?.appeal_code,
      ),
      createStringColumn<CompletedDrefResponse, string | number>(
        'country_details',
        'Country',
        (item) => item.country_details.name,
      ),
      createStringColumn<CompletedDrefResponse, string | number>(
        'type_of_dref_display',
        'Submitted/Approved on',
        () => '',
      ),
      createStringColumn<CompletedDrefResponse, string | number>(
        'status_display',
        'Status',
        (item) => item.status === APPROVED ? 'Approved' : item.status_display,
      ),
    ];

    const columnWithActions = [
      createActionColumn<CompletedDrefResponse, number>(
        'actions',
        (_, item: CompletedDrefResponse) => ({
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
        createExpandColumn<CompletedDrefResponse, number>(
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

