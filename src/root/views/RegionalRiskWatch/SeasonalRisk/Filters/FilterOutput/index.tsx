import React from 'react';
import {
  _cs,
  listToMap,
  isNotDefined,
} from '@togglecorp/fujs';

import Chip from '#components/Chip';
import styles from './styles.module.scss';

type BaseProps<N, O> = {
  className?: string;
  name: N;
  options: O[];
  optionKeySelector: (value: O) => string;
  optionLabelSelector: (value: O) => React.ReactNode;
  label?: React.ReactNode;
}

type Props<N, V, O> = BaseProps<N, O> & ({
  isMulti?: never;
  value: V;
  onChange: (newValue: V | undefined, name: N) => void;
} | {
  isMulti: true;
  value: V[];
  onChange: (newValue: V[], name: N) => void;
})

function FilterOutput<N, V, O>(props: Props<N, V, O>) {
  const {
    className,
    name,
    options,
    optionKeySelector,
    optionLabelSelector,
    label,
  } = props;

  const optionLabelListMap = React.useMemo(() => (
    listToMap(options, optionKeySelector, optionLabelSelector)
  ), [options, optionKeySelector, optionLabelSelector]);

  const handleChipDismiss = React.useCallback((key: V)=> {
    if (props.isMulti) {
      const newValue = props.value.filter((v) => v !== key);

      props.onChange(
        newValue,
        name,
      );
    } else {
      props.onChange(
        undefined,
        name,
      );
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [props.isMulti, props.value, props.onChange, name]);

  if (!props.isMulti && isNotDefined(props.value)) {
    return null;
  }

  if (props.isMulti && props.value.length === 0) {
    return null;
  }

  return (
    <div
      className={_cs(styles.filterOutput, className)}
    >
      <div className={styles.label}>
        {label}
      </div>
      <div className={styles.selectedValues}>
        {props.isMulti ? (
          props.value.map((key) => (
            <Chip
              key={String(key)}
              name={key}
              onDismiss={handleChipDismiss}
            >
              {optionLabelListMap[String(key)]}
            </Chip>
          ))
        ) : (
          <Chip
            name={props.value}
            onDismiss={handleChipDismiss}
          >
            {optionLabelListMap[String(props.value)]}
          </Chip>
        )}
      </div>
    </div>
  );
}

export default FilterOutput;
