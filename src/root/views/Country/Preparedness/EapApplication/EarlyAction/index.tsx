import React from 'react';
import languageContext from '#root/languageContext';
import Container from '#components/Container';
import InputSection from '#components/InputSection';
import Button from '#components/Button';
import SearchSelectInput from '#components/SearchSelectInput';
import HealthSectorInput from './HealthSectorInput';
import { IoAdd } from 'react-icons/io5';

import styles from './styles.module.scss';

function EarlyAction() {
  const { strings } = React.useContext(languageContext);

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
              <SearchSelectInput
                name="eap_country"
                value={undefined}
                onChange={undefined}
                error={undefined}
              />
              <Button
                className={styles.earlyActionButton}
                name={undefined}
                onClick={undefined}
                variant="secondary"
              >
                <IoAdd />
                {strings.eapsFormAddButtonLabel}
              </Button>
            </InputSection>
          </div>
        </div>
        {/* {value?.planned_interventions?.map((n, i) => ( */}
        <HealthSectorInput
          // key={n.clientId}
          // index={i}
          value={undefined}
          onChange={undefined}
          onRemove={undefined}
          error={undefined}
          interventionOptions={undefined}
          showNewFieldOperational={false} />
        {/* ))} */}
      </Container>
    </>
  );
}

export default EarlyAction;
