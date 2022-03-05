import React from 'react';
import {
  isDefined,
  listToMap,
  randomString,
  _cs,
} from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormArray,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoAdd } from 'react-icons/io5';

import Button from '#components/Button';
import Container from '#components/Container';
import Checklist from '#components/Checklist';
import { NumericValueOption } from '#types';
import { SetValueArg } from '#utils/common';
import {
  Sector,
  Activity,
  CustomActivity,
} from '../useEmergencyThreeWOptions';

import ActivityInput from './ActivityInput';
import CustomActivityInput from './CustomActivityInput';
import styles from './styles.module.scss';

type Value = PartialForm<Sector>;

interface Props {
  className?: string;
  sectorTitle: string;
  actionOptions: NumericValueOption[];
  supplyOptionListByActivity: Record<number, NumericValueOption[]>;
  onChange: (value: SetValueArg<Value>, index: number) => void;
  index: number;
  value: Value;
  error: ArrayError<Sector> | undefined;
}

function SectorInput(props: Props) {
  const {
    sectorTitle,
    className,
    error: errorFromProps,
    onChange,
    value,
    index,
    actionOptions,
    supplyOptionListByActivity,
  } = props;

  const defaultValue = React.useMemo(
    () => ({ sector: value?.sector }),
    [value?.sector],
  );

  const actionLabelMap = React.useMemo(() => (
    listToMap(actionOptions, d => d.value, d => d.label)
  ), [actionOptions]);

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const error = (value && value.sector && errorFromProps)
    ? getErrorObject(errorFromProps[value.sector])
    : undefined;

  const activityValue = value?.activities?.map(d => d.action).filter(isDefined);
  const handleActivityListChange = React.useCallback((newActivityList: number[] | undefined) => {
    setFieldValue((oldValue: PartialForm<Activity>[] | undefined) => {
      const activityMap = listToMap(
        oldValue,
        d => d.action as number,
        d => d,
      );

      const newValue = newActivityList?.map((a) => (
        activityMap?.[a] ?? {
          action: a,
          simplified: true,
          people_households: 'people' as const,
        }
      ));

      return newValue;
    }, 'activities');
  }, [setFieldValue]);

  const { setValue: setActivity } = useFormArray<'activities', PartialForm<Activity>>(
    'activities',
    setFieldValue,
  );

  const {
    setValue: setCustomActivity,
    removeValue: removeCustomActivity,
  } = useFormArray<'custom_activities', PartialForm<CustomActivity>>(
    'custom_activities',
    setFieldValue,
  );

  const handleAddCustomActivity = React.useCallback(() => {
    const client_id = randomString();
    const newCustomActivity : PartialForm<CustomActivity> = {
      client_id,
      simplified: true,
      people_households: 'people',
    };

    setFieldValue(
      (oldValue: PartialForm<CustomActivity>[] | undefined) => {
        if (oldValue) {
          return [
            ...oldValue,
            newCustomActivity,
          ];
        }

        return [newCustomActivity];
      },
      'custom_activities'
    );
  }, [setFieldValue]);

  return (
    <Container
      className={_cs(styles.sectorInput, className)}
      contentClassName={styles.content}
      heading={sectorTitle}
      sub
    >
      <Checklist
        className={styles.activityList}
        onChange={handleActivityListChange}
        checkboxListContainerClassName={styles.listContainer}
        checkboxClassName={styles.checkbox}
        value={activityValue}
        name={undefined}
        options={actionOptions}
        keySelector={d => d.value}
        labelSelector={d => d.label}
      />
      <div className={styles.actions}>
        <Button
          name={undefined}
          onClick={handleAddCustomActivity}
          variant="secondary"
          icons={<IoAdd />}
        >
          Add custom activity
        </Button>
      </div>
      {value && value.activities && value.activities.length > 0 && (
        <div className={styles.activityList}>
          {value?.activities?.map((a, i) => {
            if (isDefined(a.action)) {
              return (
                <ActivityInput
                  actionTitle={actionLabelMap[a.action]}
                  key={a.action}
                  index={i}
                  onChange={setActivity}
                  value={a}
                  error={getErrorObject(error?.activities)}
                  supplyOptionList={supplyOptionListByActivity[a.action]}
                />
              );
            }
            return null;
          })}
        </div>
      )}
      {value && value.custom_activities && value.custom_activities.length > 0 && (
        <div className={styles.customActivityList}>
          {value?.custom_activities?.map((a, i) => {
            if (isDefined(a.client_id)) {
              return (
                <CustomActivityInput
                  key={a.client_id}
                  index={i}
                  onChange={setCustomActivity}
                  value={a}
                  error={getErrorObject(error?.custom_activities)}
                  onRemove={removeCustomActivity}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </Container>
  );
}

export default SectorInput;
