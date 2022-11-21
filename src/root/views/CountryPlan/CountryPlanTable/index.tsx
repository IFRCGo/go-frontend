import React from 'react';
import {
  _cs,
} from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';

import styles from './styles.module.scss';

export const tables = [
  {
    label: "Climate and environmental",
    value: "5555"
  },
  {
    label: "Climate",
    value: "2000"
  },
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

function CountryPlanTable(props: Props) {
  const {
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    <div className={styles.countryPlanHeader}>
      <Container
        className={styles.header}
        heading={strings.countryPlanTableHeading}
      >
        <div className={styles.content}>
          <Row>
            <FieldOutput
              className={styles.contentHeader}
              label={strings.countryPlanTableHeading}
              value={strings.countryPlanPeopleTargeted}
            />
          </Row>
          {tables &&
            tables.map((type, index) => (
              <Row>
                <FieldOutput
                  key={index}
                  label={type.label}
                  value={type.value}
                />
              </Row>
            ))
          }
        </div>
      </Container>
    </div>
  );
}

export default CountryPlanTable;
