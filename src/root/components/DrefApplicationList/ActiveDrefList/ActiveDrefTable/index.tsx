import React from "react";
import { isDefined, _cs } from "@togglecorp/fujs";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { History } from "history";
import xlsx from "exceljs";
import FileSaver from "file-saver";

import DateOutput from "#components/DateOutput";
import DropdownMenu from "#components/dropdown-menu";
import DropdownMenuItem from "#components/DropdownMenuItem";
import useRowExpansion from "#components/Table/useRowExpansion";
import {
  createStringColumn,
  createDateColumn,
  createActionColumn,
  createExpandColumn,
} from "#components/Table/predefinedColumns";
import Table from "#components/Table";
import TableData from "#components/Table/TableData";
import TableRow from "#components/Table/TableRow";
import languageContext from "#root/languageContext";
import useConfirmation from "#hooks/useConfirmation";
import { useLazyRequest } from "#utils/restRequest";
import useAlertContext from "#hooks/useAlert";
import { TYPE_LOAN } from "#views/DrefApplicationForm/common";
import DrefExportButton from "#components/DrefExportButton";
import OperationalUpdateExport from "#components/OperationalUpdateExport";
import FinalReportExport from "#components/FinalReportExport";
import {
  BaseProps,
  ActiveDrefTableDetail,
} from "#components/DrefApplicationList/useDrefApplicationListOptions";
import ShareUserModal from "#components/DrefApplicationList/ShareUserModal";
import ButtonLikeLink from "#components/ButtonLikeLink";
import { DrefOperationalUpdateApiFields } from "#views/DrefOperationalUpdateForm/common";
import { DrefApiFields } from "#views/DrefApplicationForm/common";

import styles from "../styles.module.scss";

interface Props {
  className?: string;
  data?: ActiveDrefTableDetail[];
  refetch: () => void;
  history: History;
  getDrefId: (applicationType: string, id: number) => void;
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
  previousAllocation?: number;
  totalDREFAllocation: number;
  toBeAllocatedFrom: string;
  focalPointName: string;
}

const APPROVED = 1;
const drefKeySelector = (d: ActiveDrefTableDetail) => d.id;

// NOTE: temporarily used to hide the allocation form
const featureReady = true;

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
        previousAllocation: undefined,
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
    const imageSrc = "/assets/graphics/layout/ifrc-square.png";
    const response = await fetch(imageSrc);
    const buffer = await response.arrayBuffer();

    const image = workbook.addImage({
      buffer,
      extension: "png",
    });
    const worksheet = workbook.addWorksheet(`${name} DREF Allocation`, {
      pageSetup: {
        paperSize: 9,
        showGridLines: false,
          fitToPage: true,
      },
    });
    const borderStyles: Partial<xlsx.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    worksheet.addImage(image, "A1:B6");
    worksheet.getCell("C1").value = "DISASTER RESPONSE EMERGENCY FUND";
    worksheet.mergeCells("C1:L3");
    worksheet.getCell("C1:L3").style = {
      font: {
        name: "Montserrat",
        family: 2,
        bold: true,
        size: 20,
        color: { argb: "00F5333F" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
    };
    worksheet.addRow("");
    worksheet.addRow("");
    worksheet.addRow("");
    worksheet.addRow("");
    worksheet.mergeCells("C4:L6");
    worksheet.getCell("C4").value = "Fund Income Allocation Request";
    worksheet.getCell("C4").style = {
      font: { bold: true, size: 18, name: "Montserrat", family: 2 },
      alignment: { horizontal: "center", vertical: "middle" },
    };
    worksheet.addRow("");
    worksheet.mergeCells("A1:B6");
    worksheet.mergeCells("A7:L7");
    worksheet.mergeCells("A8:L8");
    worksheet.getCell("A7").value = "To Be Completed By The DREF Focal Point";
    worksheet.getCell("A7").style = {
      font: { bold: true, size: 14, name: "Montserrat", family: 2 },
      alignment: { horizontal: "center", vertical: "middle" },
    };
    worksheet.getCell("A7").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A9").value = "DREF Allocation is requested for";
    worksheet.getCell("A9").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("A9").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("G9").value = allocationFor;
    worksheet.getCell("G9").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.mergeCells("A9:F9");
    worksheet.mergeCells("G9:L9");
    worksheet.getCell("A10").value = "Appeal Manager";
    worksheet.getCell("A10").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("G10").value = "Project Manager";
    worksheet.getCell("G10").style = { font: { color: { argb: "00404040" } } };
    if (isDefined(appealManager)) {
      worksheet.getCell("A11").value = appealManager;
    }
    if (isDefined(projectManager)) {
      worksheet.getCell("G11").value = projectManager;
    }
    worksheet.getCell("A10").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("G10").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A11").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("G11").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.mergeCells("A10:F10");
    worksheet.mergeCells("G10:L10");
    worksheet.mergeCells("A11:F11");
    worksheet.mergeCells("G11:L11");
    worksheet.mergeCells("A12:F12");
    worksheet.mergeCells("G12:L12");
    worksheet.getCell("A12").value = "Country of Operation";
    worksheet.getCell("G12").value = "Name of Operation (as published)";
    worksheet.getCell("A12").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("G12").style = { font: { color: { argb: "00404040" } } };
    if (isDefined(affectedCountry)) {
      worksheet.getCell("A13").value = affectedCountry;
    }
    if (isDefined(name)) {
      worksheet.getCell("G13").value = name;
    }
    worksheet.getCell("A12").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("G12").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A13").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("G13").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.mergeCells("A13:F13");
    worksheet.mergeCells("G13:L13");
    worksheet.mergeCells("A14:L14");
    worksheet.getCell("A15").value = "Disaster / Hazard Type";
    worksheet.getCell("G15").value = "Response Type";
    worksheet.getCell("J15").value = "IFRC Targeted Assistance";
    worksheet.getCell("A15").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("G15").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("J15").style = { font: { color: { argb: "00404040" } } };
    if (isDefined(disasterType)) {
      worksheet.getCell("A16").value = disasterType;
    }
    if (isDefined(responseType)) {
      worksheet.getCell("G16").value = responseType;
    }
    if (isDefined(noOfPeopleTargeted)) {
      worksheet.getCell("J16").value = `${noOfPeopleTargeted} people`;
    }
    worksheet.getCell("A15").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("G15").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("J15").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A16").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("G16").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("J16").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.addRow("");
    worksheet.mergeCells("A15:F15");
    worksheet.mergeCells("G15:I15");
    worksheet.mergeCells("J15:L15");
    worksheet.mergeCells("A16:F16");
    worksheet.mergeCells("G16:I16");
    worksheet.mergeCells("J16:L16");
    worksheet.mergeCells("A17:L17");
    worksheet.addRow(["For Early Action Protocols"]);
    worksheet.mergeCells("A18:L18");
    worksheet.getCell("A18").style = { font: { color: { argb: "002E75B5" } } };
    worksheet.getCell("A19").value = "Validation Committee Endorse Date";
    worksheet.getCell("E19").value = "Early Action Protocol Reference";
    worksheet.getCell("I19").value = "Operating Implementation Period";
    worksheet.getCell("A19").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("E19").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("I19").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("A19").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("E19").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("I19").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A20").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("E20").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("I20").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.addRow("");
    worksheet.addRow("");
    worksheet.mergeCells("A19:D19");
    worksheet.mergeCells("E19:H19");
    worksheet.mergeCells("I19:L19");
    worksheet.mergeCells("A20:D20");
    worksheet.mergeCells("E20:H20");
    worksheet.mergeCells("I20:L20");
    worksheet.mergeCells("A21:L21");
    worksheet.getCell("A22").value = "For DREF Operations and Emergency Appeals";
    worksheet.getCell("A22").style = { font: { color: { argb: "002E75B5" } } };
    worksheet.mergeCells("A22:L22");
    worksheet.getCell("A23").value = "National Society Request Date";
    worksheet.getCell("E23").value = "Disaster Start or Trigger Date";
    worksheet.getCell("I23").value = "Operating Implementation Period";
    worksheet.getCell("A23").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("E23").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("I23").style = { font: { color: { argb: "00404040" } } };
    if (isDefined(nsRequestDate)) {
      worksheet.getCell("A24").value = nsRequestDate;
    }
    if (isDefined(disasterStartDate)) {
      worksheet.getCell("E24").value = disasterStartDate;
    }
    if (isDefined(implementationPeriod)) {
      worksheet.getCell("I24").value = `${implementationPeriod} months`;
    }
    worksheet.getCell("A23").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("E23").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("I23").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A24").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("E24").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("I24").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.addRow("");
    worksheet.addRow("");
    worksheet.mergeCells("A23:D23");
    worksheet.mergeCells("E23:H23");
    worksheet.mergeCells("I23:L23");
    worksheet.mergeCells("A24:D24");
    worksheet.mergeCells("E24:H24");
    worksheet.mergeCells("I24:L24");
    worksheet.mergeCells("A25:L25");
    worksheet.getCell("A26").value = "Allocation CHF";
    worksheet.mergeCells("A26:L26");
    worksheet.getCell("A26").style = { font: { color: { argb: "002E75B5" } } };
    worksheet.getCell("A27").value = "DREF Allocation Request CHF";
    worksheet.getCell("E27").value = "Previous Allocation(s) CHF";
    worksheet.getCell("I27").value = "Total Allocation(s) CHF";
    worksheet.getCell("A27").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("E27").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("I27").style = { font: { color: { argb: "00404040" } } };
    if (isDefined(allocationRequested)) {
      worksheet.getCell("A28").value = `CHF ${allocationRequested}`;
    }
    if (isDefined(previousAllocation)) {
      worksheet.getCell("E28").value = `CHF ${previousAllocation}`;
    }
    if (isDefined(totalDREFAllocation)) {
      worksheet.getCell("I28").value = `CHF ${totalDREFAllocation}`;
    }
    worksheet.getCell("A27").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("E27").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("I27").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A28").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("E28").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("I28").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.addRow("");
    worksheet.mergeCells("A27:D27");
    worksheet.mergeCells("E27:H27");
    worksheet.mergeCells("I27:L27");
    worksheet.mergeCells("A28:D28");
    worksheet.mergeCells("E28:H28");
    worksheet.mergeCells("I28:L28");
    worksheet.mergeCells("A29:E29");
    worksheet.mergeCells("F29:L29");
    worksheet.mergeCells("A30:L30");
    worksheet.getCell("A29").value = "To be allocated from";
    worksheet.getCell("A29").style = { font: { color: { argb: "00404040" } } };
    if (isDefined(toBeAllocatedFrom)) {
      worksheet.getCell("F29").value = toBeAllocatedFrom;
    }
    worksheet.getCell("A29").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("F29").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.addRow("");
    worksheet.getCell("A31").value = "DREF Regional Focal Point Name";
    worksheet.getCell("I31").value = "Signature";
    worksheet.getCell("F31").value = "Date";
    worksheet.getCell("A31").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("I31").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("F31").style = { font: { color: { argb: "00404040" } } };
    if (isDefined(focalPointName)) {
      worksheet.getCell("A32").value = focalPointName;
    }
    worksheet.getCell("A31").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("I31").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("F31").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A32").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("I32").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("F32").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.addRow("");
    worksheet.mergeCells("A31:E31");
    worksheet.mergeCells("F31:H31");
    worksheet.mergeCells("I31:L31");
    worksheet.mergeCells("A32:E32");
    worksheet.mergeCells("F32:H32");
    worksheet.mergeCells("I32:L32");
    worksheet.mergeCells("A33:L33");
    worksheet.addRow(["To Be Completed By DREF Appeal Manger"]);
    worksheet.mergeCells("A34:L34");
    worksheet.getCell("A34").style = {
      font: { bold: true, size: 14 },
      alignment: { horizontal: "center", vertical: "middle" },
    };
    worksheet.getCell("A34").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A35").value =
      "I herewith approve the Early Action Protocol/DREF Application, Operating Budget and Allocation of Funds per amount indicated above. Where applicable, I also confirm that I have sought additional approval from USG National Society  Development and Operations Coordination (email herewith attached)";
    worksheet.getCell("A35").alignment = { wrapText: true };
    worksheet.mergeCells("A35:L37");
    worksheet.addRow("");
    worksheet.mergeCells("A38:L38");
    worksheet.addRow(["Comments"]);
    worksheet.addRow("");
    worksheet.addRow("");
    worksheet.addRow("");
    worksheet.mergeCells("A39:L39");
    worksheet.getCell("A39").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("A39").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.mergeCells("A40:L42");
    worksheet.getCell("A40").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("A43").value = "DREF Appeal Manager Name";
    worksheet.getCell("F43").value = "Date";
    worksheet.getCell("I43").value = "Signature";
    worksheet.getCell("A43").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("F43").style = { font: { color: { argb: "00404040" } } };
    worksheet.getCell("I43").style = { font: { color: { argb: "00404040" } } };
    worksheet.addRow("");
    worksheet.mergeCells("A43:E43");
    worksheet.mergeCells("F43:H43");
    worksheet.mergeCells("I43:L43");
    worksheet.mergeCells("A44:E44");
    worksheet.mergeCells("F44:H44");
    worksheet.mergeCells("I44:L44");
    worksheet.getCell("A43").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("F43").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("I43").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00D9D9D9",
      },
    };
    worksheet.getCell("A44").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("I44").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };
    worksheet.getCell("F44").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "00DCE6F2",
      },
    };

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = borderStyles;
      });
    });

    await workbook.xlsx.writeBuffer().then((buffer) => {
      return FileSaver.saveAs(
        new Blob([buffer], { type: "application/vnd.ms-excel;charset=utf-8" }),
        `${name} Allocation Form.xlsx`
      );
    });
  }

  const { pending: operationUpdatePending, trigger: getOperationUpdate } =
    useLazyRequest<DrefOperationalUpdateApiFields>({
      url: (operationUpdateId) => `api/v2/dref-op-update/${operationUpdateId}/`,
      onSuccess: (response) => {
        const exportData = {
          allocationFor: "DREF Operation",
          appealManager: response?.ifrc_appeal_manager_name,
          projectManager: response?.ifrc_project_manager_name,
          affectedCountry: response?.country_details?.name,
          name: response?.title,
          disasterType: response?.disaster_type_details?.name,
          responseType:
            response?.type_of_dref_display === "Imminent"
              ? "Imminent Crisis"
              : response?.type_of_onset_display,
          noOfPeopleTargeted: response?.number_of_people_targeted,
          nsRequestDate: response?.ns_request_date,
          disasterStartDate: response?.event_date,
          implementationPeriod: response?.total_operation_timeframe,
          allocationRequested: response?.additional_allocation,
          previousAllocation: response?.dref_allocated_so_far ?? 0,
          totalDREFAllocation: response?.total_dref_allocation,
          toBeAllocatedFrom:
            response?.type_of_dref_display === "Imminent"
              ? "Anticipatory Pillar"
              : "Response Pillar",
          focalPointName: response?.regional_focal_point_name,
        };
          handleExport(exportData);
      },
    });

  const { pending: drefPublishPending, trigger: postDrefPublishRequest } =
    useLazyRequest<DrefOperationalResponseFields, number>({
      url: (drefId) => (drefId ? `api/v2/dref/${drefId}/publish/` : undefined),
      body: () => ({}),
      method: "POST",
      onSuccess: () => {
        refetch();
      },
      onFailure: ({ value: { messageForNotification }, debugMessage }) => {
        alert.show(
          <p>
            {strings.drefFormLoadRequestFailureMessage}
            &nbsp;
            <strong>{messageForNotification}</strong>
          </p>,
          {
            variant: "danger",
            debugMessage,
          }
        );
      },
    });

  const {
    pending: newOperationalUpdatePending,
    trigger: postDrefNewOperationalUpdate,
  } = useLazyRequest<BaseProps, number>({
    url: (drefId) => (drefId ? `api/v2/dref-op-update/` : undefined),
    body: (drefId) => ({ dref: drefId }),
    method: "POST",
    onSuccess: (response) => {
      if (isDefined(response?.id)) {
        history.push(`/dref-operational-update/${response.id}/edit/`);
      }
    },
    onFailure: ({ value: { messageForNotification }, debugMessage }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdateFailureMessage}
          &nbsp;
          <strong>{messageForNotification}</strong>
        </p>,
        {
          variant: "danger",
          debugMessage,
        }
      );
    },
  });
  const { pending: newFinalReportPending, trigger: postDrefNewFinalReport } =
    useLazyRequest<BaseProps, number>({
      url: (drefId) => (drefId ? `api/v2/dref-final-report/` : undefined),
      body: (drefId) => ({ dref: drefId }),
      method: "POST",
      onSuccess: (response) => {
        if (isDefined(response?.id)) {
          history.push(`/dref-final-report/${response.id}/edit/`);
        }
      },
      onFailure: ({ value: { messageForNotification }, debugMessage }) => {
        alert.show(
          <p>
            {strings.drefOperationalUpdateFailureMessage}
            &nbsp;
            <strong>{messageForNotification}</strong>
          </p>,
          {
            variant: "danger",
            debugMessage,
          }
        );
      },
    });

  const {
    pending: operationalUpdatePublishPending,
    trigger: postOperationalUpdatePublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number>({
    url: (operationalUpdateId) =>
      operationalUpdateId
        ? `api/v2/dref-op-update/${operationalUpdateId}/publish/`
        : undefined,
    body: () => ({}),
    method: "POST",
    onSuccess: () => {
      refetch();
    },
    onFailure: ({ value: { messageForNotification }, debugMessage }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdatePublishConfirmationFailureMessage}
          &nbsp;
          <strong>{messageForNotification}</strong>
        </p>,
        {
          variant: "danger",
          debugMessage,
        }
      );
    },
  });

  const {
    pending: finalReportPublishPending,
    trigger: postFinalReportPublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number | undefined>({
    url: (finalReportId) =>
      finalReportId
        ? `api/v2/dref-final-report/${finalReportId}/publish/`
        : undefined,
    body: () => ({}),
    method: "POST",
    onSuccess: () => {
      refetch();
    },
    onFailure: ({ value: { messageForNotification }, debugMessage }) => {
      alert.show(
        <p>
          {strings.finalReportPublishConfirmationFailureMessage}
          &nbsp;
          <strong>{messageForNotification}</strong>
        </p>,
        {
          variant: "danger",
          debugMessage,
        }
      );
    },
  });

  const handleDrefPublishConfirm = React.useCallback(
    (drefId: number) => {
      postDrefPublishRequest(drefId);
    },
    [postDrefPublishRequest]
  );

  const handleOperationalUpdatePublishConfirm = React.useCallback(
    (operationalUpdateId: number) => {
      postOperationalUpdatePublishRequest(operationalUpdateId);
    },
    [postOperationalUpdatePublishRequest]
  );

  const handleFinalReportPublishConfirm = React.useCallback(
    (finalReportId) => {
      postFinalReportPublishRequest(finalReportId);
    },
    [postFinalReportPublishRequest]
  );

  const [publishDrefConfirmationModal, onDrefPublishClick] = useConfirmation({
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

  const [publishFinalReportConfirmationModal, onFinalReportPublishClick] =
    useConfirmation({
      message: strings.finalReportPublishConfirmationMessage,
      onConfirm: handleFinalReportPublishConfirm,
    });

  const handleExpandedClick = React.useCallback(
    (rowId: number) => {
      setExpandedRow(expandedRow === rowId ? undefined : rowId);
    },
    [expandedRow, setExpandedRow]
  );

  const handleAllocationRequestExport = React.useCallback(
    ({ type, id }: { type: string; id: number }) => {
      if (type === "OPS_UPDATE") {
        getOperationUpdate(id);
      } else if (type === "DREF") {
        getDref(id);
      }
    },
    [getDref, getOperationUpdate]
  );

  const handlePublishApplication = React.useCallback(
    ({ id, type }) => {
      if (type === "DREF") {
        onDrefPublishClick(id);
      }

      if (type === "OPS_UPDATE") {
        onOperationalUpdatePublishClick(id);
      }

      if (type === "FINAL_REPORT") {
        onFinalReportPublishClick(id);
      }
    },
    [
      onDrefPublishClick,
      onOperationalUpdatePublishClick,
      onFinalReportPublishClick,
    ]
  );

  const handleShareModal = React.useCallback(
    ({ type, id }) => {
      getDrefId(type, id);
      setShowModal(true);
    },
    [getDrefId]
  );

  const getInitialDropdownItems = React.useCallback(
    (item) => {
      const hasUnpublishedOperationalUpdate =
        item.unpublished_op_update_count > 0;
      const hasUnpublishedFinalReport = item.unpublished_final_report_count > 0;
      const isDrefLoan = item.type_of_dref === TYPE_LOAN;

      return (
        item.initial_row &&
        !hasUnpublishedOperationalUpdate &&
        item.is_published &&
        !item.has_final_reprot && (
          <>
            {!hasUnpublishedOperationalUpdate && (
              <DropdownMenuItem
                name={item.drefId}
                onClick={postDrefNewOperationalUpdate}
                label={strings.drefOperationalUpdateNewLabel}
                disabled={newOperationalUpdatePending}
              />
            )}
            {!hasUnpublishedFinalReport && (
              <DropdownMenuItem
                name={item.drefId}
                onClick={postDrefNewFinalReport}
                label={strings.finalReportCreateButtonLabel}
                disabled={isDrefLoan || newFinalReportPending}
              />
            )}
          </>
        )
      );
    },
    [
      newFinalReportPending,
      newOperationalUpdatePending,
      postDrefNewFinalReport,
      postDrefNewOperationalUpdate,
      strings,
    ]
  );

  const getDropDownActions = React.useCallback(
    (item: BaseProps) => {
      if (item.application_type === "FINAL_REPORT") {
        return (
          !item.is_published && (
            <>
              <DropdownMenuItem
                name={{
                  id: item.id,
                  type: item.application_type,
                }}
                onClick={handlePublishApplication}
                disabled={
                  drefPublishPending ||
                  operationalUpdatePublishPending ||
                  finalReportPublishPending
                }
                label="Approved"
              />
              <FinalReportExport id={item.id} variant="dropdown" />
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

      if (item.application_type === "OPS_UPDATE") {
        return (
          <>
            {getInitialDropdownItems(item)}
            {!item.is_published && (
              <>
                <DropdownMenuItem
                  name={{
                    type: item.application_type,
                    id: item.id,
                  }}
                  onClick={handlePublishApplication}
                  disabled={
                    drefPublishPending ||
                    operationalUpdatePublishPending ||
                    finalReportPublishPending
                  }
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
                id: item.id,
              }}
              label="Share"
            />
            {featureReady && (
              <DropdownMenuItem
                name={{
                  type: item.application_type,
                  id: item.id,
                }}
                onClick={handleAllocationRequestExport}
                disabled={
                  drefPublishPending ||
                  operationalUpdatePublishPending ||
                  finalReportPublishPending ||
                  drefPending ||
                  operationUpdatePending
                }
                label="Allocation Request"
              />
            )}
          </>
        );
      }

      if (item.application_type === "DREF") {
        return (
          <>
            {getInitialDropdownItems(item)}
            {!item.is_published && (
              <>
                <DropdownMenuItem
                  name={{
                    type: item.application_type,
                    id: item.id,
                  }}
                  onClick={handlePublishApplication}
                  disabled={
                    drefPublishPending ||
                    operationalUpdatePublishPending ||
                    finalReportPublishPending
                  }
                  label="Approved"
                />
                <DrefExportButton variant="dropdown" drefId={item.id} />
              </>
            )}
            <DropdownMenuItem
              onClick={handleShareModal}
              name={{
                type: item.application_type,
                id: item.id,
              }}
              label="Share"
            />
            {featureReady && (
              <DropdownMenuItem
                name={{
                  type: item.application_type,
                  id: item.id,
                }}
                onClick={handleAllocationRequestExport}
                disabled={
                  drefPublishPending ||
                  operationalUpdatePublishPending ||
                  finalReportPublishPending ||
                  drefPending ||
                  operationUpdatePending
                }
                label="Allocation Request"
              />
            )}
          </>
        );
      }
      return;
    },
    [
      drefPublishPending,
      operationalUpdatePublishPending,
      finalReportPublishPending,
      handlePublishApplication,
      handleShareModal,
      getInitialDropdownItems,
      drefPending,
      operationUpdatePending,
      handleAllocationRequestExport,
    ]
  );

  const getEditActions = React.useCallback(
    (item: BaseProps) => {
      if (item.application_type === "FINAL_REPORT") {
        return (
          <>
            {!item.is_published && (
              <ButtonLikeLink
                variant="secondary"
                to={`/dref-final-report/${item.id}/edit/`}
                disabled={finalReportPublishPending}
              >
                Edit
              </ButtonLikeLink>
            )}
            {item.is_published && <FinalReportExport id={item.id} />}
          </>
        );
      }

      if (item.application_type === "OPS_UPDATE") {
        return (
          <>
            {!item.is_published && (
              <ButtonLikeLink
                variant="secondary"
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

      if (item.application_type === "DREF") {
        return (
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
            {item.is_published && <DrefExportButton drefId={item.id} />}
          </>
        );
      }
    },
    [
      finalReportPublishPending,
      operationalUpdatePublishPending,
      drefPublishPending,
    ]
  );

  const getRowLevelData = React.useCallback(
    (expandedData?: BaseProps[]) => {
      return expandedData
        ?.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
        .map((detail) => (
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
              {detail.status === APPROVED ? "Approved" : "In Progress"}
            </TableData>
            <TableData colSpan={2} className={styles.expandedRowActions}>
              <span>
                {getEditActions(detail)}
                <DropdownMenu label={<IoEllipsisHorizontal />}>
                  {getDropDownActions(detail)}
                </DropdownMenu>
              </span>
            </TableData>
          </TableRow>
        ));
    },
    [getEditActions, getDropDownActions]
  );

  const rowModifier = useRowExpansion<ActiveDrefTableDetail, number>(
    expandedRow,
    ({ datum }) => {
      return (
        <>
          {getRowLevelData(datum.firstLevel)}
          {getRowLevelData(datum.secondLevel)}
        </>
      );
    }
  );

  const [drefApplicationColumns] = React.useMemo(() => {
    const baseDrefColumns = [
      createDateColumn<ActiveDrefTableDetail, string | number>(
        "created_at",
        strings.drefTableCreatedOn,
        (item) => item?.created_at
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        "appeal_code",
        strings.drefTableAppealNumber,
        (item) => item?.appeal_code
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        "title",
        strings.drefTableName,
        (item) => item.title
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        "type",
        strings.drefTableStageOfDref,
        (item) => item.application_type_display
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        "country_details",
        strings.drefTableCountry,
        (item) => item.country_details.name
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        "type_of_dref_display",
        strings.drefTableTypeOfDref,
        (item) => item?.type_of_dref_display
      ),
      createStringColumn<ActiveDrefTableDetail, string | number>(
        "status_display",
        strings.drefTableDrefStatus,
        (item) => (item.status === APPROVED ? "Approved" : "In Progress")
      ),
    ];

    const columnWithActions = [
      createActionColumn<ActiveDrefTableDetail, number>(
        "actions",
        (_, item: ActiveDrefTableDetail) => ({
          children: getEditActions(item),
          extraActions: getDropDownActions(item),
        }),
        {
          cellRendererClassName: styles.actionsCell,
          headerContainerClassName: styles.actionsHeader,
        }
      ),
    ];
    return [
      [
        ...baseDrefColumns,
        ...columnWithActions,
        createExpandColumn<ActiveDrefTableDetail, number>(
          "expand-button",
          "",
          handleExpandedClick,
          expandedRow
        ),
      ],
    ];
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
        <ShareUserModal id={drefId} onClose={() => setShowModal(!showModal)} />
      )}
    </>
  );
}

export default ActiveDrefTable;
