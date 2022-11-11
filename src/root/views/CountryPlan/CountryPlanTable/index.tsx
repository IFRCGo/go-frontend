import React from 'react';
import {
  _cs,
} from '@togglecorp/fujs';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';
import Header from '#components/Header';

import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function FieldOutput(props: TextOutputProps) {
  const {
    className,
    ...otherProps
  } = props;

  return (
    <TextOutput
      className={_cs(styles.fieldOutput, className)}
      labelContainerClassName={styles.label}
      valueContainerClassName={styles.value}
      hideLabelColon={true}
      {...otherProps}
    />
  );
}

function CountryPlanTable(props: Props) {
  const {
    className,
  } = props;

  return (
    <table>
      <tr>
        <td colSpan={2} className={styles.year}>
          <FieldOutput
            label="Strategic Priorities"
          />
          <FieldOutput
            label="People Targeted"
          />
        </td>
      </tr>
      <tbody>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Climate and environment crises"
              value={500000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Evolving crises and disasters"
              value={500000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Growing gaps in health and well-being"
              value={500000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Migration and identity"
              value={1000000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Values, power, and inclusion"
              value={110000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Ongoing emergencies"
              value={20000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default CountryPlanTable;
