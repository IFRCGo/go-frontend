import React from 'react';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import {
  _cs,
  unique,
  listToGroupList,
  listToMap,
  isDefined,
} from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';
import Container from '#components/Container';

export interface MembershipCoordination {
  id: number | null;
  country_plan: number;
  has_coordination: boolean;
  national_society: number;
  national_society_name: string;
  sector: string;
  sector_display: string;
}
interface Props {
  className?: string;
  data?: MembershipCoordination[];
}

function MembershipCoordinationTable(props: Props) {
  const {
    className,
    data = [],
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const sectors = React.useMemo(
    () => (
      unique(
        data.map(d => ({ key: d.sector, value: d.sector_display })),
        d => d.key,
      )
    ),
    [data],
  );

  const nsIdToNameMap = React.useMemo(
    () => (
      listToMap(
        unique(
          data.filter(d => isDefined(d.id)),
          d => d.national_society,
        ),
        d => d.national_society,
        d => d.national_society_name,
      )
    ),
    [data],
  );

  const nsGroupedCoordination = React.useMemo(() => (
    listToGroupList(
      data.filter(d => isDefined(d.id)),
      d => d.national_society,
      d => d.sector,
    )
  ), [data]);

  const nsGroupedCoordinationKeys = Object.keys(nsGroupedCoordination).map(d => +d);

  return (
    <Container
      className={_cs(styles.membershipCoordinationTable, className)}
      heading={strings.countryPlanMembershipCoordinationTableTitle}
      sub
      contentClassName={styles.content}
    >
      <table>
        <thead>
          <tr>
            <th>
              <div className={styles.thContent}>
                {strings.countryPlanNameOfPNS}
              </div>
            </th>
            {sectors.map((s) => (
              <th
                key={s.key}
                className={styles.rotated}
              >
                <div className={styles.thContent}>
                  {s.value}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nsGroupedCoordinationKeys.map((ns) => {
            const nsSectors = nsGroupedCoordination[ns];
            const nsSectorMap = listToMap(nsSectors, d => d, () => true);

            return (
              <tr key={ns}>
                <td>
                  {nsIdToNameMap[ns]}
                </td>
                {sectors.map((sector) => (
                  <td key={sector.key}>
                    {nsSectorMap[sector.key] && (
                      <div className={styles.checkmarkContainer}>
                        <IoCheckmarkCircleSharp />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}

export default MembershipCoordinationTable;
