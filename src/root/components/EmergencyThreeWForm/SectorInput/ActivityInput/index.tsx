import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormArray,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';

import {
  NumericValueOption,
  SetValueArg,
} from '#types';

import InputSection from '#components/InputSection';
import TextArea from '#components/TextArea';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';

import {
  Activity,
  Supply,
  CustomSupply,
  Point,
} from '../../useEmergencyThreeWOptions';

import SupplyInput from './SupplyInput';
import CustomSupplyInput from '../CustomActivityInput/CustomSupplyInput';
import PointInput from '../PointInput';
import DisaggregationInputs from '../DisaggregationInputs';
import styles from './styles.module.scss';

type Value = PartialForm<Activity>;

interface Props {
  actionTitle: string;
  supplyOptionList: NumericValueOption[];
  onChange: (value: SetValueArg<Value>, index: number) => void;
  index: number;
  value: Value;
  error: ArrayError<Activity> | undefined;
}

function ActivityInput(props: Props) {
  const {
    index,
    actionTitle,
    value,
    onChange,
    supplyOptionList,
    error: errorFromProps,
  } = props;

  const defaultValue = React.useMemo(
    () => ({ action: value?.action }),
    [value?.action],
  );

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const error = (value && value.action && errorFromProps)
    ? getErrorObject(errorFromProps[value.action])
    : undefined;

  const {
    setValue: setSupply,
    removeValue: removeSupply,
  } = useFormArray<'supplies', PartialForm<Supply>>(
    'supplies',
    setFieldValue,
  );

  const {
    setValue: setCustomSupply,
    removeValue: removeCustomSupply,
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
    const newSupply: PartialForm<Supply> = { client_id };

    setFieldValue(
      (oldValue: PartialForm<Supply>[] | undefined) => (
        [...(oldValue ?? []), newSupply]
      ),
      'supplies',
    );
  }, [setFieldValue]);

  const handleAddCustomSupplyButtonClick = React.useCallback(() => {
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
      title={actionTitle}
      className={styles.activity}
      multiRow
      oneColumn
    >
      <DisaggregationInputs
        index={index}
        customActivity={false}
        onChange={onChange}
        value={value}
        error={errorFromProps}
      />
      {supplyOptionList && supplyOptionList.length > 0 && (
        <div className={styles.supplyList}>
          <div className={styles.supplyTitle}>
            Supplies
          </div>
          {value?.supplies?.map((s, i) => (
            <SupplyInput
              index={i}
              key={s.client_id}
              value={s}
              onChange={setSupply}
              error={getErrorObject(error?.supplies)}
              supplyOptions={supplyOptionList}
              onRemove={removeSupply}
            />
          ))}
          {!value?.supplies?.length && (
            <div className={styles.emptyMessage}>
              No supplies yet.
            </div>
          )}
          <Button
            name={undefined}
            variant="secondary"
            onClick={handleAddSupplyButtonClick}
          >
            Add Supply
          </Button>
        </div>
      )}
      <div className={styles.customSupplyList}>
        <div className={styles.customSupplyTitle}>
          Supplies
        </div>
        {value?.custom_supplies?.map((s, i) => (
          <CustomSupplyInput
            index={i}
            key={s.client_id}
            value={s}
            onChange={setCustomSupply}
            error={getErrorObject(error?.custom_supplies)}
            onRemove={removeCustomSupply}
          />
        ))}
        {!value?.custom_supplies?.length && (
          <div className={styles.emptyMessage}>
            No custom supplies yet.
          </div>
        )}
        <Button
          name={undefined}
          variant="secondary"
          onClick={handleAddCustomSupplyButtonClick}
        >
          Add Custom Supply
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
        label="Activity Details"
        value={value?.details}
        onChange={setFieldValue}
        error={error?.details}
        rows={2}
      />
    </InputSection>
  );
}

export default ActivityInput;
