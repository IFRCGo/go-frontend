import React from 'react';
import { IoAdd } from 'react-icons/io5';
import {
  isNotDefined,
  randomString,
  isDefined,
} from '@togglecorp/fujs';

import {
  EntriesAsList,
  PartialForm,
  Error,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';

import useInputState from '#hooks/useInputState';
import languageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';

import SelectInput from '#components/SelectInput';
import EarlyActionInput from './EarlyActionInput';
import {
  EapFormFields,
  EarlyAction,
  StringValueOption,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<EapFormFields>;

interface Props {
  earlyActionIndicatorOptions: StringValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  sectorsOptions: StringValueOption[];
  value: Value;
}

function EarlyActions(props: Props) {
  const { strings } = React.useContext(languageContext);
  const [sector, setSector] = React.useState<string | undefined>();

  const {
    error: formError,
    onValueChange,
    value,
    sectorsOptions,
    earlyActionIndicatorOptions,
  } = props;

  const [selectedSector, setSelectedSector] = useInputState<string | undefined>(undefined);

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError],
  );

  const {
    setValue: onEarlyActionChange,
    removeValue: onEarlyActionRemove,
  } = useFormArray<'early_actions', PartialForm<EarlyAction>>(
    'early_actions',
    onValueChange,
  );

  type EarlyActionItem = typeof value.early_actions;
  const handleSectorsAddButtonClick = React.useCallback((selectedSector: string | undefined) => {
    if (isDefined(selectedSector)) {
      const clientId = randomString();
      const newEapItem: PartialForm<EarlyAction> = {
        clientId,
        sector: selectedSector,
      };

      onValueChange(
        (oldValue: EarlyActionItem) => (
          [...(oldValue ?? []), newEapItem]
        ),
        'early_actions' as const,
      );

      setSelectedSector(undefined);
    }
  }, [onValueChange, setSelectedSector]);

  return (
    <Container
      visibleOverflow
      heading={strings.eapsFormPrioritizedRisksAndSelectedEarlyActions}
    >
      <div className={styles.sectorContainer}>
        <div className={styles.sector}>
          <InputSection
            title={strings.eapsFormSector}
          >
            <SelectInput
              name="sector"
              value={selectedSector}
              onChange={setSelectedSector}
              // TODO: show filtered options
              // sectors that are already selected should not be shown
              options={sectorsOptions}
            />
            <Button
              className={styles.earlyActionButton}
              name={selectedSector}
              onClick={handleSectorsAddButtonClick}
              variant="secondary"
              disabled={isNotDefined(selectedSector)}
            >
              <IoAdd />
              {strings.eapsFormAddButtonLabel}
            </Button>
          </InputSection>
        </div>
      </div>
      {value?.early_actions?.map((earlyAction, index) => (
        <EarlyActionInput
          earlyActionIndicatorsOptions={earlyActionIndicatorOptions}
          error={error?.early_actions}
          index={index}
          key={earlyAction.clientId}
          onRemove={onEarlyActionRemove}
          onValueChange={onEarlyActionChange}
          value={earlyAction}
        />
      ))}
    </Container>
  );
}

export default EarlyActions;
