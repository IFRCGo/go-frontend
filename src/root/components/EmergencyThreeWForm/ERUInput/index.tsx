import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  IoRadioButtonOn,
  IoRadioButtonOff,
} from 'react-icons/io5';

import { ERU } from '#types';

import RadioInput from '#components/RadioInput';
import {Props as RadioProps} from '#components/RadioInput/Radio';

import styles from './styles.module.scss';

export interface ERUItemProps<N, IN> extends RadioProps<N, IN> {
  eru: ERU;
}

function ERUItem<N, IN>(props: ERUItemProps<N, IN>) {
  const {
    // label,
    name,
    onClick,
    value,
    className,
    eru,
  } = props;

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick(name);
    }
  }, [name, onClick]);

  return (
    <div
      className={_cs(styles.eruItem, value && styles.active, className)}
      onClick={handleClick}
    >
      {value ? (
        <IoRadioButtonOn className={styles.icon} />
      ) : (
        <IoRadioButtonOff className={styles.icon} />
      )}
      <div className={styles.nationalSociety}>
        {eru?.eru_owner?.national_society_country?.society_name}
      </div>
      <div className={styles.type}>
        {eru?.type_display}
      </div>
    </div>
  );
}

interface Props<N> {
  name: N;
  value: ERU['id'] | undefined | null;
  options: ERU[];
  onChange: (value: ERU['id'] | undefined, name: N) => void;
  error?: React.ReactNode;
}

function ERUInput<N> (props: Props<N>) {
  const {
    name,
    value,
    options,
    onChange,
    error,
  } = props;

  const handleItemClick = React.useCallback((key: ERU['id']) => {
    if (onChange) {
      onChange(key, name);
    }
  }, [onChange, name]);

  const rendererParams = React.useCallback((eru: ERU): ERUItemProps<ERU['id'], N> => ({
    name: eru.id,
    eru,
    onClick: handleItemClick,
    value: value === eru.id,
  }), [value, handleItemClick]);

  return (
    <RadioInput<N, ERU, ERU['id'], ERUItemProps<ERU['id'], N>>
      label={(
        <>
          <div className={styles.icon} />
          <div className={styles.nationalSociety}>
            Lead National Society
          </div>
          <div className={styles.type}>
            Type
          </div>
        </>
      )}
      labelContainerClassName={styles.eruItemHeader}
      className={styles.eruInput}
      name={name}
      options={options}
      keySelector={d => d.id}
      labelSelector={d => null}
      onChange={onChange}
      renderer={ERUItem}
      rendererParams={rendererParams}
      listContainerClassName={styles.eruList}
      value={value}
      error={error}
    />
  );
}

export default ERUInput;
