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
  IoAdd,
  IoTrash,
} from 'react-icons/io5';

import { SetValueArg } from '#types';
import {
  CustomActivity,
  CustomSupply,
  Point,
} from '../../useEmergencyThreeWOptions';

import ExpandableContainer from '#components/ExpandableContainer';
import Container from '#components/Container';
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
    <ExpandableContainer
      className={styles.customActivity}
      heading={`Custom Activity #${index + 1}`}
      headingSize="small"
      sub
      actions={(
        <Button
          name={index}
          onClick={onRemove}
          variant="action"
        >
          <IoTrash />
        </Button>
      )}
    >
      <InputSection
        className={styles.inputSection}
        multiRow
        oneColumn
        contentSectionClassName={styles.content}
      >
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
        <Container
          className={styles.container}
          heading="Custom Supplies"
          sub
          visibleOverflow
          headingSize="small"
          actions={(
            <Button
              name={undefined}
              variant="action"
              onClick={handleAddCustomSupplyButtonClick}
            >
              <IoAdd />
            </Button>
          )}
        >
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
        </Container>
        <div className={styles.points}>
          {value?.is_simplified_report ? (
            <NumberInput
              className={styles.pointCountInput}
              name="point_count"
              label="Point Count"
              value={value?.point_count}
              onChange={setFieldValue}
              error={error?.point_count}
            />
          ) : (
            <Container
              className={styles.container}
              heading="Points"
              sub
              visibleOverflow
              headingSize="small"
              actions={(
                <Button
                  name={undefined}
                  variant="action"
                  onClick={handleAddPointButtonClick}
                >
                  <IoAdd />
                </Button>
              )}
            >
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
            </Container>
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
    </ExpandableContainer>
  );
}

export default CustomActivityInput;
