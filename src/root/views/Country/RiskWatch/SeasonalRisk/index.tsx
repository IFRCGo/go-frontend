import React from 'react';
import {
  listToMap,
  isDefined,
  listToGroupList,
  mapToMap,
  unique,
} from '@togglecorp/fujs';
import { RiArrowRightUpLine } from 'react-icons/ri';

import Container from '#components/Container';
import { useButtonFeatures } from '#components/Button';
import useReduxState from '#hooks/useReduxState';
import { useRequest } from '#utils/restRequest';
import {
  avg,
  avgSafe,
  compareLabel,
} from '#utils/common';

import {
  HazardTypes,
  StringValueOption,
} from '#types';
import useInputState from '#hooks/useInputState';

import {
  RiskData,
  IPCData,
  ReturnPeriodHazardType,
  SeasonalResponse,
  monthKeys,
} from './common';
import RiskTable from './RiskTable';
import ReturnPeriodTable from './ReturnPeriodTable';
import MonthSelector from './MonthSelector';
import HistoricalDataChart from './HistoricalDataChart';
import RiskBarChart from './RiskBarChart';
import PossibleEarlyActionTable from './PossibleEarlyActionTable';

import styles from './styles.module.scss';

const visibleHazardTypeMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in HazardTypes]: boolean;
} = {
  TC: true,
  FL: true,
  FI: true,
  DR: true,
};

const visibleReturnPeriodHazardTypeMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ReturnPeriodHazardType]: boolean;
} = {
  SS: true,
  FL: true,
  WD: true,
  CD: true,
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
  countryId: number;
}

function SeasonalRisk(props: Props) {
  const { countryId } = props;

  const eapLinkProps = useButtonFeatures({
    variant: 'primary',
    actions: <RiArrowRightUpLine />,
    children: 'Download the EAP',
  });

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const { response } = useRequest<SeasonalResponse>({
    skip: !country,
    query: { iso3: country?.iso3?.toLocaleLowerCase() },
    url: 'risk://api/v1/seasonal/',
  });

  const [selectedMonths, setSelectedMonths] = useInputState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
  });

  const [
    aggregatedRiskData,
    hazardOptions,
    returnPeriodHazardOptions,
  ]: [
      RiskData[],
      StringValueOption[],
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

      const riskData = hazardKeys.map((hazard) => {
        const displacements = response?.idmc
          .filter((risk) => risk.hazard_type === hazard)
          .map((risk) => {
            const monthlyDisplacement = monthKeys.map((monthKey) => risk[monthKey]);

            return {
              annualAverage: risk.annual_average_displacement,
              monthly: monthlyDisplacement,
            };
          }) ?? [];

        const exposures = response?.raster_displacement_data
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

          const foodInsecurityRaw = (response?.ipc_displacement_data.filter(
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

        const informRiskScoreAnnual = response?.inform
          .filter((risk) => risk.hazard_type === hazard)
          .map((risk) => risk.risk_score)[0] ?? null;

        const informRiskScores = response?.inform_seasonal
          .filter((risk) => risk.hazard_type === hazard)
          .map((risk) => {
            const monthlyRiskScore = monthKeys.map((monthKey) => risk[monthKey]);

            return {
              annualAverage: informRiskScoreAnnual,
              monthly: monthlyRiskScore,
            };
          }) ?? [];

        return {
          hazardType: hazard,
          hazardTypeDisplay: hazardTitleMap[hazard] ?? '',
          // TODO: sum all the values if multiple
          displacement: displacements[0],
          informRiskScore: informRiskScores[0],
          exposure: exposures[0],
        };
      });

      const rpHazardTitleMap = {
        ...listToMap(response?.return_period_data, d => d.hazard_type, d => d.hazard_type_display),
      };

      const allRpHazardKeys = Object.keys(rpHazardTitleMap) as ReturnPeriodHazardType[];
      const rpHazardKeys = allRpHazardKeys.filter(
        (h) => visibleReturnPeriodHazardTypeMap[h]
      );

      return [
        riskData.sort((a, b) => (hazardOrderMap[a.hazardType] - hazardOrderMap[b.hazardType])),
        hazardKeys.map((h) => ({
          label: hazardTitleMap[h] ?? '',
          value: h,
        })),
        rpHazardKeys.map((h) => ({
          label: rpHazardTitleMap[h] ?? '',
          value: h,
        })),
      ];
    }, [response]);

  const countryOptions: StringValueOption[] = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.name
    )).map((c) => ({
      value: c.iso3!,
      label: c.name,
    })).sort(compareLabel) ?? [],
    [allCountries],
  );

  return (
    <>
      <Container
        className={styles.riskTableContainer}
        heading="Risks by Month"
        sub
        description="This table displays available information about specific disaster risks for for each month. When you move the slider from month to month, the information in the table will update automatically."
        descriptionClassName={styles.tableDescription}
        contentClassName={styles.content}
      >
        <MonthSelector
          name={undefined}
          value={selectedMonths}
          onChange={setSelectedMonths}
          className={styles.monthSelector}
        />
        <RiskTable
          selectedMonths={selectedMonths}
          riskData={aggregatedRiskData}
        />
        <div className={styles.eapSection}>
          <Container
            innerContainerClassName={styles.eapContainer}
            heading="Early Action Protocols (EAPs)"
            headingSize="small"
            hideHeaderBorder
            contentClassName={styles.eapDescription}
            visibleOverflow
            actions={(
              <a
                target="_blank"
                href="https://www.ifrc.org/appeals?date_from=&date_to=&type%5B%5D=30&appeal_code=&text="
                {...eapLinkProps}
              />
            )}
          >
            EAPs are a formal plan that guide timely and effective implementation of early actions for extreme weather events, based on pre-agreed triggers. Download the EAP for Philippines
          </Container>
        </div>
        <RiskBarChart
          riskData={aggregatedRiskData}
          hazardOptions={hazardOptions}
          ipcData={response?.ipc_displacement_data ?? []}
        />
      </Container>
      <ReturnPeriodTable
        data={response?.return_period_data}
        hazardOptions={returnPeriodHazardOptions}
      />
      <PossibleEarlyActionTable
        //data={possibleEarlyActionsResponse?.results}
        hazardOptions={returnPeriodHazardOptions}
        countryOptions={countryOptions}
        country={country}
      />
      <HistoricalDataChart countryId={countryId} />
    </>
  );
}

export default SeasonalRisk;
