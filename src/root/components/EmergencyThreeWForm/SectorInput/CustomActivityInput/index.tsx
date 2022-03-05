import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormArray,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';

import { SetValueArg } from '#types';
import {
  CustomActivity,
  CustomSupply,
  Point,
} from '../../useEmergencyThreeWOptions';

import InputSection from '#components/InputSection';
import TextInput from '#components/TextInput';
import TextArea from '#components/TextArea';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';

import CustomSupplyInput from './CustomSupplyInput';
import DisaggregationInputs from '../DisaggregationInputs';
import PointInput from '../PointInput';
import styles from './styles.module.scss';

type Value = PartialForm<CustomActivity>;

interface Props {
  onChange: (value: SetValueArg<Value>, index: number) => void;
  index: number;
  value: Value;
  error: ArrayError<CustomActivity> | undefined;
  onRemove: (index: number) => void;
}

function CustomActivityInput(props: Props) {
  const {
    index,
    value,
    onChange,
    error: errorFromProps,
    onRemove,
  } = props;

  const defaultValue = React.useMemo(
    () => ({ client_id: value?.client_id }),
    [value?.client_id],
  );

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const error = (value && value.client_id && errorFromProps)
    ? getErrorObject(errorFromProps[value.client_id])
    : undefined;

  const {
    setValue: setSupply,
    removeValue: removeSupply,
  } = useFormArray<'custom_supplies', PartialForm<CustomSupply>>(
    'custom_supplies',
    setFieldValue,
  );

  const {
    setValue: setPoint,
    removeValue: removePoint,
  } = useFormArray<'points', PartialForm<Point>>(
    'points',
    setFieldValue,
  );

  const handleAddSupplyButtonClick = React.useCallback(() => {
    const client_id = randomString();
    const newSupply: PartialForm<CustomSupply> = { client_id };

    setFieldValue(
      (oldValue: PartialForm<CustomSupply>[] | undefined) => (
        [...(oldValue ?? []), newSupply]
      ),
      'custom_supplies',
    );
  }, [setFieldValue]);

  const handleAddPointButtonClick = React.useCallback(() => {
    const client_id = randomString();
    const newPoint: PartialForm<Point> = { client_id };

    setFieldValue(
      (oldValue: PartialForm<Point>[] | undefined) => (
        [...(oldValue ?? []), newPoint]
      ),
      'points',
    );
  }, [setFieldValue]);

  return (
    <InputSection
      title={`Custom Activity #${index + 1}`}
      className={styles.customActivity}
      multiRow
      oneColumn
    >
      <div className={styles.actions}>
        <Button
          name={index}
          onClick={onRemove}
          variant="secondary"
        >
          Remove
        </Button>
      </div>
      <TextInput
        label="Activity Title"
        name="custom_action"
        value={value.custom_action}
        onChange={setFieldValue}
        error={error?.custom_action}
      />
      <DisaggregationInputs
        index={index}
        customActivity={true}
        onChange={onChange}
        value={value}
        error={errorFromProps}
      />
      <div className={styles.supplyList}>
        <div className={styles.supplyTitle}>
          Supplies
        </div>
        {value?.custom_supplies?.map((s, i) => (
          <CustomSupplyInput
            index={i}
            key={s.client_id}
            value={s}
            onChange={setSupply}
            error={getErrorObject(error?.custom_supplies)}
            onRemove={removeSupply}
          />
        ))}
        {!value?.custom_supplies?.length && (
          <div className={styles.emptyMessage}>
            No supplies yet.
          </div>
        )}
        <Button
          className={styles.addSupplyButton}
          name={undefined}
          variant="secondary"
          onClick={handleAddSupplyButtonClick}
        >
          Add Supply
        </Button>
      </div>
      <div className={styles.points}>
        {value?.simplified ? (
          <NumberInput
            className={styles.pointCountInput}
            name="point_count"
            label="Point Count"
            value={value?.point_count}
            onChange={setFieldValue}
            error={error?.point_count}
          />
        ) : (
          <div className={styles.pointList}>
            <div className={styles.pointTitle}>
              Points
            </div>
            {value?.points?.map((p, i) => (
              <PointInput
                index={i}
                key={p.client_id}
                value={p}
                onChange={setPoint}
                error={getErrorObject(error?.points)}
                onRemove={removePoint}
              />
            ))}
            {!value?.points?.length && (
              <div className={styles.emptyMessage}>
                No points yet.
              </div>
            )}
            <Button
              name={undefined}
              variant="secondary"
              onClick={handleAddPointButtonClick}
            >
              Add Point
            </Button>
          </div>
        )}
      </div>
      <TextArea
        name="details"
        label="Custom Activity Details"
        value={value?.details}
        onChange={setFieldValue}
        error={error?.details}
        rows={2}
      />
    </InputSection>
  );
}

export default CustomActivityInput;
