import React from 'react';
import {
  _cs,
} from '@togglecorp/fujs';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';

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

function CountryMembershipTable(props: Props) {
  const {
    className,
  } = props;

  return (
    <table>
      <tr>
        <td colSpan={2} className={styles.year}>
          <FieldOutput
            label="Name of Partner National Society"
            className={styles.climate}
          />
          <FieldOutput
            label="Climate"
          />
          <FieldOutput
            label="Crises"
          />
          <FieldOutput
            label="Health"
          />
          <FieldOutput
            label="Migration"
          />
          <FieldOutput
            label="Inclusion"
          />
          <FieldOutput
            label="Engaged"
          />
          <FieldOutput
            label="Accountable"
          />
          <FieldOutput
            label="Trusted"
          />
        </td>
      </tr>
      <tbody>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="British Red cross"
              value={500000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Canadian Red Cross"
              value={500000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
        <tr>
          <td className={styles.peopleLabel}>
            <FieldOutput
              label="Red Cross of China"
              value={500000}
              valueType="number"
              className={styles.grey}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default CountryMembershipTable;
