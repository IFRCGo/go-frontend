import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';

import {
  SetValueArg,
  BooleanValueOption,
} from '#types';
import NumberInput from '#components/NumberInput';
import SegmentInput from '#components/SegmentInput';
import RadioInput from '#components/RadioInput';
import {
  Activity,
  CustomActivity,
} from '../../useEmergencyThreeWOptions';

import styles from './styles.module.scss';

const reportingTypeOptions: BooleanValueOption[] = [
  { label: 'Simplified reporting', value: true },
  { label: 'Detailed reporting', value: false },
];

const peopleHouseholdsOptions: {
  label: string;
  value: 'people' | 'households';
}[] = [
  { label: 'People', value: 'people' },
  { label: 'Households', value: 'households' },
];

type Props  = {
  customActivity: false;
  index: number;
  onChange: (value: SetValueArg<PartialForm<Activity>>, index: number) => void;
  value: PartialForm<Activity>;
  error: ArrayError<Activity> | undefined;
} | {
  customActivity: true;
  index: number;
  onChange: (value: SetValueArg<PartialForm<CustomActivity>>, index: number) => void;
  value: PartialForm<CustomActivity>;
  error: ArrayError<CustomActivity> | undefined;
}

const defaultValue: PartialForm<Activity> | PartialForm<CustomActivity> = {};

function DisaggregationInputs (props: Props) {
  const {
    index,
    onChange,
    value,
    error: errorFromProps,
  } = props;

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const error = React.useMemo(() => {
    if (!errorFromProps) {
      return undefined;
    }
    if (!props.customActivity && props.value && props.value.action) {
      return getErrorObject(errorFromProps[props.value.action]);
    }

    if (props.customActivity && props.value && props.value.client_id) {
      return getErrorObject(errorFromProps[props.value.client_id]);
    }
  }, [props.customActivity, props.value, errorFromProps]);

  return (
    <>
      <div className={styles.actions}>
        <SegmentInput
          name={"simplified" as const}
          options={reportingTypeOptions}
          keySelector={d => d.value}
          labelSelector={d => d.label}
          value={value?.simplified}
          onChange={setFieldValue}
          error={error?.simplified}
        />
      </div>
      <div className={styles.disaggregation}>
        {value?.simplified ? (
          <div className={styles.simplified}>
            <RadioInput
              name={"people_households" as const}
              options={peopleHouseholdsOptions}
              value={value?.people_households}
              error={error?.people_households}
              keySelector={d => d.value}
              labelSelector={d => d.label}
              onChange={setFieldValue}
            />
            {value?.people_households === 'households' && (
              <NumberInput
                name="household_count"
                label="Households"
                value={value?.household_count}
                onChange={setFieldValue}
                error={error?.household_count}
              />
            )}
            {value?.people_households === 'people' && (
              <NumberInput
                name="people_count"
                label="People"
                value={value?.people_count}
                onChange={setFieldValue}
                error={error?.people_count}
              />
            )}
            <NumberInput
              name="male_count"
              label="Men"
              value={value?.male_count}
              onChange={setFieldValue}
              error={error?.male_count}
            />
            <NumberInput
              name="female_count"
              label="Women"
              value={value?.female_count}
              onChange={setFieldValue}
              error={error?.female_count}
            />
          </div>
        ) : (
          <div className={styles.detailed}>
            <div className={styles.labels}>
              <div className={styles.label}>
                Gender/Age
              </div>
              <div className={styles.label}>
                0-5
              </div>
              <div className={styles.label}>
                6-12
              </div>
              <div className={styles.label}>
                13-17
              </div>
              <div className={styles.label}>
                18-29
              </div>
              <div className={styles.label}>
                30-39
              </div>
              <div className={styles.label}>
                40-49
              </div>
              <div className={styles.label}>
                50-59
              </div>
              <div className={styles.label}>
                60-69
              </div>
              <div className={styles.label}>
                70+
              </div>
            </div>
            <div className={styles.male}>
              <div className={styles.label}>
                Male
              </div>
              <NumberInput
                name="male_0_5_count"
                value={value?.male_0_5_count}
                error={error?.male_0_5_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_6_12_count"
                value={value?.male_6_12_count}
                error={error?.male_6_12_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_13_17_count"
                value={value?.male_13_17_count}
                error={error?.male_13_17_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_18_29_count"
                value={value?.male_18_29_count}
                error={error?.male_18_29_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_30_39_count"
                value={value?.male_30_39_count}
                error={error?.male_30_39_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_40_49_count"
                value={value?.male_40_49_count}
                error={error?.male_40_49_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_50_59_count"
                value={value?.male_50_59_count}
                error={error?.male_50_59_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_60_69_count"
                value={value?.male_60_69_count}
                error={error?.male_60_69_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="male_70_plus_count"
                value={value?.male_70_plus_count}
                error={error?.male_70_plus_count}
                onChange={setFieldValue}
              />
            </div>
            <div className={styles.female}>
              <div className={styles.label}>
                Female
              </div>
              <NumberInput
                name="female_0_5_count"
                value={value?.female_0_5_count}
                error={error?.female_0_5_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_6_12_count"
                value={value?.female_6_12_count}
                error={error?.female_6_12_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_13_17_count"
                value={value?.female_13_17_count}
                error={error?.female_13_17_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_18_29_count"
                value={value?.female_18_29_count}
                error={error?.female_18_29_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_30_39_count"
                value={value?.female_30_39_count}
                error={error?.female_30_39_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_40_49_count"
                value={value?.female_40_49_count}
                error={error?.female_40_49_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_50_59_count"
                value={value?.female_50_59_count}
                error={error?.female_50_59_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_60_69_count"
                value={value?.female_60_69_count}
                error={error?.female_60_69_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="female_70_plus_count"
                value={value?.female_70_plus_count}
                error={error?.female_70_plus_count}
                onChange={setFieldValue}
              />
            </div>
            <div className={styles.other}>
              <div className={styles.label}>
                Other/Unknown
              </div>
              <NumberInput
                name="other_0_5_count"
                value={value?.other_0_5_count}
                error={error?.other_0_5_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_6_12_count"
                value={value?.other_6_12_count}
                error={error?.other_6_12_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_13_17_count"
                value={value?.other_13_17_count}
                error={error?.other_13_17_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_18_29_count"
                value={value?.other_18_29_count}
                error={error?.other_18_29_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_30_39_count"
                value={value?.other_30_39_count}
                error={error?.other_30_39_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_40_49_count"
                value={value?.other_40_49_count}
                error={error?.other_40_49_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_50_59_count"
                value={value?.other_50_59_count}
                error={error?.other_50_59_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_60_69_count"
                value={value?.other_60_69_count}
                error={error?.other_60_69_count}
                onChange={setFieldValue}
              />
              <NumberInput
                name="other_70_plus_count"
                value={value?.other_70_plus_count}
                error={error?.other_70_plus_count}
                onChange={setFieldValue}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DisaggregationInputs;
