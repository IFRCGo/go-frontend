import React from 'react';
import {
  isNotDefined,
  randomString,
} from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
  useFormArray,
  EntriesAsList,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import TextArea from '#components/TextArea';
import BulletTextArea from '#components/BulletTextArea';
import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import InputSection from '#components/InputSection';
import LanguageContext from '#root/languageContext';

import {
  DrefFields,
  Indicator,
  Intervention,
  StringValueOption,
} from '../../common';


import styles from './styles.module.scss';
import IndicatorInput from '../IndicatorInput';
import { IndicatorType } from '#views/DrefApplicationForm/useDrefFormOptions';

type SetValueArg<T> = T | ((value: T) => T);
type Value = PartialForm<DrefFields>;

const defaultInterventionValue: PartialForm<Intervention> = {
  clientId: randomString(),
  indicators: [{
    clientId: randomString(),
    title: 'test title'
  }]
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
  const { strings } = React.useContext(LanguageContext);
  const [indicator, setIndicator] = React.useState<number | undefined>();

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    interventionOptions,
    onRemove,
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
              label="Budget"
              name="budget"
              value={value.budget}
              onChange={onFieldChange}
              error={error?.budget}
            />
            <NumberInput
              label="Persons Targeted"
              name="person_targeted"
              value={value.person_targeted}
              onChange={onFieldChange}
              error={error?.person_targeted}
            />
          </>
        )}
      >
        <div>

          <Button
            variant="secondary"
            name={indicator}
            onClick={handleIndicatorAddButtonClick}
          //disabled={isNotDefined(indicator)}
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
              />
            ))
          }
        </div>
        <BulletTextArea
          label={strings.drefFormListOfActivities}
          name="description"
          value={value.description}
          onChange={onFieldChange}
          error={error?.description}
        />
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
