import React from 'react';
import { IoAdd } from 'react-icons/io5';
import { isNotDefined, randomString } from '@togglecorp/fujs';

import {
  EntriesAsList,
  PartialForm,
  Error,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';

import languageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';

import SelectInput from '#components/SelectInput';
import HealthSectorInput from './HealthSectorInput';
import {
  EapsFields,
  Sectors,
  StringValueOption,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<EapsFields>;
type SetValueArg<T> = T | ((value: T) => T);

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  sectorsOptions: StringValueOption[];
  earlyActionIndicatorOptions: StringValueOption[];
}

function EarlyAction(props: Props) {
  const { strings } = React.useContext(languageContext);
  const [sectors, setSectors] = React.useState<number | undefined>();

  const {
    error: formError,
    onValueChange,
    value,
    sectorsOptions,
    earlyActionIndicatorOptions,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const {
    setValue: onSectorsChange,
    removeValue: onSectorsRemove,
  } = useFormArray<'sectors', PartialForm<Sectors>>(
    'sectors',
    onValueChange,
  );

  type SectorsIteam = typeof value.sectors;
  const handleSectorsAddButtonClick = React.useCallback(() => {
    const clientId = randomString();
    const newList: PartialForm<Sectors> = {
      clientId,
    };
    onValueChange(
      (oldValue: PartialForm<SectorsIteam>) => (
        [...(oldValue ?? []), newList]
      ),
      'sectors' as const,
    );
    setSectors(undefined);
  }, [onValueChange, setSectors]);

  return (
    <>
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
                name="sectors"
                value={value.sectors}
                onChange={setSectors}
                error={error?.sectors}
                options={sectorsOptions}
              />
              <Button
                className={styles.earlyActionButton}
                name={sectors}
                onClick={handleSectorsAddButtonClick}
                variant="secondary"
                disabled={isNotDefined(sectors)}
              >
                <IoAdd />
                {strings.eapsFormAddButtonLabel}
              </Button>
            </InputSection>
          </div>
        </div>
        {value?.sectors?.map((n, i) => (
          <HealthSectorInput
            key={n}
            index={i}
            value={n}
            onChange={onSectorsChange}
            onRemove={onSectorsRemove}
            error={error?.sectors}
            sectorsOptions={sectorsOptions}
            earlyActionIndicatorsOptions={earlyActionIndicatorOptions}
            showNewFieldOperational={false} />
        ))}
      </Container>
    </>
  );
}

export default EarlyAction;
