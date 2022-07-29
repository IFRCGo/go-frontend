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
  EarlyAction,
  Sectors,
  StringValueOption,
} from '../common';

import styles from './styles.module.scss';

type Value = PartialForm<EarlyAction>;

interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  sectorsOptions: StringValueOption[];
  earlyActionIndicatorOptions: StringValueOption[];
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

  const error = React.useMemo(
    () => getErrorObject(formError),
    [formError]
  );

  const {
    setValue: onSectorsChange,
    removeValue: onSectorsRemove,
  } = useFormArray<'sector', PartialForm<Sectors>>(
    'sector',
    onValueChange,
  );

  type SectorItem = typeof value.sector;

  const handleSectorsAddButtonClick = React.useCallback(() => {
    const clientId = randomString();
    const newList: PartialForm<Sectors> = {
      clientId,
    };
    onValueChange(
      (oldValue: PartialForm<SectorItem>) => (
        [...(oldValue ?? []), newList]
      ),
      'sector' as const,
    );
  }, [onValueChange]);

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
                name="sector"
                value={value.sector}
                onChange={setSector}
                error={error?.sector}
                options={sectorsOptions}
              />
              <Button
                className={styles.earlyActionButton}
                name={sector}
                onClick={handleSectorsAddButtonClick}
                variant="secondary"
                disabled={isNotDefined(sector)}
              >
                <IoAdd />
                {strings.eapsFormAddButtonLabel}
              </Button>
            </InputSection>
          </div>
        </div>
        {value?.sector?.map((n, i) => (
          <HealthSectorInput
            key={n}
            index={i}
            value={n}
            onValueChange={onSectorsChange}
            onRemove={onSectorsRemove}
            error={error?.sector}
            sectorsOptions={sectorsOptions}
            earlyActionIndicatorsOptions={earlyActionIndicatorOptions}
            showNewFieldOperational={false} />
        ))}
      </Container>
    </>
  );
}

export default EarlyActions;
