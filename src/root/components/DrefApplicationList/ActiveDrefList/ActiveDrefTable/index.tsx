import React from 'react';
import { isDefined, _cs } from '@togglecorp/fujs';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { History } from 'history';
import xlsx from 'exceljs';
import FileSaver from 'file-saver';

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
import { TYPE_LOAN } from '#views/DrefApplicationForm/common';
import DrefExportButton from '#components/DrefExportButton';
import OperationalUpdateExport from '#components/OperationalUpdateExport';
import FinalReportExport from '#components/FinalReportExport';
import { BaseProps, ActiveDrefTableDetail } from '#components/DrefApplicationList/useDrefApplicationListOptions';
import ShareUserModal from '#components/DrefApplicationList/ShareUserModal';
import ButtonLikeLink from '#components/ButtonLikeLink';
import { DrefOperationalUpdateApiFields } from '#views/DrefOperationalUpdateForm/common';
import { DrefApiFields } from '#views/DrefApplicationForm/common';

import styles from '../styles.module.scss';

interface Props {
  className?: string;
  data?: ActiveDrefTableDetail[];
  refetch:() => void;
  history: History;
  getDrefId: (applicationType: string, id:number) => void;
  drefId?: number;
}

interface DrefOperationalResponseFields {
  id: number;
}


interface ExportData {
  allocationFor: string;
  appealManager: string;
  projectManager: string;
  affectedCountry: string;
  name: string;
  disasterType: string;
  responseType: string;
  noOfPeopleTargeted: string | number;
  nsRequestDate: string;
  disasterStartDate: string;
  implementationPeriod: number;
  allocationRequested: number;
  previousAllocation: number;
  totalDREFAllocation: number;
  toBeAllocatedFrom: string;
  focalPointName: string;
}

const APPROVED = 1;
const drefKeySelector = (d: ActiveDrefTableDetail) => d.id;

function ActiveDrefTable(props:Props) {
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
    pending: drefPending,
    trigger: getDref,
  } = useLazyRequest<DrefApiFields>({
    url: (drefId) => `api/v2/dref/${drefId}/`,
    onSuccess: (response) => {
      const exportData = {
        allocationFor: response?.type_of_dref_display === 'Loan' ? 'Emergency Appeal' : 'DREF Operation',
        appealManager: response?.ifrc_appeal_manager_name,
        projectManager: response?.ifrc_project_manager_name,
        affectedCountry: response?.country_details?.name,
        name: response?.title,
        disasterType: response?.disaster_type_details?.name,
        responseType: response?.type_of_dref_display === 'Imminent' ? 'Imminent Crisis' : response?.type_of_onset_display,
        noOfPeopleTargeted: response?.num_assisted,
        nsRequestDate: response?.ns_request_date,
        disasterStartDate: response?.event_date,
        implementationPeriod: response?.operation_timeframe,
        allocationRequested: response?.amount_requested,
        previousAllocation: 0,
        totalDREFAllocation: response?.amount_requested,
        toBeAllocatedFrom: response?.type_of_dref_display === 'Imminent' ? 'Anticipatory Pillar' : 'Response Pillar',
        focalPointName: response?.regional_focal_point_name,
      };
      handleExport(exportData);
      }
  });

   async function handleExport(exportData: ExportData) {
    const {
      allocationFor,
      appealManager,
      projectManager,
      affectedCountry,
      name,
      disasterType,
      responseType,
      noOfPeopleTargeted,
      nsRequestDate,
      disasterStartDate,
      implementationPeriod,
      allocationRequested,
      previousAllocation,
      totalDREFAllocation,
      toBeAllocatedFrom,
      focalPointName,
    } = exportData;
    const workbook = new xlsx.Workbook();
    workbook.created = new Date();
    const imageSrc = '/assets/graphics/layout/ifrc-square.png';
    const response = await fetch(imageSrc);
    const buffer = await response.arrayBuffer();

    const image = workbook.addImage({
      buffer,
      extension: 'png',
    });
    const worksheet = workbook.addWorksheet(`${name} DREF Allocation`);
    worksheet.addImage(image, 'A1:B6');
    worksheet.getCell('C1').value = 'Disaster Response Emergency Fund';
    worksheet.getCell('C1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('C1:L3');
    worksheet.getCell('C1').style = { font: { bold: true, size: 18, color: { argb: '00F5333F' } } };
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('C4:L6');
    worksheet.getCell('C4').value = 'Fund Income Allocation Request';
    worksheet.getCell('C4').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('C4').style = { font: { bold: true, size: 14 } };
    worksheet.addRow('');
    worksheet.mergeCells('A7:L7');
    worksheet.mergeCells('A8:L8');
    worksheet.getCell('A7').value = 'To Be Completed By The DREF Focal Point';
    worksheet.getCell('A7').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A7').style = { font: { bold: true, size: 14 } };
    worksheet.getCell('A7').fill = {
      type: 'pattern',
      pattern: 'lightGray',
    };
    worksheet.getCell('A9').value = 'Dref Allocation is requested for';
    worksheet.getCell('G9').value = allocationFor;
    worksheet.mergeCells('A9:F9');
    worksheet.mergeCells('G9:L9');
    worksheet.getCell('A10').value = 'Appeal Manager';
    worksheet.getCell('G10').value = 'Project Manager';
    worksheet.getCell('A11').value = appealManager;
    worksheet.getCell('G11').value = projectManager;
    worksheet.addRow('');
    worksheet.mergeCells('A10:F10');
    worksheet.mergeCells('G10:L10');
    worksheet.mergeCells('A11:F11');
    worksheet.mergeCells('G11:L11');
    worksheet.mergeCells('A12:L12');
    worksheet.getCell('A13').value = 'Country of Operation';
    worksheet.getCell('G13').value = 'Name of Operation (as published)';
    worksheet.getCell('A14').value = affectedCountry;
    worksheet.getCell('G14').value = name;
    worksheet.addRow('');
    worksheet.mergeCells('A13:F13');
    worksheet.mergeCells('G13:L13');
    worksheet.mergeCells('A14:F14');
    worksheet.mergeCells('G14:L14');
    worksheet.mergeCells('A15:L15');
    worksheet.getCell('A16').value = 'Disaster / Hazard Type';
    worksheet.getCell('G16').value = 'Response Type';
    worksheet.getCell('J16').value = 'IFRC Targeted Assistance';
    worksheet.getCell('A17').value = disasterType;
    worksheet.getCell('G17').value = responseType;
    worksheet.getCell('J17').value = noOfPeopleTargeted;
    worksheet.addRow('');
    worksheet.mergeCells('A16:F16');
    worksheet.mergeCells('G16:I16');
    worksheet.mergeCells('J16:L16');
    worksheet.mergeCells('A17:F17');
    worksheet.mergeCells('G17:I17');
    worksheet.mergeCells('J17:L17');
    worksheet.mergeCells('A18:L18');
    worksheet.addRow(['For Early Action Protocols']);
    worksheet.mergeCells('A19:L19');
    worksheet.getCell('A19').style = { font: { color: { argb: '002E75B5' } } };
    worksheet.getCell('A20').value = 'Validation Committee Endorse Date';
    worksheet.getCell('I20').value = 'Early Action Protocol Reference';
    worksheet.getCell('J20').value = 'Operating Implementation Period';
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A20:D20');
    worksheet.mergeCells('E20:H20');
    worksheet.mergeCells('I20:L20');
    worksheet.mergeCells('A21:D21');
    worksheet.mergeCells('E21:H21');
    worksheet.mergeCells('I21:L21');
    worksheet.mergeCells('A22:L22');
    worksheet.addRow(['For DREF Operations and Emergency Appeals']);
    worksheet.getCell('A23').style = { font: { color: { argb: '002E75B5' } } };
    worksheet.mergeCells('A23:L23');
    worksheet.getCell('A24').value = 'National Society Request Date';
    worksheet.getCell('E24').value = 'Disaster Start or Trigger Date';
    worksheet.getCell('I24').value = 'Operating Implementation Period';
    worksheet.getCell('A25').value = nsRequestDate;
    worksheet.getCell('E25').value = disasterStartDate;
    worksheet.getCell('I25').value = implementationPeriod;
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A24:D24');
    worksheet.mergeCells('E24:H24');
    worksheet.mergeCells('I24:L24');
    worksheet.mergeCells('A25:D25');
    worksheet.mergeCells('E25:H25');
    worksheet.mergeCells('I25:L25');
    worksheet.mergeCells('A26:L26');
    worksheet.getCell('A27').value = 'Allocation CHF';
    worksheet.mergeCells('A27:L27');
    worksheet.getCell('A27').style = { font: { color: { argb: '002E75B5' } } };
    worksheet.getCell('A28').value = 'DREF Allocation Request CHF';
    worksheet.getCell('E28').value = 'Previous Allocation(s) CHF';
    worksheet.getCell('I28').value = 'Total Allocation(s) CHF';
    worksheet.getCell('A29').value = allocationRequested;
    worksheet.getCell('E29').value = previousAllocation;
    worksheet.getCell('I29').value = totalDREFAllocation;
    worksheet.addRow('');
    worksheet.mergeCells('A28:D28');
    worksheet.mergeCells('E28:H28');
    worksheet.mergeCells('I28:L28');
    worksheet.mergeCells('A29:D29');
    worksheet.mergeCells('E29:H29');
    worksheet.mergeCells('I29:L29');
    worksheet.mergeCells('A30:E30');
    worksheet.mergeCells('F30:L30');
    worksheet.mergeCells('A31:L31');
    worksheet.getCell('A30').value = 'To Be Allocated From';
    worksheet.getCell('F30').value = toBeAllocatedFrom;
    worksheet.addRow('');
    worksheet.getCell('A32').value = 'DREF Regional Focal Point Name';
    worksheet.getCell('I32').value = 'Date';
    worksheet.getCell('F32').value = 'Signature';
    worksheet.getCell('A33').value = focalPointName;
    worksheet.addRow('');
    worksheet.mergeCells('A32:E32');
    worksheet.mergeCells('F32:H32');
    worksheet.mergeCells('I32:L32');
    worksheet.mergeCells('A33:E33');
    worksheet.mergeCells('F33:H33');
    worksheet.mergeCells('I33:L33');
    worksheet.mergeCells('A34:L34');
    worksheet.addRow(['To Be Completed By DREF Appeal Manger']);
    worksheet.getCell('A35').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A35:L35');
    worksheet.getCell('A35').style = { font: { bold: true, size: 14 } };
    worksheet.getCell('A35').fill = {
        type: 'pattern',
        pattern: 'lightGray',
    };
    worksheet.getCell('A36').value = 'I herewith approve the Early Action Protocol/DREF Application, Operating Budget and Allocation of Funds per amount indicated above. Where applicable, I also confirm that I have sought additional approval from USG National Society  Development and Operations Coordination (email herewith attached)';
    worksheet.getCell('A36').alignment = { wrapText: true };
    worksheet.mergeCells('A36:L38');
    worksheet.addRow('');
    worksheet.mergeCells('A39:L39');
    worksheet.addRow(['Comments']);
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.addRow('');
    worksheet.mergeCells('A40:L40');
    worksheet.mergeCells('A41:L43');
    worksheet.getCell('A44').value = 'DREF Appeal Manager Name';
    worksheet.getCell('F44').value = 'Date';
    worksheet.getCell('I44').value = 'Signature';
    worksheet.addRow('');
    worksheet.mergeCells('A44:E44');
    worksheet.mergeCells('F44:H44');
    worksheet.mergeCells('I44:L44');
    worksheet.mergeCells('A45:E45');
    worksheet.mergeCells('F45:H45');
    worksheet.mergeCells('I45:L45');
    await workbook.xlsx.writeBuffer()
      .then((buffer) => {
          return FileSaver.saveAs(new Blob([buffer], { type: 'application/vnd.ms-excel;charset=utf-8' }), `${name} Allocation Form.xlsx`);
      });
    }

    const {
    pending: operationUpdatePending,
    trigger: getOperationUpdate,
  } = useLazyRequest<DrefOperationalUpdateApiFields>({
    url: (operationUpdateId) => `api/v2/dref-op-update/${operationUpdateId}/`,
    onSuccess: (response) => {
      const exportData = {
        allocationFor: 'DREF Operation',
        appealManager: response?.ifrc_appeal_manager_name,
        projectManager: response?.ifrc_project_manager_name,
        affectedCountry: response?.country_details?.name,
        name: response?.title,
        disasterType: response?.disaster_type_details?.name,
        responseType: response?.type_of_dref_display === 'Imminent' ? 'Imminent Crisis' : response?.type_of_onset_display,
        noOfPeopleTargeted: response?.number_of_people_targeted,
        nsRequestDate: response?.ns_request_date,
        disasterStartDate: response?.event_date,
        implementationPeriod: response?.total_operation_timeframe,
        allocationRequested: response?.additional_allocation,
        previousAllocation: 0,
        totalDREFAllocation: response?.total_dref_allocation,
        toBeAllocatedFrom: response?.type_of_dref_display === 'Imminent' ? 'Anticipatory Pillar' : 'Response Pillar',
        focalPointName: response?.regional_focal_point_name,
      };
      handleExport(exportData);
    }
  });

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

  const handleAllocationRequestExport = React.useCallback(({ type, id }: { type: string, id: number }) => {
    if (type === 'OPS_UPDATE') {
      getOperationUpdate(id);
    } else if (type  === 'DREF') {
      getDref(id);
    }
  }, [getDref, getOperationUpdate]);

  const handlePublishApplication = React.useCallback(
    ({ id, type }) =>{
      if(type === "DREF") {
        onDrefPublishClick(id);
      }

      if(type === "OPS_UPDATE") {
        onOperationalUpdatePublishClick(id);
      }

      if(type === "FINAL_REPORT") {
        onFinalReportPublishClick(id);
      }
    },[
      onDrefPublishClick,
      onOperationalUpdatePublishClick,
      onFinalReportPublishClick
    ]
  );

  const handleShareModal = React.useCallback(
    ({ type, id }) => {
      getDrefId(type, id);
      setShowModal(true);
    },[getDrefId]
  );

  const getInitialDropdownItems = React.useCallback(
    (item) => {
      const hasUnpublishedOperationalUpdate = item.unpublished_op_update_count > 0;
      const hasUnpublishedFinalReport = item.unpublished_final_report_count > 0;
      const isDrefLoan = item.type_of_dref === TYPE_LOAN;

      return (
        item.initial_row
          && !hasUnpublishedOperationalUpdate
          && item.is_published
          && !item.has_final_reprot
          && (
            <>
              {!hasUnpublishedOperationalUpdate
                && (
                  <DropdownMenuItem
                    name={item.drefId}
                    onClick={postDrefNewOperationalUpdate}
                    label={strings.drefOperationalUpdateNewLabel}
                    disabled={newOperationalUpdatePending}
                  />
                )}
              {!hasUnpublishedFinalReport
                && (
                  <DropdownMenuItem
                    name={item.drefId}
                    onClick={postDrefNewFinalReport}
                    label={strings.finalReportCreateButtonLabel}
                    disabled={isDrefLoan || newFinalReportPending}
                  />
                )}
            </>
          ));
    },[
      newFinalReportPending,
      newOperationalUpdatePending,
      postDrefNewFinalReport,
      postDrefNewOperationalUpdate,
      strings,
    ]
  );

  const getDropDownActions = React.useCallback(
    (item: BaseProps) => {
      if(item.application_type === "FINAL_REPORT"){
        return (
          !item.is_published && (
            <>
              <DropdownMenuItem
                name={{
                  id: item.id,
                  type: item.application_type,
                }}
                onClick={handlePublishApplication}
                disabled={drefPublishPending
                  || operationalUpdatePublishPending
                  || finalReportPublishPending}
                label="Approved"
              />
                <FinalReportExport
                  id={item.id}
                  variant='dropdown'
                />
              <DropdownMenuItem
                name={{
                  id: item.id,
                  type: item.application_type,
                }}
                onClick={handleShareModal}
                label="Share"
              />
            </>
          )
        );
      }

      if(item.application_type === "OPS_UPDATE"){
        return(
          <>
            {getInitialDropdownItems(item)}
            {!item.is_published && (
              <>
                <DropdownMenuItem
                  name={{
                    type: item.application_type,
                    id: item.id
                  }}
                  onClick={handlePublishApplication}
                  disabled={drefPublishPending
                    || operationalUpdatePublishPending
                    || finalReportPublishPending}
                  label="Approved"
                />
                <OperationalUpdateExport
                  variant="dropdown"
                  operationalId={item.id}
                />
              </>
            )}
            <DropdownMenuItem
              onClick={handleShareModal}
              name={{
                type: item.application_type,
                id: item.id
              }}
              label="Share"
            />
            {item.is_published && (
              <DropdownMenuItem
                name={{
                  type: item.application_type,
                  id: item.id
                }}
                onClick={handleAllocationRequestExport}
                disabled={drefPublishPending
                  || operationalUpdatePublishPending
                  || finalReportPublishPending
                  || drefPending
                  || operationUpdatePending}
                label="Allocation Request"
              />
            )}
          </>
        );
      }

      if(item.application_type === "DREF"){
        return(
          <>
            {getInitialDropdownItems(item)}
            {!item.is_published && (
              <>
                <DropdownMenuItem
                  name={{
                    type: item.application_type,
                    id: item.id
                  }}
                  onClick={handlePublishApplication}
                  disabled={drefPublishPending
                    || operationalUpdatePublishPending
                    || finalReportPublishPending}
                  label="Approved"
                />
                <DrefExportButton
                  variant="dropdown"
                  drefId={item.id}
                />
              </>
            )}
            <DropdownMenuItem
              onClick={handleShareModal}
              name={{
                type: item.application_type,
                id: item.id
              }}
              label="Share"
            />
            {item.is_published && (
              <DropdownMenuItem
                name={{
                  type: item.application_type,
                  id: item.id
                }}
                onClick={handleAllocationRequestExport}
                disabled={drefPublishPending
                  || operationalUpdatePublishPending
                  || finalReportPublishPending
                  || drefPending
                  || operationUpdatePending}
                label="Allocation Request"
              />
            )}
          </>
        );
      }
      return;
    },[
      drefPublishPending,
      operationalUpdatePublishPending,
      finalReportPublishPending,
      handlePublishApplication,
      handleShareModal,
      getInitialDropdownItems,
      drefPending,
      operationUpdatePending,
      handleAllocationRequestExport,
    ]);

  const getEditActions = React.useCallback(
    (item: BaseProps) => {
      if(item.application_type === "FINAL_REPORT"){
        return(
          <>
            {!item.is_published && (
              <ButtonLikeLink
                variant='secondary'
                to={`/dref-final-report/${item.id}/edit/`}
                disabled={finalReportPublishPending}
              >
                Edit
              </ButtonLikeLink>
            )}
            {item.is_published && (
              <FinalReportExport id={item.id} />
            )}
          </>
        );
      }

      if(item.application_type === "OPS_UPDATE"){
        return(
          <>
            {!item.is_published && (
              <ButtonLikeLink
                variant='secondary'
                to={`/dref-operational-update/${item.id}/edit/`}
                disabled={operationalUpdatePublishPending}
              >
                Edit
              </ButtonLikeLink>
            )}
            {item.is_published && (
              <OperationalUpdateExport operationalId={item.id} />
            )}
          </>
        );
      }

      if(item.application_type === "DREF"){
        return(
          <>
            {!item.is_published && (
              <ButtonLikeLink
                variant="secondary"
                to={`/dref-application/${item.id}/edit/`}
                disabled={drefPublishPending}
              >
                Edit
              </ButtonLikeLink>
            )}
            {item.is_published && (
              <DrefExportButton drefId={item.id} />
            )}
          </>
        );
      }
    },[
      finalReportPublishPending,
      operationalUpdatePublishPending,
      drefPublishPending,
    ]
  );

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
                {detail.status === APPROVED
                  ? 'Approved'
                  : 'In Progress'}
              </TableData>
              <TableData colSpan={2} className={styles.expandedRowActions}>
                <span>
                  {getEditActions(detail)}
                  <DropdownMenu
                    label={<IoEllipsisHorizontal />}
                  >
                    {getDropDownActions(detail)}
                  </DropdownMenu>
                </span>
              </TableData>
            </TableRow>
          )
        ));
    },[ getEditActions, getDropDownActions ]);

  const rowModifier = useRowExpansion<ActiveDrefTableDetail, number>(
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
      createDateColumn<ActiveDrefTableDetail, string | number>(
        'created_at',
        strings.drefTableCreatedOn,
        (item) => item?.created_at,
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        'appeal_code',
        strings.drefTableAppealNumber,
        (item) => item?.appeal_code,
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        'title',
        strings.drefTableName,
        (item) => item.title,
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        'type',
        strings.drefTableStageOfDref,
        (item) => item.application_type_display,
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        'country_details',
        strings.drefTableCountry,
        (item) => item.country_details.name,
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        'type_of_dref_display',
        strings.drefTableTypeOfDref,
        (item) => item?.type_of_dref_display,
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        'status_display',
        strings.drefTableDrefStatus,
        (item) => item.status === APPROVED ? 'Approved' : 'In Progress',
      ),
    ];

    const columnWithActions = [
      createActionColumn<ActiveDrefTableDetail, number>(
        'actions',
        (_, item: ActiveDrefTableDetail) => ({
          children: (
            getEditActions(item)
          ),
          extraActions: (
            getDropDownActions(item)
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
        createExpandColumn<ActiveDrefTableDetail, number>(
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
      getEditActions,
      getDropDownActions,
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

export default ActiveDrefTable;
