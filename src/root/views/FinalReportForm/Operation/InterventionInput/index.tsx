import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import BulletTextArea from '#components/BulletTextArea';
import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import InputSection from '#components/InputSection';
import LanguageContext from '#root/languageContext';
import { IndicatorType } from '#views/DrefApplicationForm/useDrefFormOptions';
import {
  Indicator,
  Intervention,
  StringValueOption,
} from '#views/FinalReportForm/common';

import IndicatorInput from '../IndicatorInput';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);

const defaultInterventionValue: PartialForm<Intervention> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<Intervention>;
  error: ArrayError<Intervention> | undefined;
  onChange: (value: SetValueArg<PartialForm<Intervention>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  interventionOptions: StringValueOption[];
}

function InterventionInput(props: Props) {
  const { strings } = useContext(LanguageContext);
  const [indicator, setIndicator] = useState<number | undefined>();

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    interventionOptions,
    onRemove,
  } = props;

  const interventionLabel = useMemo(() => (
    interventionOptions.find(n => n.value === value.title)?.label
  ), [interventionOptions, value]);

  const onFieldChange = useFormObject(index, onChange, defaultInterventionValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  const {
    setValue: onIndicatorChange,
    removeValue: onIndicatorRemove,
  } = useFormArray<'indicators', PartialForm<Indicator>>(
    'indicators',
    onFieldChange,
  );

  type Indicators = typeof value.indicators;
  const handleIndicatorAddButtonClick = useCallback(() => {
    const newIndicatorItem: PartialForm<IndicatorType> = {
      clientId: randomString(),
    };

    onFieldChange(
      (oldValue: PartialForm<Indicators>) => (
        [...(oldValue ?? []), newIndicatorItem]
      ),
      'indicators' as const,
    );
    setIndicator(undefined);
  }, [onFieldChange, setIndicator]);

  return (
    <div className={styles.interventionInput}>
      <InputSection
        className={styles.inputSection}
        title={interventionLabel}
        multiRow={false}
        twoColumn
        normalDescription
        description={(
          <>
            <NumberInput
              label={strings.drefFormInterventionBudgetLabel}
              name="budget"
              value={value.budget}
              onChange={onFieldChange}
              error={error?.budget}
            />
            <NumberInput
              label={strings.drefFormInterventionPersonTargetedLabel}
              name="person_targeted"
              value={value.person_targeted}
              onChange={onFieldChange}
              error={error?.person_targeted}
            />
            <div className={styles.maleFemale} >
              <NumberInput
                label={strings.drefOperationalUpdateIndicatorMaleLabel}
                name='male'
                value={value.male}
                onChange={onFieldChange}
                error={error?.male}
              />
              <NumberInput
                label={strings.drefOperationalUpdateIndicatorFemaleLabel}
                name='female'
                value={value.female}
                onChange={onFieldChange}
                error={error?.female}
              />
            </div>
          </>
        )}
      >
        <div className={styles.addIndicatorContainer}>
          <BulletTextArea
            label={strings.finalReportPlannedInterventionLessonsLearnt}
            name="lessons_learnt"
            value={value.lessons_learnt}
            onChange={onFieldChange}
            error={error?.lessons_learnt}
          />
          <BulletTextArea
            label={strings.finalReportPlannedInterventionNarrativeAchievement}
            name='narrative_description_of_achievements'
            value={value.narrative_description_of_achievements}
            onChange={onFieldChange}
            error={error?.narrative_description_of_achievements}
          />
        </div>
        <div className={styles.addIndicatorContainer}>
          <BulletTextArea
            label={strings.finalReportPlannedInterventionChallenges}
            name='challenges'
            value={value.challenges}
            onChange={onFieldChange}
            error={error?.challenges}
          />
          <div>
            <Button
              variant="secondary"
              name={indicator}
              onClick={handleIndicatorAddButtonClick}
            >
              Add Indicator
            </Button>
            {
              value?.indicators?.map((i, index) => (
                <IndicatorInput
                  key={i.clientId}
                  index={index}
                  value={i}
                  onChange={onIndicatorChange}
                  onRemove={onIndicatorRemove}
                  error={getErrorObject(error?.indicators)}
                />
              ))
            }
          </div>
        </div>
      </InputSection>
      <Button
        className={styles.removeButton}
        name={index}
        onClick={onRemove}
        variant="action"
      >
        <IoTrash />
      </Button>
    </div>
  );
}

export default InterventionInput;
