import React from 'react';
import { isDefined, _cs } from '@togglecorp/fujs';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { History } from 'history';
import xlsx from 'xlsx';

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

  const handleExport = (exportData: ExportData) => {
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
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet([[]]);
    xlsx.utils.book_append_sheet(workbook, worksheet, "DREF Allocation");
    const merge = [
      {
        s: { r: 0, c: 0 },
        e: { r: 1, c: 11 },
      },
      {
        s: { r: 2, c: 0 },
        e: { r: 4, c: 11 },
      },
      {
        s: { r: 5, c: 0 },
        e: { r: 6, c: 11 },
      },
      {
        s: { r: 7, c: 0 },
        e: { r: 7, c: 11 },
      },
      {
        s: { r: 8, c: 0 },
        e: { r: 8, c: 11 },
      },
      {
        s: { r: 9, c: 0 },
        e: { r: 9, c: 5 },
      },
      {
        s: { r: 9, c: 6 },
        e: { r: 9, c: 11 },
      },
      {
        s: { r: 10, c: 0 },
        e: { r: 10, c: 11 },
      },
      {
        s: { r: 11, c: 0 },
        e: { r: 11, c: 5 },
      },
      {
        s: { r: 11, c: 6 },
        e: { r: 11, c: 11 },
      },
      {
        s: { r: 12, c: 0 },
        e: { r: 12, c: 5 },
      },
      {
        s: { r: 12, c: 6 },
        e: { r: 12, c: 11 },
      },
      {
        s: { r: 13, c: 0 },
        e: { r: 13, c: 5 },
      },
      {
        s: { r: 13, c: 6 },
        e: { r: 13, c: 11 },
      },
      {
        s: { r: 14, c: 0 },
        e: { r: 14, c: 5 },
      },
      {
        s: { r: 14, c: 6 },
        e: { r: 14, c: 11 },
      },
      {
        s: { r: 15, c: 0 },
        e: { r: 15, c: 5 },
      },
      {
        s: { r: 15, c: 6 },
        e: { r: 15, c: 8 },
      },
      {
        s: { r: 15, c: 9 },
        e: { r: 15, c: 11 },
      },
      {
        s: { r: 16, c: 0 },
        e: { r: 16, c: 5 },
      },
      {
        s: { r: 16, c: 6 },
        e: { r: 16, c: 8 },
      },
      {
        s: { r: 16, c: 9 },
        e: { r: 16, c: 11 },
      },
      {
        s: { r: 17, c: 0 },
        e: { r: 17, c: 11 },
      },
      {
        s: { r: 18, c: 0 },
        e: { r: 18, c: 11 },
      },
      {
        s: { r: 19, c: 0 },
        e: { r: 19, c: 3 },
      },
      {
        s: { r: 19, c: 4 },
        e: { r: 19, c: 7 },
      },
      {
        s: { r: 19, c: 8 },
        e: { r: 19, c: 11 },
      },
      {
        s: { r: 20, c: 0 },
        e: { r: 20, c: 3 },
      },
      {
        s: { r: 20, c: 4 },
        e: { r: 20, c: 7 },
      },
      {
        s: { r: 20, c: 8 },
        e: { r: 20, c: 11 },
      },
      {
        s: { r: 21, c: 0 },
        e: { r: 21, c: 11 },
      },
      {
        s: { r: 22, c: 0 },
        e: { r: 22, c: 11 },
      },
      {
        s: { r: 23, c: 0 },
        e: { r: 23, c: 3 },
      },
      {
        s: { r: 23, c: 4 },
        e: { r: 23, c: 7 },
      },
      {
        s: { r: 23, c: 8 },
        e: { r: 23, c: 11 },
      },
      {
        s: { r: 24, c: 0 },
        e: { r: 24, c: 3 },
      },
      {
        s: { r: 24, c: 4 },
        e: { r: 24, c: 7 },
      },
      {
        s: { r: 24, c: 8 },
        e: { r: 24, c: 11 },
      },
      {
        s: { r: 25, c: 0 },
        e: { r: 25, c: 11 },
      },
      {
        s: { r: 26, c: 0 },
        e: { r: 26, c: 11 },
      },
      {
        s: { r: 27, c: 0 },
        e: { r: 27, c: 3 },
      },
      {
        s: { r: 27, c: 4 },
        e: { r: 27, c: 7 },
      },
      {
        s: { r: 27, c: 8 },
        e: { r: 27, c: 11 },
      },
      {
        s: { r: 28, c: 0 },
        e: { r: 28, c: 3 },
      },
      {
        s: { r: 28, c: 4 },
        e: { r: 28, c: 7 },
      },
      {
        s: { r: 28, c: 8 },
        e: { r: 28, c: 11 },
      },
      {
        s: { r: 29, c: 0 },
        e: { r: 29, c: 11 },
      },
      {
        s: { r: 30, c: 0 },
        e: { r: 30, c: 5 },
      },
      {
        s: { r: 30, c: 6 },
        e: { r: 30, c: 11 },
      },
      {
        s: { r: 31, c: 0 },
        e: { r: 31, c: 3 },
      },
      {
        s: { r: 31, c: 4 },
        e: { r: 31, c: 7 },
      },
      {
        s: { r: 31, c: 8 },
        e: { r: 31, c: 11 },
      },
      {
        s: { r: 32, c: 0 },
        e: { r: 32, c: 3 },
      },
      {
        s: { r: 32, c: 4 },
        e: { r: 32, c: 7 },
      },
      {
        s: { r: 32, c: 8 },
        e: { r: 32, c: 11 },
      },
      {
        s: { r: 33, c: 0 },
        e: { r: 33, c: 11 },
      },
      {
        s: { r: 34, c: 0 },
        e: { r: 34, c: 11 },
      },
      {
        s: { r: 35, c: 0 },
        e: { r: 35, c: 11 },
      },
      {
        s: { r: 36, c: 0 },
        e: { r: 36, c: 11 },
      },
      {
        s: { r: 37, c: 0 },
        e: { r: 37, c: 11 },
      },
      {
        s: { r: 38, c: 0 },
        e: { r: 38, c: 11 },
      },
      {
        s: { r: 39, c: 0 },
        e: { r: 39, c: 11 },
      },
      {
        s: { r: 40, c: 0 },
        e: { r: 42, c: 11 },
      },
      {
        s: { r: 43, c: 0 },
        e: { r: 43, c: 3 },
      },
      {
        s: { r: 43, c: 4 },
        e: { r: 43, c: 7 },
      },
      {
        s: { r: 43, c: 8 },
        e: { r: 43, c: 11 },
      },
      {
        s: { r: 44, c: 0 },
        e: { r: 44, c: 3 },
      },
      {
        s: { r: 44, c: 4 },
        e: { r: 44, c: 7 },
      },
      {
        s: { r: 44, c: 8 },
        e: { r: 44, c: 11 },
      },
    ];

    worksheet['!merges'] = merge;
    xlsx.utils.sheet_add_aoa(worksheet, [['Disaster Response Emergency Fund']], { origin: 0 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Fund Income Allocation Request']], { origin: 2 });
    xlsx.utils.sheet_add_aoa(worksheet, [['To Be Completed By The DREF Focal Point']], { origin: 7 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Dref Allocation is requested for']], { origin: { r: 9, c: 0 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[allocationFor]], { origin: { r: 9, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Appeal Manager']], { origin: 11 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Project Manager']], { origin: { r: 11, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[appealManager]], { origin: 12 });
    xlsx.utils.sheet_add_aoa(worksheet, [[projectManager]], { origin: { r: 12, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Country of Operation']], { origin: 13 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Name of Operation (as published)']], { origin: { r: 13, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[affectedCountry]], { origin: 14 });
    xlsx.utils.sheet_add_aoa(worksheet, [[name]], { origin: { r: 14, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Disaster / Hazard Type']], { origin: 15 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Response Type']], { origin: { r: 15, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['IFRC Targeted Assistance']], { origin: { r: 15, c: 9 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[disasterType]], { origin: 16 });
    xlsx.utils.sheet_add_aoa(worksheet, [[responseType]], { origin: { r: 16, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[noOfPeopleTargeted]], { origin: { r: 16, c: 9 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['For Early Action Protocols']], { origin: 18});
    xlsx.utils.sheet_add_aoa(worksheet, [['Validation Committee Endorse Date']], { origin: 19 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Early Action Protocol Reference']], { origin: { r: 19, c: 4 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Operating Implementation Period']], { origin: { r: 19, c: 8} });
    xlsx.utils.sheet_add_aoa(worksheet, [['For DREF Operations and Emergency Appeals']], { origin: 22 });
    xlsx.utils.sheet_add_aoa(worksheet, [['National Society Request Date']], { origin: 23 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Disaster Start or Trigger Date']], { origin: { r: 23, c: 4 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Operating Implementation Period']], { origin: { r: 23, c: 8 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[nsRequestDate]], { origin: 24 });
    xlsx.utils.sheet_add_aoa(worksheet, [[disasterStartDate]], { origin: { r: 24, c: 4 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[implementationPeriod]], { origin: { r: 24, c: 8 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Allocation Form']], { origin: 26 });
    xlsx.utils.sheet_add_aoa(worksheet, [['DREF Allocation Request CHF']], { origin: 27 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Previous Allocation(s) CHF']], { origin: { r: 27, c: 4 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Total Allocation(s) CHF']], { origin: { r: 27, c: 8 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[allocationRequested]], { origin: 28 });
    xlsx.utils.sheet_add_aoa(worksheet, [[previousAllocation]], { origin: { r: 28, c: 4 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[totalDREFAllocation]], { origin: { r: 28, c: 8 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['To Be Allocated From']], { origin: 30 });
    xlsx.utils.sheet_add_aoa(worksheet, [[toBeAllocatedFrom]], { origin: { r: 30, c: 6 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['DREF Regional Focal Point Name']], { origin: 31 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Date']], { origin: { r: 31, c: 4 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Signature']], { origin: { r: 31, c: 8 } });
    xlsx.utils.sheet_add_aoa(worksheet, [[focalPointName]], { origin: 32 });
    xlsx.utils.sheet_add_aoa(worksheet, [['To Be Completed By DREF Appeal Manger']], { origin: 34 });
    xlsx.utils.sheet_add_aoa(worksheet, [['I herewith approve the Early Action Protocol/DREF Application, Operating Budget and Allocation of Funds per amount ']], { origin: 35 });
    xlsx.utils.sheet_add_aoa(worksheet, [['indicated above. Where applicable, I also confirm that I have sought additional approval from USG National Society']], { origin: 36 });
    xlsx.utils.sheet_add_aoa(worksheet, [[' Development and Operations Coordination (email herewith attached)']], { origin: 37 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Comments']], { origin: 39 });
    xlsx.utils.sheet_add_aoa(worksheet, [['DREF Appeal Manager Name']], { origin: 43 });
    xlsx.utils.sheet_add_aoa(worksheet, [['Date']], { origin: { r: 43, c: 4 } });
    xlsx.utils.sheet_add_aoa(worksheet, [['Signature']], { origin: { r: 43, c: 8} });
    xlsx.writeFile(workbook, 'DREF Allocation.xlsx', { compression: true });
};

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
