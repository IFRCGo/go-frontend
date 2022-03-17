import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormArray,
  useFormObject,
  getErrorObject,
  analyzeErrors,
} from '@togglecorp/toggle-form';
import { IoAdd } from 'react-icons/io5';
import { _cs } from '@togglecorp/fujs';

import {
  NumericValueOption,
  SetValueArg,
} from '#types';

import ExpandableContainer from '#components/ExpandableContainer';
import Container from '#components/Container';
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
  isCashType?: boolean;
  actionTitle: string;
  supplyOptionList: NumericValueOption[];
  onChange: (value: SetValueArg<Value>, index: number) => void;
  index: number;
  value: Value;
  error: ArrayError<Activity> | undefined;
  actionDescription?: string;
  averageHouseholdSizeForSelectedCountry: number | undefined | null;
}

function ActivityInput(props: Props) {
  const {
    index,
    actionTitle,
    actionDescription,
    value,
    onChange,
    supplyOptionList,
    error: errorFromProps,
    isCashType,
    averageHouseholdSizeForSelectedCountry,
  } = props;

  const defaultValue = React.useMemo(
    () => ({ action: value?.action }),
    [value?.action],
  );

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const error = (value && value.action && errorFromProps)
    ? getErrorObject(errorFromProps[value.action])
    : undefined;

  const hasError = analyzeErrors(error);

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
    <ExpandableContainer
      className={_cs(styles.activity, hasError && styles.errored)}
      heading={actionTitle}
      headingSize="small"
      sub
    >
      <InputSection
        description={actionDescription}
        className={styles.inputSection}
        multiRow
        oneColumn
        contentSectionClassName={styles.content}
        normalDescription
      >
        <DisaggregationInputs
          index={index}
          customActivity={false}
          onChange={onChange}
          value={value}
          error={errorFromProps}
          averageHouseholdSizeForSelectedCountry={averageHouseholdSizeForSelectedCountry}
        />
        {isCashType ? (
          <div className={styles.cashInput}>
            <NumberInput
              label="Number of Beneficiaries"
              name="beneficiaries_count"
              value={value?.beneficiaries_count}
              onChange={setFieldValue}
              error={error?.beneficiaries_count}
            />
            <NumberInput
              label="Amount in CHF"
              name="amount"
              value={value?.amount}
              onChange={setFieldValue}
              error={error?.amount}
            />
          </div>
        ) : (
          <>
            {supplyOptionList && supplyOptionList.length > 0 && (
              <Container
                sub
                heading="Supplies"
                headingSize="small"
                visibleOverflow
                actions={(
                  <Button
                    name={undefined}
                    variant="action"
                    onClick={handleAddSupplyButtonClick}
                  >
                    <IoAdd />
                  </Button>
                )}
              >
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
              </Container>
            )}
            <Container
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
                  label="Number of locations"
                  value={value?.point_count}
                  onChange={setFieldValue}
                  error={error?.point_count}
                />
              ) : (
                <Container
                  heading="Locations"
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
          </>
        )}
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

export default ActivityInput;
