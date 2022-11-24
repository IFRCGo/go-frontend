import React from 'react';
import { _cs } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import NumberOutput from '#components/NumberOutput';

import styles from './styles.module.scss';

export interface StrategicPriority {
  id: number;
  country_plan: number;
  funding_requirement: number | null;
  people_targeted: number | null;
  sp_name: string | null;
  sp_name_display: string | null;
}

interface Props {
  className?: string;
  data?: StrategicPriority[];
}

function CountryPlanTable(props: Props) {
  const {
    className,
    data,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    <Container
      className={_cs(styles.strategicPrioritiesTable, className)}
      heading={strings.countryPlanStrategicPrioritiesTableHeading}
      contentClassName={styles.content}
      sub
    >
      <table>
        <thead>
          <tr>
            <th>
              {strings.countryPlanStrategicPriority}
            </th>
            <th>
              {strings.countryPlanPeopleTargeted}
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((sp) => (
            <tr key={sp.sp_name}>
              <td>
                {sp.sp_name_display}
              </td>
              <td>
                <NumberOutput
                  value={sp.people_targeted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

export default CountryPlanTable;
