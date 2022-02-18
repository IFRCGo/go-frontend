import React  from 'react';
import {
  listToMap,
  isDefined,
  listToGroupList,
  mapToMap,
  unique,
} from '@togglecorp/fujs';

import { useRequest } from '#utils/restRequest';
import {
  avg,
  avgSafe,
} from '#utils/common';

import {
  HazardTypes,
  StringValueOption,
} from '#types';
import useInputState from '#hooks/useInputState';

import {
  RiskData,
  IPCData,
  SeasonalResponse,
  CountryDetail,
  monthKeys,
} from './common';
import RiskMap from './Map';
import HistoricalChart from './HistoricalChart';

const visibleHazardTypeMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in HazardTypes]: boolean;
} = {
  TC: true,
  FL: true,
  FI: true,
  DR: true,
};

const hazardOrderMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in HazardTypes]: number;
} = {
  FL: 1,
  TC: 2,
  DR: 3,
  FI: 4,
};

const estimationPriorityMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in IPCData['estimation_type']]: number
} = {
  current: 0,
  first_projection: 1,
  second_projection: 2,
};

interface Props {
  className?: string;
  regionId: number;
}

function SeasonalRisk(props: Props) {
  const { regionId } = props;

  const { response } = useRequest<SeasonalResponse>({
    skip: !regionId,
    query: { region: regionId },
    url: 'risk://api/v1/seasonal/',
  });

  const [selectedMonth, setSelectedMonth] = useInputState(0);

  const [
    aggregatedRiskData,
    hazardOptions,
  ] : [
    Record<string, RiskData>[],
    StringValueOption[],
  ] = React.useMemo(() => {
    const hazardTitleMap = {
      ...listToMap(response?.ipc_displacement_data, d => d.hazard_type, d => d.hazard_type_display),
      ...listToMap(response?.idmc, d => d.hazard_type, d => d.hazard_type_display),
      ...listToMap(response?.inform, d => d.hazard_type, d => d.hazard_type_display),
      ...listToMap(response?.inform_seasonal, d => d.hazard_type, d => d.hazard_type_display),
      ...listToMap(response?.raster_displacement_data, d => d.hazard_type, d => d.hazard_type_display),
    };

    const allHazardKeys = Object.keys(hazardTitleMap) as HazardTypes[];
    const hazardKeys = allHazardKeys.filter(
      (h) => visibleHazardTypeMap[h]
    );

    const aggregateRiskData = (seasonalRiskData: undefined | SeasonalResponse, hazard: HazardTypes, countryIso3: string) => {
      const displacements = seasonalRiskData?.idmc
        .filter((risk) => risk.hazard_type === hazard)
        .map((risk) => {
          const monthlyDisplacement = monthKeys.map((monthKey) => risk[monthKey]);

          return {
            annualAverage: risk.annual_average_displacement,
            monthly: monthlyDisplacement,
          };
        }) ?? [];

      const exposures = seasonalRiskData?.raster_displacement_data
        .filter((risk) => risk.hazard_type === hazard)
        .map((risk) => {
          const monthlyDisplacement = monthKeys.map((monthKey) => risk[monthKey]);

          return {
            annualAverage: risk.annual_average_displacement,
            monthly: monthlyDisplacement,
          };
        }) ?? [];

      if (hazard === 'FI') {
        const maxYear = 2021;

        const foodInsecurityRaw = (seasonalRiskData?.ipc_displacement_data.filter(
          d => (isDefined(d.total_displacement) && d.year === maxYear)
        ) ?? []).sort((a, b) => {
          return (a.year - b.year)
            || (a.month - b.month)
            || ((new Date(b.analysis_date ?? 0).getTime()) - (new Date(a.analysis_date ?? 0).getTime()))
            || ((estimationPriorityMap[a.estimation_type] ?? 0) - (estimationPriorityMap[b.estimation_type] ?? 0));
        });

        const groupedMap = mapToMap(
          listToGroupList(foodInsecurityRaw, d => d.month),
          d => d,
          (data) => unique(data, d => d.year)
        );
        const foodInsecurity = Object.values(groupedMap).map(d => d[0]);

        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
        exposures.push({
          annualAverage: avg(foodInsecurity, d => d.total_displacement) ?? null,
          monthly: months.map(m => avgSafe(groupedMap[m]?.map(d => d.total_displacement)) ?? null),
        });
      }

      const informRiskScoreAnnual = seasonalRiskData?.inform
        .filter((risk) => risk.hazard_type === hazard)
        .map((risk) => risk.risk_score)[0] ?? null;

      const informRiskScores = seasonalRiskData?.inform_seasonal
        .filter((risk) => risk.hazard_type === hazard)
        .map((risk) => {
          const monthlyRiskScore = monthKeys.map((monthKey) => risk[monthKey]);

          return {
            annualAverage: informRiskScoreAnnual,
            monthly: monthlyRiskScore,
          };
        }) ?? [];

      return {
        countryIso3,
        hazardType: hazard,
        hazardTypeDisplay: hazardTitleMap[hazard] ?? '',
        // TODO: sum all the values if multiple
        displacement: displacements[0],
        informRiskScore: informRiskScores[0],
        exposure: exposures[0],
      };
    };

    const riskData = hazardKeys.map((hazard) => {
      function group<T extends { country_details: CountryDetail}>(list: T[] | undefined) {
        if (!list) {
          return {};
        }

        return listToGroupList(
          list,
          d => d.country_details.iso3,
          d => d,
        );
      }

      const gar_return_period_data = group(response?.gar_return_period_data);
      const hazard_info = group(response?.hazard_info);
      const idmc = group(response?.idmc);
      const idmc_return_period = group(response?.idmc_return_period);
      const inform = group(response?.inform);
      const inform_seasonal = group(response?.inform_seasonal);
      const ipc_displacement_data = group(response?.ipc_displacement_data);
      const raster_displacement_data = group(response?.raster_displacement_data);

      const countryList = unique([
        ...Object.keys(gar_return_period_data),
        ...Object.keys(hazard_info),
        ...Object.keys(idmc),
        ...Object.keys(idmc_return_period),
        ...Object.keys(inform),
        ...Object.keys(inform_seasonal),
        ...Object.keys(ipc_displacement_data),
        ...Object.keys(raster_displacement_data),
      ]);

      const countryGroupedRiskData = listToMap(
        countryList.map((c) => {
          const countryResponse: SeasonalResponse = {
            gar_return_period_data: gar_return_period_data[c] ?? [],
            hazard_info: hazard_info[c] ?? [],
            idmc: idmc[c] ?? [],
            idmc_return_period: idmc_return_period[c] ?? [],
            inform: inform[c] ?? [],
            inform_seasonal: inform_seasonal[c] ?? [],
            ipc_displacement_data: ipc_displacement_data[c] ?? [],
            raster_displacement_data: raster_displacement_data[c] ?? [],
          };

          return { country: c, data: aggregateRiskData(countryResponse, hazard, c) };
        }),
        d => d.country,
        d => d.data,
      );

      return countryGroupedRiskData;
    });

    return [
      riskData.sort((a, b) => (hazardOrderMap[a[0]?.hazardType] - hazardOrderMap[b[0]?.hazardType])),
      hazardKeys.map((h) => ({
        label: hazardTitleMap[h] ?? '',
        value: h,
      })),
    ];
  }, [response]);


  return (
    <>
      <RiskMap
        riskData={aggregatedRiskData}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        hazardOptions={hazardOptions}
        regionId={regionId}
      />
      <HistoricalChart
        regionId={regionId}
      />
    </>
  );
}

export default SeasonalRisk;
