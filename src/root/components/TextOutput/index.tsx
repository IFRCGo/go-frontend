import React from 'react';
import { _cs } from '@togglecorp/fujs';

import NumberOutput, { Props as NumberOutputProps } from '#components/NumberOutput';
import DateOutput, { Props as DateOutputProps } from '#components/DateOutput';

import styles from './styles.module.scss';

interface BaseProps {
  className?: string;
  label?: React.ReactNode;
  labelContainerClassName?: string;
  description?: React.ReactNode;
  descriptionContainerClassName?: string;
  valueContainerClassName?: string;
  hideLabelColon?: boolean;
  block?: boolean;
}

export type Props = BaseProps & ({
  valueType: 'number';
  valueProps?: Omit<NumberOutputProps, 'value'>;
  value?: NumberOutputProps['value'] | null;
} | {
  valueType: 'date';
  valueProps?: Omit<DateOutputProps, 'value'>;
  value?: DateOutputProps['value'] | null;
} | {
  valueType?: 'text' | never;
  valueProps?: never | undefined;
  value?: React.ReactNode;
});

function TextOutput(props: Props) {
  const {
    className,
    label,
    labelContainerClassName,
    valueContainerClassName,
    description,
    descriptionContainerClassName,
    hideLabelColon,
    block,
  } = props;

  // eslint-disable-next-line prefer-destructuring, react/destructuring-assignment
  let value: React.ReactNode = props.value;

  // eslint-disable-next-line prefer-destructuring, react/destructuring-assignment
  if (props.valueType === 'number') {
    value = (
      <NumberOutput
        value={props.value}
        {...props.valueProps}
      />
    );
    // eslint-disable-next-line prefer-destructuring, react/destructuring-assignment
  } else if (props.valueType === 'date') {
    value = props.value ? (
      <DateOutput
        value={props.value}
        {...props.valueProps}
      />
    ) : null;
  }

  return (
    <div
      className={_cs(
        styles.textOutput,
        className,
        !hideLabelColon && styles.withLabelColon,
        block && styles.blockType,
      )}
    >
      {label && (
        <div className={_cs(styles.label, labelContainerClassName)}>
          {label}
        </div>
      )}
      <div className={_cs(styles.value, valueContainerClassName)}>
        {value}
      </div>
      {description && (
        <div className={_cs(styles.description, descriptionContainerClassName)}>
          {description}
        </div>
      )}
    </div>
  );
}

export default TextOutput;
