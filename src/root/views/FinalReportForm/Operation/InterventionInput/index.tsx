import React from 'react';
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
} from '../../common';
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
  showNewFieldOperational: boolean;
}

function InterventionInput(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const [indicator, setIndicator] = React.useState<number | undefined>();

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    interventionOptions,
    onRemove,
    showNewFieldOperational,
  } = props;

  const interventionLabel = React.useMemo(() => (
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
  const handleIndicatorAddButtonClick = React.useCallback((title, target) => {
    const clientId = randomString();
    const newList: PartialForm<IndicatorType> = {
      clientId,
      title,
      target,
    };

    onFieldChange(
      (oldValue: PartialForm<Indicators>) => (
        [...(oldValue ?? []), newList]
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
              value?.indicators?.map((n, i) => (
                <IndicatorInput
                  key={n.clientId}
                  index={i}
                  value={n}
                  onChange={onIndicatorChange}
                  onRemove={onIndicatorRemove}
                  error={getErrorObject(error?.indicators)}
                  showNewFieldOperational={showNewFieldOperational}
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
