import React, { useContext, useMemo } from 'react';
import RiskMap from './Map';
import { ImpactChart, RiskBarChart } from './Charts';
import { ReturnPeriodTable } from './Table';


function SeasonalRisk() {

  return (
    <>
      <RiskMap />
      <RiskBarChart />
      <ReturnPeriodTable />
      <ImpactChart />
    </>
  );
}

export default SeasonalRisk;