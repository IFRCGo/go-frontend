import React from 'react';
import { TiTick } from 'react-icons/ti';
import {
  _cs,
} from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';

import styles from './styles.module.scss';
import Container from '#components/Container';

export const tables = [
  {
    label: "British Red Cross",
    value: { undefined }
  },
  {
    label: "Red Cross China",
    value: { undefined }
  },
  {
    label: "Danish Red Cross",
    value: { undefined }
  }
];

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

interface Props {
  className?: string;
}

function CountryMembershipTable(props: Props) {

  const { strings } = React.useContext(LanguageContext);

  return (
    <div className={styles.countryMembershipPlan}>
      <Container
        className={styles.header}
        heading={strings.countryPlanMembershipCoordinationtitle}
      >
        <div className={styles.content}>
          <FieldOutput
            label={strings.countryPlanNameOfPartnerNationalSociety}
            className={styles.tableTitle}
          />
          <FieldOutput
            label="Climate"
            className={styles.tableHeader}
          />
          <FieldOutput
            label="Crises"
            className={styles.tableHeader}
          />
          <FieldOutput
            label="Health"
            className={styles.tableHeader}
          />
          <FieldOutput
            label="Migration"
            className={styles.tableHeader}
          />
          <FieldOutput
            label="Inclusion"
            className={styles.tableHeader}
          />
          <FieldOutput
            label="Engaged"
            className={styles.tableHeader}
          />
          <FieldOutput
            label="Accountable"
            className={styles.tableHeader}
          />
          <FieldOutput
            label="Trusted"
            className={styles.tableHeader}
          />
        </div>
        {tables &&
          tables.map((type, index) => (
            <>
              <Row key={index}>
                <FieldOutput
                  label={type.label}
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
              </Row>
              <Row>
                <hr />
              </Row>
            </>
          ))}
      </Container>
    </div>
  );
}

export default CountryMembershipTable;
