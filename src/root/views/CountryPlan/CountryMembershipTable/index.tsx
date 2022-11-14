import React from 'react';
import { TiTick } from 'react-icons/ti';
import {
  _cs,
} from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';
import Header from '#components/Header';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';

import styles from './styles.module.scss';

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

interface RowProps {
  className?: string;
  children?: React.ReactNode;
}

function Row(props: RowProps) {
  const {
    className,
    children,
  } = props;

  return (
    <div
      className={_cs(
        styles.row,
        className,
      )}
    >
      {children}
    </div>
  );
}

function CountryMembershipTable() {

  const { strings } = React.useContext(LanguageContext);

  return (
    <div className={styles.countryMembershipPlan}>
      <Header
        className={styles.header}
        heading="Membership Coordination"
        actions={undefined}
        headingSize="extraLarge"
      />
      <table>
        <tr>
          <td colSpan={10} className={styles.year}>
            <FieldOutput
              label="Name of Partner National Society"
              className={styles.tableHeader}
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
          <Row>
            <FieldOutput
              label="British Red Cross"
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
          </Row>
          <Row>
            <hr />
          </Row>
          <Row>
            <FieldOutput
              label="Red Cross China"
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
          </Row>
          <Row>
            <hr />
          </Row>
          <Row>
            <FieldOutput
              label="Canadian Red Cross"
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
          </Row>
          <Row>
            <hr />
          </Row>
          <Row>
            <FieldOutput
              label="Danish Red Cross"
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={undefined}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
            <FieldOutput
              value={<TiTick />}
              valueType="text"
              className={styles.grey}
            />
          </Row>
          <Row>
            <hr />
          </Row>
        </tbody>
      </table>
    </div>
  );
}

export default CountryMembershipTable;
