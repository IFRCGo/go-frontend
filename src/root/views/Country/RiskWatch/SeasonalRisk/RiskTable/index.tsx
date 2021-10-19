import React  from 'react';
import { _cs } from '@togglecorp/fujs';

import Table from '#components/Table';
import {
    createStringColumn,
    createNumberColumn,
} from '#components/Table/predefinedColumns';

import { RiskData } from '../common';

import styles from './styles.module.scss';


const getRiskTableColumns = () => ([
  createStringColumn<RiskData, string | number>(
    'hazardTypeDisplay',
    'Hazard Type',
    (item) => item.hazardTypeDisplay,
  ),
  createNumberColumn<RiskData, string | number>(
    'informRiskScore',
    'Inform Risk Score',
    (item) => item.informRiskScore,
  ),
  createNumberColumn<RiskData, string | number>(
    'peopleExposed',
    'People Exposed',
    (item) => item.exposure,
  ),
  createNumberColumn<RiskData, string | number>(
    'peopleAtRiskOfDisplacement',
    'People at Risk of Displacement',
    (item) => item.displacement?.annualAverage,
    undefined,
    {
      normal: true,
      precision: 'auto',
    },
  ),
]);

interface Props {
  className?: string;
  riskData: RiskData[];
}

function RiskTable(props: Props) {
  const {
    className,
    riskData,
  } = props;
  const riskTableColumns = getRiskTableColumns();

  return (
    <Table
      className={_cs(styles.riskTable, className)}
      data={riskData}
      columns={riskTableColumns}
      keySelector={d => d.hazardType}
    />
  );
}

export default RiskTable;
