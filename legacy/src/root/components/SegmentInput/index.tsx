import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button, { Props as ButtonProps } from '#components/Button';
import RadioInput, { Props as RadioInputProps } from '#components/RadioInput';
import { Props as RadioProps } from '#components/RadioInput/Radio';
import { genericMemo } from '#utils/common';

import styles from './styles.module.scss';

// Note: more props can be picked as per requirement
type ExtraSegmentProps<N> = Pick<ButtonProps<N>, 'icons' | 'iconsClassName' | 'actions' | 'actionsClassName'>;
export interface SegmentProps<N, IN> extends RadioProps<N, IN>, ExtraSegmentProps<N> {
  variant?: 'primary' | 'secondary',
}

function Segment<N, IN>(props: SegmentProps<N, IN>) {
  const {
    label,
    name,
    onClick,
    value,
    className,
    variant = 'primary',
    inputName, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...otherProps
  } = props;

  return (
    <Button
      {...otherProps}
      className={_cs(
        styles.segment,
        value && styles.active,
        variant === 'secondary' && styles.secondaryVariant,
        className,
      )}
      name={name}
      onClick={onClick}
      variant="transparent"
    >
      { label }
    </Button>
  );
}

export interface Props<
  N,
  O,
  V,
  RRP extends RadioProps<V, N>,
> extends Omit<RadioInputProps<N, O, V, RRP>, 'rendererParams' | 'renderer' | 'listContainerClassName' | 'keySelector' | 'labelSelector'> {
  rendererParams?: RadioInputProps<N, O, V, RRP>['rendererParams'];
  listContainerClassName?: RadioInputProps<N, O, V, RRP>['listContainerClassName'];
  keySelector: RadioInputProps<N, O, V, RRP>['keySelector'];
  labelSelector: RadioInputProps<N, O, V, RRP>['labelSelector'];
}

// eslint-disable-next-line @typescript-eslint/ban-types
function SegmentInput<
  N,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O extends object,
  V extends string | number | boolean,
  RRP extends RadioProps<V, N>,
>(props: Props<N, O, V, RRP>) {
  const {
    rendererParams,
    listContainerClassName,
    keySelector,
    labelSelector,
    className,
    ...otherProps
  } = props;

  return (
    <RadioInput
      className={_cs(className, styles.segmentInput)}
      {...otherProps}
      renderer={Segment}
      rendererParams={rendererParams}
      listContainerClassName={_cs(listContainerClassName, styles.list)}
      keySelector={keySelector}
      labelSelector={labelSelector}
    />
  );
}

export default genericMemo(SegmentInput);
