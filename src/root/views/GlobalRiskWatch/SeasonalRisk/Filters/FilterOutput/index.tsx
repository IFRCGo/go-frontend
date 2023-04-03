import React from 'react';
import {
  _cs,
  listToMap,
  isNotDefined,
} from '@togglecorp/fujs';

import Chip from '#components/Chip';
import Button from '#components/Button';
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

const COLLAPSED_ITEM_LIMIT = 10;
const COLLAPSED_ITEM_BUFFER = 3;


function FilterOutput<N, V, O>(props: Props<N, V, O>) {
  const {
    className,
    name,
    options,
    optionKeySelector,
    optionLabelSelector,
    label,
  } = props;

  const [isCollapsed, setIsCollapsed] = React.useState(true);

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

  const valueList = React.useMemo(() => {
    if (props.isMulti) {
      if (isCollapsed && props.value.length > (COLLAPSED_ITEM_LIMIT + COLLAPSED_ITEM_BUFFER)) {
        return [...props.value].splice(0, COLLAPSED_ITEM_LIMIT);
      } else {
        return props.value;
      }
    }

    return [];
  }, [props.isMulti, props.value, isCollapsed]);

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
          <>
            {valueList.map((key) => (
              <Chip
                className={styles.chip}
                key={String(key)}
                name={key}
                onDismiss={handleChipDismiss}
              >
                {optionLabelListMap[String(key)]}
              </Chip>
            ))}
            {props.value.length > (COLLAPSED_ITEM_LIMIT + COLLAPSED_ITEM_BUFFER) && (
              <div className={styles.reducedListDetails}>
                {valueList.length < props.value.length && (
                  <div>
                    ... and {props.value.length - valueList.length} more.
                  </div>
                )}
                <Button
                  name={!isCollapsed}
                  variant="transparent"
                  onClick={setIsCollapsed}
                >
                  {isCollapsed ? 'Show all selected countries' : 'Show less'}
                </Button>
              </div>
            )}
          </>
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
