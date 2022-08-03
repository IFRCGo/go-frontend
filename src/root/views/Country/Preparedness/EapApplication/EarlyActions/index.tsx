import React from 'react';
import { IoAdd } from 'react-icons/io5';
import {
  isNotDefined,
  randomString,
  isDefined,
  listToMap,
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
import ListView from '#components/ListView';
import SelectInput from '#components/SelectInput';

import {
  EapFormFields,
  StringValueOption,
  EarlyAction,
} from '../common';
import EarlyActionInput, { Props as EarlyActionInputProps } from './EarlyActionInput';

import styles from './styles.module.scss';

type Value = PartialForm<EapFormFields>;

type EarlyActionValue = PartialForm<EarlyAction>;

function earlyActionKeySelector(value: EarlyActionValue){
  return value.clientId as string;
}
interface Props {
  earlyActionIndicatorOptions: StringValueOption[];
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  sectorsOptions: StringValueOption[];
  value: Value;
}

function EarlyActions(props: Props) {
  const { strings } = React.useContext(languageContext);
  const [selectedSector, setSelectedSector] = useInputState<string | undefined>(undefined);

  const {
    error: formError,
    onValueChange,
    value,
    sectorsOptions,
    earlyActionIndicatorOptions,
  } = props;

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
      const newEapItem: PartialForm<EarlyAction> = {
        clientId: randomString(),
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

  const earlyActionRendererParams: (
    key: string, datum: EarlyActionValue, index: number
  ) => EarlyActionInputProps = (key, datum, index) => ({
    value: datum,
    onValueChange: onEarlyActionChange,
    index,
    error: undefined,
    onRemove: onEarlyActionRemove,
    earlyActionIndicatorsOptions: earlyActionIndicatorOptions,
  });

  const sectorOptionMap = React.useMemo(() => (
    listToMap(
      sectorsOptions,
      d => d.value ?? '',
      d => true,
    )
  ), [sectorsOptions]);

  const filteredSectorOptions = sectorOptionMap ? sectorsOptions.filter(n => sectorOptionMap[n.value]) : [];

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
              options={filteredSectorOptions}
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
      <ListView
        data={value?.early_actions}
        renderer={EarlyActionInput}
        keySelector={earlyActionKeySelector}
        rendererParams={earlyActionRendererParams}
        errored={!!error}
        pending={false}
        emptyMessage={false}
        pendingMessage="Loading data"
      />
    </Container>
  );
}

export default EarlyActions;
