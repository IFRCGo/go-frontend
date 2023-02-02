import React  from 'react';
import {
  isNotDefined,
  listToMap,
  listToGroupList,
  sum,
  unique,
  mapToMap,
  isDefined,
} from '@togglecorp/fujs';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import Container from '#components/Container';
import WikiLink from '#components/WikiLink';
import { avgSafe } from '#utils/common';

import {
  SeasonalResponse,
  MonthlyValues,
  HazardType,
  CountryDetail,
  RiskScoreData,
  RISK_HIGH_COLOR,
  RISK_LOW_COLOR,
  IPCData,
  monthKeys,
  hazardTypeOptions,
  hazardTypeColorMap,
} from './common';
import RiskMap from './Map';
import HistoricalChart from './HistoricalChart';
import Filters, { initialFilterValue, FilterValue } from './Filters';
import CountryRiskBarChart from './CountryRiskBarChart';

import styles from './styles.module.scss';

function processIpcData(data: IPCData[]) {
  const estimationPriorityMap: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [key in IPCData['estimation_type']]: number
  } = {
    current: 0,
    first_projection: 1,
    second_projection: 2,
  };

  const sortedData = [...data].sort(
    (a, b) => (a.year - b.year)
      || (a.month - b.month)
      || ((new Date(b.analysis_date ?? 0).getTime()) - (new Date(a.analysis_date ?? 0).getTime()))
      || ((estimationPriorityMap[a.estimation_type] ?? 0) - (estimationPriorityMap[b.estimation_type] ?? 0))
  );

  const latestAnalysisDate = [...data].sort(
    (a, b) => (new Date(b.analysis_date ?? 0)).getTime() - (new Date(a.analysis_date ?? 0)).getTime(),
  )[0].analysis_date;

  const groupedData = mapToMap(
    listToGroupList(sortedData, d => d.month),
    d => d,
    // Since we've sorted data in order of priority
    // We should only take first occuring year
    (data) => unique(data, d => d.year),
  );

  const ipcDataMonthly = monthKeys.map((m, i) => {
    const historicData = (groupedData[i] ?? []).filter(d => d.estimation_type === 'current');
    const prediction = (groupedData[i] ?? []).filter(d => d.analysis_date === latestAnalysisDate && d.estimation_type !== 'current');

    const yearDisaggregatedHistoricData = listToMap(
      historicData.map(d => ({ [d.year]: d.total_displacement })),
      d => Object.keys(d)[0],
      d => Object.values(d)[0],
    );

    const yearDisaggregatedPrediction = listToMap(
      prediction.map(d => ({ [`prediction-${d.year}`]: d.total_displacement })),
      d => Object.keys(d)[0],
      d => Object.values(d)[0],
    );

    return {
      month: m,
      average: avgSafe(historicData.map(d => d.total_displacement)),
      ...yearDisaggregatedHistoricData,
      ...yearDisaggregatedPrediction,
    };
  });

  const ipcData = {
    hazard_type_display: data[0].hazard_type_display,
    hazard_type: data[0].hazard_type,
    iso3: data[0].country_details.iso3,
    country: data[0].country,
    country_details: data[0].country_details,
    ...(ipcDataMonthly.reduce((acc, val) => {
      acc[val.month] = val.average ?? null;
      return acc;
    }, {} as MonthlyValues)),
  };

  return ipcData;
}


interface Props {
  className?: string;
  regionId: number;
}

function SeasonalRisk(props: Props) {
  const { regionId } = props;
  const [filterValue, setFilterValue] = React.useState<FilterValue>(initialFilterValue);

  const { response: seasonalRiskResponse } = useRequest<SeasonalResponse>({
    url: 'risk://api/v1/seasonal/',
    skip: isNotDefined(regionId),
    query: { region: regionId },
  });

  const { response: riskScoreResponse } = useRequest<ListResponse<RiskScoreData>>({
    url: 'risk://api/v1/risk-score/',
    skip: isNotDefined(regionId),
    query: {
      region: regionId,
      limit: 500,
    },
  });

  const filteredRiskData = React.useMemo(() => {
    const selectedCountryMaps = listToMap(
      filterValue.countries,
      d => d,
      () => true,
    );

    const selectedHazardsMap = listToMap(
      filterValue.hazardTypes,
      d => d,
      () => true,
    );

    const getSumForSelectedMonths = (monthlyValues: MonthlyValues) => (
      filterValue.months.reduce(
        (acc, monthKey) => acc + (monthlyValues[monthKey] ?? 0),
        0,
      )
    );

    const getRiskValueList = (riskList: (MonthlyValues & {
      hazard_type: HazardType,
      hazard_type_display: string,
      country_details: CountryDetail,
    })[]) => {
      const countryGroupedRiskList = listToGroupList(
        riskList,
        d => d.country_details.iso3.toUpperCase()
      ) ?? {};
      const countryRiskList = Object.keys(countryGroupedRiskList).map(
        (iso3) => {
          if (!selectedCountryMaps[iso3]) {
            return undefined;
          }

          const riskList = unique(
            countryGroupedRiskList[iso3]
              .filter(({ hazard_type }) => selectedHazardsMap[hazard_type])
              .map((riskData) => ({
                hazard_type: riskData.hazard_type,
                hazard_type_display: riskData.hazard_type_display,
                value: getSumForSelectedMonths(riskData),
              })),
            (r) => r.hazard_type,
          );

          const riskValueList = riskList.map((rv) => rv.value);
          const countryName = countryGroupedRiskList[iso3][0].country_details.name;

          return {
            iso3,
            value: sum(riskValueList),
            byHazard: riskList,
            countryName,
          };
        },
      ).filter(isDefined);

      return countryRiskList;
    };

    if (filterValue.riskMetric === 'displacement') {
      return getRiskValueList(seasonalRiskResponse?.idmc ?? []);
    }

    if (filterValue.riskMetric === 'exposure') {
      const countryGroupedIpcData = listToGroupList(
        seasonalRiskResponse?.ipc_displacement_data,
        (d) => d.country_details.iso3,
      ) ?? [];

      const combinedData = [
        ...(Object.values(countryGroupedIpcData).map(processIpcData)),
        ...(seasonalRiskResponse?.raster_displacement_data ?? []),
      ];

      return getRiskValueList(combinedData);
    }

    if (filterValue.riskMetric === 'informRiskScore') {
      const riskValueList = getRiskValueList(riskScoreResponse?.results ?? []);

      const riskFeatureMap = listToMap(
        unique(riskScoreResponse?.results ?? [], (rs) => rs.country_details.iso3),
        (rs) => rs.country_details.iso3.toUpperCase(),
        (rs) => ({ lcc: rs.lcc, population: Math.sqrt(rs.population_in_thousands) }),
      );

      const riskValueListWithFilter = riskValueList.map((rv) => {
        let valueWithFilter = rv.value;
        let byHazardWithFilter = rv.byHazard;

        if (filterValue.include_coping_capacity) {
          const lcc = riskFeatureMap[rv.iso3].lcc;
          valueWithFilter = valueWithFilter * lcc;
          byHazardWithFilter = byHazardWithFilter.map((r) => ({
            ...r,
            value: r.value * lcc,
          }));
        }

        if (filterValue.riskType === 'normalized') {
          const population = riskFeatureMap[rv.iso3].population;
          valueWithFilter = valueWithFilter / population;
          byHazardWithFilter = byHazardWithFilter.map((r) => ({
            ...r,
            value: r.value / population,
          }));
        }

        return {
          ...rv,
          value: valueWithFilter,
          byHazard: byHazardWithFilter,
        };
      });

      return riskValueListWithFilter;
    }

    return [];
  }, [filterValue, seasonalRiskResponse, riskScoreResponse]);

  return (
    <>
      <Container
        visibleOverflow
        heading="Risk map"
        sub
        description={(
          <>
            <p>
              The map and horizontal bar charts below visualise risk information for every country for every month. Using the filters, you can choose which countries, hazards and risks to see. The map and bar charts will update dynamically depending on how you've filtered the data. The horizontal bar charts display the level of risk per country and list the countries in descending order.
            </p>
            <p>
              When viewing INFORM Risk Scores, People at Risk of Displacement and Population Exposure, you can display the information for each hazard individually or in combination. By adjusting the "Months" filter, you can explore the data for one month, for multiple months or for an entire year. When viewing the INFORM Risk Scores, you can choose to view the data with a country's coping capacity factored into the analysis or without it; using the toggle, you can also view the results in Absolute terms or Normalised in relation to each country's population. When normalised, the risk score is divided by the square root of the country's population in thousands. To remove a Country, Hazard or Month from the analysis, click the "x" next to items you want to remove and the map and bar charts will update automatically.
            </p>
          </>
        )}
        actions={<WikiLink pathName='user_guide/risk_module#seasonal-risk'/>}
        contentClassName={styles.seasonalRiskContent}
      >
        <Filters
          value={filterValue}
          onChange={setFilterValue}
          regionId={regionId}
        />
        <div className={styles.mapContainer}>
          <RiskMap
            className={styles.map}
            riskData={filteredRiskData}
            regionId={regionId}
          />
          <CountryRiskBarChart
            className={styles.barChart}
            riskData={filteredRiskData}
          />
        </div>
        <div className={styles.legend}>
          <div className={styles.riskLegend}>
            <div className={styles.legendLabel}>
              Severity
            </div>
            <div className={styles.separator} />
            <div className={styles.legendContent}>
              <div
                className={styles.gradient}
                style={{
                  background: `linear-gradient(90deg, ${RISK_LOW_COLOR}, ${RISK_HIGH_COLOR})`
                }}
              />
              <div className={styles.labelList}>
                <div className={styles.label}>
                  Low
                </div>
                <div className={styles.label}>
                  High
                </div>
              </div>
            </div>
          </div>
          <div className={styles.separator} />
          <div className={styles.hazardLegend}>
            <div className={styles.legendLabel}>
              Types of Hazards
            </div>
            <div className={styles.separator} />
            <div className={styles.legendContent}>
              {hazardTypeOptions.map((hazardType) => (
                <div
                  className={styles.legendItem}
                  key={hazardType.value}
                >
                  <div
                    className={styles.color}
                    style={{
                      backgroundColor: hazardTypeColorMap[hazardType.value],
                    }}
                  />
                  <div className={styles.label}>
                    {hazardType.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <HistoricalChart
        regionId={regionId}
      />
    </>
  );
}

export default SeasonalRisk;
