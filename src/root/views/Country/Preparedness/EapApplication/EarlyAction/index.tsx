import React from 'react';
import languageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';
import HealthSectorInput from './HealthSectorInput';
import { IoAdd } from 'react-icons/io5';

import styles from './styles.module.scss';
import {
  EntriesAsList,
  PartialForm,
  Error,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';
import {
  EapsFields,
  NumericValueOption,
} from '../common';
import SelectInput from '#components/SelectInput';
import { isNotDefined, randomString } from '@togglecorp/fujs';

type Value = PartialForm<EapsFields>;

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  sectorsOptions: NumericValueOption[];
}

function EarlyAction(props: Props) {
  const { strings } = React.useContext(languageContext);

  const {
    error: formError,
    onValueChange,
    value,
    sectorsOptions,
  } = props;

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const [sectors, setSectors] = React.useState<number | undefined>();
  const {
    setValue: onSectorsChange,
    removeValue: onSectorsRemove,
  } = useFormArray<'sectors', PartialForm<Sectors>>(
    'sectors',
    onValueChange,
  );

  type Sectors = typeof value.sectors;
  const handleSectorsAddButtonClick = React.useCallback((title) => {
    const key = randomString();
    const newList: PartialForm<SectorsType> = {
      key,
      value,
    };
    onValueChange(
      (oldValue: PartialForm<Sectors>) => (
        [...(oldValue ?? []), newList]
      ),
      'sectors' as const,
    );
    setSectors(undefined);
  }, [onValueChange, setSectors]);


  return (
    <>
      <Container
        heading={strings.eapsFormPrioritizedRisksAndSelectedEarlyActions}
      >
        <div className={styles.sectorContainer}>
          <div className={styles.sector}>
            <InputSection
              title={strings.eapsFormSector}
            >
              <SelectInput
                name="sectors"
                value={value?.sectors}
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
            showNewFieldOperational={false} />
        ))}
      </Container>
    </>
  );
}

export default EarlyAction;
