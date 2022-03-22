import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import {
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';

import { SetValueArg } from '#types';

import NonFieldError from '#components/NonFieldError';
import Checkbox from '#components/Checkbox';
import NumberInput from '#components/NumberInput';
import Switch from '#components/Switch';
import RadioInput from '#components/RadioInput';
import TextOutput from '#components/TextOutput';
import {
  Activity,
  CustomActivity,
} from '../../useEmergencyThreeWOptions';

import styles from './styles.module.scss';

const peopleHouseholdsOptions: {
  label: string;
  value: 'people' | 'households';
}[] = [
  { label: 'People', value: 'people' },
  { label: 'Households', value: 'households' },
];

const sumSafe = (nums: (number | undefined | null)[]) => {
  const safeNums = nums.filter(isDefined);
  if (safeNums.length === 0) {
    return undefined;
  }

  return safeNums.reduce((acc, val) => acc + val, 0);
};

function valueSelector<T>(d: { value: T }) {
  return d.value;
}
function labelSelector<T>(d: { label: T }) {
  return d.label;
}
const defaultValue: PartialForm<Activity> | PartialForm<CustomActivity> = {};

type Props  = {
  customActivity: false;
  index: number;
  onChange: (value: SetValueArg<PartialForm<Activity>>, index: number) => void;
  value: PartialForm<Activity>;
  error: ArrayError<Activity> | undefined;
  averageHouseholdSizeForSelectedCountry: number | undefined | null;
} | {
  customActivity: true;
  index: number;
  onChange: (value: SetValueArg<PartialForm<CustomActivity>>, index: number) => void;
  value: PartialForm<CustomActivity>;
  error: ArrayError<CustomActivity> | undefined;
  averageHouseholdSizeForSelectedCountry: number | undefined | null;
}

function DisaggregationInputs (props: Props) {
  const {
    index,
    onChange,
    value,
    error: errorFromProps,
    averageHouseholdSizeForSelectedCountry,
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


  const total_male = sumSafe([
    value?.male_0_1_count,
    value?.male_2_5_count,
    value?.male_6_12_count,
    value?.male_13_17_count,
    value?.male_18_59_count,
    value?.male_60_plus_count,
    value?.male_unknown_age_count,
  ]);

  const total_female = sumSafe([
    value?.female_0_1_count,
    value?.female_2_5_count,
    value?.female_6_12_count,
    value?.female_13_17_count,
    value?.female_18_59_count,
    value?.female_60_plus_count,
    value?.female_unknown_age_count,
  ]);

  const total_other = sumSafe([
    value?.other_0_1_count,
    value?.other_2_5_count,
    value?.other_6_12_count,
    value?.other_13_17_count,
    value?.other_18_59_count,
    value?.other_60_plus_count,
    value?.other_unknown_age_count,
  ]);

  const total_0_1 = sumSafe([
    value?.male_0_1_count,
    value?.female_0_1_count,
    value?.other_0_1_count,
  ]);

  const total_2_5 = sumSafe([
    value?.male_2_5_count,
    value?.female_2_5_count,
    value?.other_2_5_count,
  ]);

  const total_6_12 = sumSafe([
    value?.male_6_12_count,
    value?.female_6_12_count,
    value?.other_6_12_count,
  ]);

  const total_13_17 = sumSafe([
    value?.male_13_17_count,
    value?.female_13_17_count,
    value?.other_13_17_count,
  ]);

  const total_18_59 = sumSafe([
    value?.male_18_59_count,
    value?.female_18_59_count,
    value?.other_18_59_count,
  ]);

  const total_60_plus = sumSafe([
    value?.male_60_plus_count,
    value?.female_60_plus_count,
    value?.other_60_plus_count,
  ]);

  const total_unknown_age = sumSafe([
    value?.male_unknown_age_count,
    value?.female_unknown_age_count,
    value?.other_unknown_age_count,
  ]);

  const total_total = sumSafe([
    total_male,
    total_female,
    total_other,
  ]);

  const disabled_total_male = sumSafe([
    value?.disabled_male_0_1_count,
    value?.disabled_male_2_5_count,
    value?.disabled_male_6_12_count,
    value?.disabled_male_13_17_count,
    value?.disabled_male_18_59_count,
    value?.disabled_male_60_plus_count,
    value?.disabled_male_unknown_age_count,
  ]);

  const disabled_total_female = sumSafe([
    value?.disabled_female_0_1_count,
    value?.disabled_female_2_5_count,
    value?.disabled_female_6_12_count,
    value?.disabled_female_13_17_count,
    value?.disabled_female_18_59_count,
    value?.disabled_female_60_plus_count,
    value?.disabled_female_unknown_age_count,
  ]);

  const disabled_total_other = sumSafe([
    value?.disabled_other_0_1_count,
    value?.disabled_other_2_5_count,
    value?.disabled_other_6_12_count,
    value?.disabled_other_13_17_count,
    value?.disabled_other_18_59_count,
    value?.disabled_other_60_plus_count,
    value?.disabled_other_unknown_age_count,
  ]);

  const disabled_total_0_1 = sumSafe([
    value?.disabled_male_0_1_count,
    value?.disabled_female_0_1_count,
    value?.disabled_other_0_1_count,
  ]);

  const disabled_total_2_5 = sumSafe([
    value?.disabled_male_2_5_count,
    value?.disabled_female_2_5_count,
    value?.disabled_other_2_5_count,
  ]);

  const disabled_total_6_12 = sumSafe([
    value?.disabled_male_6_12_count,
    value?.disabled_female_6_12_count,
    value?.disabled_other_6_12_count,
  ]);

  const disabled_total_13_17 = sumSafe([
    value?.disabled_male_13_17_count,
    value?.disabled_female_13_17_count,
    value?.disabled_other_13_17_count,
  ]);

  const disabled_total_18_59 = sumSafe([
    value?.disabled_male_18_59_count,
    value?.disabled_female_18_59_count,
    value?.disabled_other_18_59_count,
  ]);

  const disabled_total_60_plus = sumSafe([
    value?.disabled_male_60_plus_count,
    value?.disabled_female_60_plus_count,
    value?.disabled_other_60_plus_count,
  ]);

  const disabled_total_unknown_age = sumSafe([
    value?.disabled_male_unknown_age_count,
    value?.disabled_female_unknown_age_count,
    value?.disabled_other_unknown_age_count,
  ]);

  const disabled_total_total = sumSafe([
    disabled_total_male,
    disabled_total_female,
    disabled_total_other,
  ]);

  const genderDisaggregationDisabled = isDefined(value?.people_count) && isNotDefined(value?.male_count) && isNotDefined(value?.female_count);
  const peopleCountDisabled = isDefined(value?.male_count) || isDefined(value?.female_count);

  React.useEffect(() => {
    if (isDefined(value?.male_count) || isDefined(value?.female_count)) {
      const m = value?.male_count ?? 0;
      const f = value?.female_count ?? 0;
      const total = m + f;

      if (!Number.isNaN(total)) {
        setFieldValue(total, 'people_count');
      }
    }
  }, [value?.male_count, value?.female_count, setFieldValue]);

  return (
    <>
      <NonFieldError error={error} />
      {value?.is_simplified_report === true
        && value?.people_households === 'people'
        && error?.people_count
        && !value?.has_no_data_on_people_reached && (
        <div className={styles.tip}>
          If data is not available for people, please check &quot;No data on people reached&quot;
        </div>
      )}
      <div className={styles.top}>
        <Switch
          label="Detailed Reporting"
          name="is_simplified_report"
          value={value?.is_simplified_report}
          onChange={setFieldValue}
          invertedLogic
        />
        <Checkbox
          label="No data on people reached"
          name={"has_no_data_on_people_reached" as const}
          value={value?.has_no_data_on_people_reached}
          onChange={setFieldValue}
        />
      </div>
      <div className={styles.disaggregation}>
        {value?.is_simplified_report === true && (
          <div className={styles.simplified}>
            <div className={styles.totalValues}>
              <RadioInput
                name={"people_households" as const}
                options={peopleHouseholdsOptions}
                value={value?.people_households}
                error={error?.people_households}
                keySelector={valueSelector}
                labelSelector={labelSelector}
                onChange={setFieldValue}
              />
              {value?.people_households === 'households' && (
                <>
                  <NumberInput
                    name="household_count"
                    label="Households"
                    value={value?.household_count}
                    onChange={setFieldValue}
                    error={error?.household_count}
                  />
                </>
              )}
              {value?.people_households === 'people' && (
                <NumberInput
                  name="people_count"
                  label="People"
                  value={value?.people_count}
                  onChange={setFieldValue}
                  error={error?.people_count}
                  disabled={peopleCountDisabled}
                />
              )}
            </div>
            {value?.people_households === 'households' && isDefined(averageHouseholdSizeForSelectedCountry) && (
              <TextOutput
                className={styles.info}
                label="Average household size for selected country"
                value={averageHouseholdSizeForSelectedCountry}
              />
            )}
            {value?.people_households === 'people' && (
              <>
                <div className={styles.separator}>
                  OR
                </div>
                <div className={styles.genderDisaggregation}>
                  <NumberInput
                    name="male_count"
                    label="Male"
                    value={value?.male_count}
                    onChange={setFieldValue}
                    error={error?.male_count}
                    disabled={genderDisaggregationDisabled}
                  />
                  <NumberInput
                    name="female_count"
                    label="Female"
                    value={value?.female_count}
                    onChange={setFieldValue}
                    error={error?.female_count}
                    disabled={genderDisaggregationDisabled}
                  />
                </div>
              </>
            )}
          </div>
        )}
        {value?.is_simplified_report === false && (
          <div className={styles.detailed}>
            <div className={styles.tableContainer}>
              <div className={styles.genderAndAgeDisaggregation}>
                <div className={styles.labels}>
                  <div className={styles.label}>
                    Gender/Age
                  </div>
                  <div className={styles.label}>
                    0-1
                  </div>
                  <div className={styles.label}>
                    2-5
                  </div>
                  <div className={styles.label}>
                    6-12
                  </div>
                  <div className={styles.label}>
                    13-17
                  </div>
                  <div className={styles.label}>
                    18-59
                  </div>
                  <div className={styles.label}>
                    60+
                  </div>
                  <div className={styles.label}>
                    Unknown
                  </div>
                  <div className={styles.totalLabel}>
                    Total
                  </div>
                </div>
                <div className={styles.male}>
                  <div className={styles.label}>
                    Male
                  </div>
                  <NumberInput
                    name="male_0_1_count"
                    value={value?.male_0_1_count}
                    error={error?.male_0_1_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="male_2_5_count"
                    value={value?.male_2_5_count}
                    error={error?.male_2_5_count}
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
                    name="male_18_59_count"
                    value={value?.male_18_59_count}
                    error={error?.male_18_59_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="male_60_plus_count"
                    value={value?.male_60_plus_count}
                    error={error?.male_60_plus_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="male_unknown_age_count"
                    value={value?.male_unknown_age_count}
                    error={error?.male_unknown_age_count}
                    onChange={setFieldValue}
                  />
                  <div className={styles.totalLabel}>
                    {total_male}
                  </div>
                </div>
                <div className={styles.female}>
                  <div className={styles.label}>
                    Female
                  </div>
                  <NumberInput
                    name="female_0_1_count"
                    value={value?.female_0_1_count}
                    error={error?.female_0_1_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="female_2_5_count"
                    value={value?.female_2_5_count}
                    error={error?.female_2_5_count}
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
                    name="female_18_59_count"
                    value={value?.female_18_59_count}
                    error={error?.female_18_59_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="female_60_plus_count"
                    value={value?.female_60_plus_count}
                    error={error?.female_60_plus_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="female_unknown_age_count"
                    value={value?.female_unknown_age_count}
                    error={error?.female_unknown_age_count}
                    onChange={setFieldValue}
                  />
                  <div className={styles.totalLabel}>
                    {total_female}
                  </div>
                </div>
                <div className={styles.other}>
                  <div className={styles.label}>
                    Other/Unknown
                  </div>
                  <NumberInput
                    name="other_0_1_count"
                    value={value?.other_0_1_count}
                    error={error?.other_0_1_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="other_2_5_count"
                    value={value?.other_2_5_count}
                    error={error?.other_2_5_count}
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
                    name="other_18_59_count"
                    value={value?.other_18_59_count}
                    error={error?.other_18_59_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="other_60_plus_count"
                    value={value?.other_60_plus_count}
                    error={error?.other_60_plus_count}
                    onChange={setFieldValue}
                  />
                  <NumberInput
                    name="other_unknown_age_count"
                    value={value?.other_unknown_age_count}
                    error={error?.other_unknown_age_count}
                    onChange={setFieldValue}
                  />
                  <div className={styles.totalLabel}>
                    {total_other}
                  </div>
                </div>
                <div className={styles.total}>
                  <div className={styles.label}>
                    Total
                  </div>
                  <div className={styles.label}>
                    {total_0_1}
                  </div>
                  <div className={styles.label}>
                    {total_2_5}
                  </div>
                  <div className={styles.label}>
                    {total_6_12}
                  </div>
                  <div className={styles.label}>
                    {total_13_17}
                  </div>
                  <div className={styles.label}>
                    {total_18_59}
                  </div>
                  <div className={styles.label}>
                    {total_60_plus}
                  </div>
                  <div className={styles.label}>
                    {total_unknown_age}
                  </div>
                  <div className={styles.totalLabel}>
                    {total_total}
                  </div>
                </div>
              </div>
            </div>
            <Checkbox
              label="Are you able to break this down to identify those with disabilities?"
              name={"is_disaggregated_for_disabled" as const}
              value={value?.is_disaggregated_for_disabled}
              // error={error?.is_disaggregated_for_disabled}
              onChange={setFieldValue}
            />
            {value?.is_disaggregated_for_disabled && (
              <div className={styles.disabledContainer}>
                <div className={styles.title}>
                  Reporting on People with Disabilities
                </div>
                <div className={styles.genderAndAgeDisaggregation}>
                  <div className={styles.labels}>
                    <div className={styles.label}>
                      Gender/Age
                    </div>
                    <div className={styles.label}>
                      0-1
                    </div>
                    <div className={styles.label}>
                      2-5
                    </div>
                    <div className={styles.label}>
                      6-12
                    </div>
                    <div className={styles.label}>
                      13-17
                    </div>
                    <div className={styles.label}>
                      18-59
                    </div>
                    <div className={styles.label}>
                      60+
                    </div>
                    <div className={styles.label}>
                      Unknown
                    </div>
                    <div className={styles.label}>
                      Total
                    </div>
                  </div>
                  <div className={styles.male}>
                    <div className={styles.label}>
                      Male
                    </div>
                    <NumberInput
                      name="disabled_male_0_1_count"
                      value={value?.disabled_male_0_1_count}
                      error={error?.disabled_male_0_1_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_male_2_5_count"
                      value={value?.disabled_male_2_5_count}
                      error={error?.disabled_male_2_5_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_male_6_12_count"
                      value={value?.disabled_male_6_12_count}
                      error={error?.disabled_male_6_12_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_male_13_17_count"
                      value={value?.disabled_male_13_17_count}
                      error={error?.disabled_male_13_17_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_male_18_59_count"
                      value={value?.disabled_male_18_59_count}
                      error={error?.disabled_male_18_59_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_male_60_plus_count"
                      value={value?.disabled_male_60_plus_count}
                      error={error?.disabled_male_60_plus_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_male_unknown_age_count"
                      value={value?.disabled_male_unknown_age_count}
                      error={error?.disabled_male_unknown_age_count}
                      onChange={setFieldValue}
                    />
                    <div className={styles.label}>
                      {disabled_total_male}
                    </div>
                  </div>
                  <div className={styles.female}>
                    <div className={styles.label}>
                      Female
                    </div>
                    <NumberInput
                      name="disabled_female_0_1_count"
                      value={value?.disabled_female_0_1_count}
                      error={error?.disabled_female_0_1_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_female_2_5_count"
                      value={value?.disabled_female_2_5_count}
                      error={error?.disabled_female_2_5_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_female_6_12_count"
                      value={value?.disabled_female_6_12_count}
                      error={error?.disabled_female_6_12_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_female_13_17_count"
                      value={value?.disabled_female_13_17_count}
                      error={error?.disabled_female_13_17_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_female_18_59_count"
                      value={value?.disabled_female_18_59_count}
                      error={error?.disabled_female_18_59_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_female_60_plus_count"
                      value={value?.disabled_female_60_plus_count}
                      error={error?.disabled_female_60_plus_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_female_unknown_age_count"
                      value={value?.disabled_female_unknown_age_count}
                      error={error?.disabled_female_unknown_age_count}
                      onChange={setFieldValue}
                    />
                    <div className={styles.label}>
                      {disabled_total_female}
                    </div>
                  </div>
                  <div className={styles.other}>
                    <div className={styles.label}>
                      Other/Unknown
                    </div>
                    <NumberInput
                      name="disabled_other_0_1_count"
                      value={value?.disabled_other_0_1_count}
                      error={error?.disabled_other_0_1_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_other_2_5_count"
                      value={value?.disabled_other_2_5_count}
                      error={error?.disabled_other_2_5_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_other_6_12_count"
                      value={value?.disabled_other_6_12_count}
                      error={error?.disabled_other_6_12_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_other_13_17_count"
                      value={value?.disabled_other_13_17_count}
                      error={error?.disabled_other_13_17_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_other_18_59_count"
                      value={value?.disabled_other_18_59_count}
                      error={error?.disabled_other_18_59_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_other_60_plus_count"
                      value={value?.disabled_other_60_plus_count}
                      error={error?.disabled_other_60_plus_count}
                      onChange={setFieldValue}
                    />
                    <NumberInput
                      name="disabled_other_unknown_age_count"
                      value={value?.disabled_other_unknown_age_count}
                      error={error?.disabled_other_unknown_age_count}
                      onChange={setFieldValue}
                    />
                    <div className={styles.label}>
                      {disabled_total_other}
                    </div>
                  </div>
                  <div className={styles.total}>
                    <div className={styles.label}>
                      Total
                    </div>
                    <div className={styles.label}>
                      {disabled_total_0_1}
                    </div>
                    <div className={styles.label}>
                      {disabled_total_2_5}
                    </div>
                    <div className={styles.label}>
                      {disabled_total_6_12}
                    </div>
                    <div className={styles.label}>
                      {disabled_total_13_17}
                    </div>
                    <div className={styles.label}>
                      {disabled_total_18_59}
                    </div>
                    <div className={styles.label}>
                      {disabled_total_60_plus}
                    </div>
                    <div className={styles.label}>
                      {disabled_total_unknown_age}
                    </div>
                    <div className={styles.label}>
                      {disabled_total_total}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DisaggregationInputs;
