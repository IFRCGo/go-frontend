import React  from 'react';
import { listToMap } from '@togglecorp/fujs';

import useReduxState from '#hooks/useReduxState';
import Container from '#components/Container';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import { avg } from '#utils/common';

import RiskMap from './Map';
import RiskTable from './RiskTable';
import ReturnPeriodTable from './ReturnPeriodTable';
import { ImpactChart, RiskBarChart } from './Charts';
import {
  HazardTypes,
  StringValueOption,
} from '#types';

import { RiskData } from './common';

import styles from './styles.module.scss';

interface IDMCData {
  annual_average_displacement: number | null;
  april: number | null;
  august: number | null;
  confidence_type: 'low' | 'medium' | 'high' | string;
  confidence_type_display: string;
  country: string;
  december: number | null;
  february: number | null;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  id: number;
  iso3: string
  january: number | null;
  july: number | null;
  june: number | null;
  march: number | null;
  may: number | null;
  note: string | null;
  november: number | null;
  october: number | null;
  september: number | null;
}

interface IPCData {
  id: number;
  country: number;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  month: number;
  total_displacement: number;
  year: number;
}

interface INFORMData {
  id: number;
  country: number;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  risk_score: number;
}

interface Props {
  className?: string;
  countryId: number;
}

function SeasonalRisk(props: Props) {
  const { countryId } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const { response: idmcResponse } = useRequest<ListResponse<IDMCData>>({
    skip: !country,
    query: { iso3: country?.iso3 },
    url: 'https://risk-module-api.togglecorp.com/api/v1/idmc-data/',
  });

  const { response: ipcResponse } = useRequest<ListResponse<IPCData>>({
    skip: !country?.iso3,
    url: 'https://risk-module-api.togglecorp.com/api/v1/displacement-data/',
    query: { iso3: country?.iso3?.toLowerCase() },
  });

  const { response: informResponse } = useRequest<ListResponse<INFORMData>>({
    skip: !country?.iso3,
    url: 'https://risk-module-api.togglecorp.com/api/v1/inform-data/',
    query: { iso3: country?.iso3?.toLowerCase() },
  });

  const [
    aggregatedRiskData,
    hazardOptions,
  ] : [
    RiskData[],
    StringValueOption[]
  ] = React.useMemo(() => {
    const hazardTitleMap = {
      ...listToMap(ipcResponse?.results, d => d.hazard_type, d => d.hazard_type_display),
      ...listToMap(idmcResponse?.results, d => d.hazard_type, d => d.hazard_type_display),
      ...listToMap(informResponse?.results, d => d.hazard_type, d => d.hazard_type_display),
    };

    const hazardKeys = Object.keys(hazardTitleMap) as HazardTypes[];
    const now = new Date();
    const currentYear = now.getFullYear();

    const riskData = hazardKeys.map((hazard) => {
      const displacements = idmcResponse?.results
        .filter((risk) => risk.hazard_type === hazard)
        .map((risk) => {
          const monthKeys = [
            'january',
            'february',
            'march',
            'april',
            'may',
            'june',
            'july',
            'august',
            'september',
            'october',
            'november',
            'december',
          ] as const;

          const monthlyDisplacement = monthKeys.map((monthKey) => risk[monthKey]);

          return {
            annualAverage: risk.annual_average_displacement,
            monthly: monthlyDisplacement,
          };
        }) ?? [];

      if (hazard === 'food_insecurity') {
        const foodInsecurity = ipcResponse?.results.filter(d => d.year === currentYear) ?? [];
        displacements.push({
          annualAverage: avg(foodInsecurity, d => d.total_displacement) ?? null,
          monthly: foodInsecurity.sort(
            (a, b) => a.month - b.month,
          ).map(d => d.total_displacement),
        });
      }

      const informRiskScore= informResponse?.results
        .filter((risk) => risk.hazard_type === hazard)
        .map((risk) => risk.risk_score)[0] ?? null;

      return {
        hazardType: hazard,
        hazardTypeDisplay: hazardTitleMap[hazard],
        // TODO: sum all the values if multiple
        displacement: displacements[0],
        informRiskScore: informRiskScore,
        exposure: null,
      };
    });

    return [
      riskData,
      hazardKeys.map((h) => ({
        label: hazardTitleMap[h],
        value: h,
      })),
    ];
  }, [ipcResponse, idmcResponse, informResponse]);

  return (
    <>
      <RiskMap
        hazardOptions={hazardOptions}
        countryId={countryId}
        riskData={aggregatedRiskData}
      />
      <RiskTable
        riskData={aggregatedRiskData}
      />
      <RiskBarChart
        riskData={aggregatedRiskData}
      />
      <ReturnPeriodTable />
      <ImpactChart />
    </>
  );
}

export default SeasonalRisk;
