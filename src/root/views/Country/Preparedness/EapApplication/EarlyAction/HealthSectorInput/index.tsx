import React from 'react';
import languageContext from '#root/languageContext';
import {
  IoAdd,
  IoTrash,
} from 'react-icons/io5';

import InputSection from '#components/InputSection';
import NumberInput from '#components/NumberInput';
import Button from '#components/Button';
import SearchSelectInput from '#components/SearchSelectInput';
import BulletTextArea from '#components/BulletTextArea';

import styles from './styles.module.scss';

function HealthSectorInput() {
  const { strings } = React.useContext(languageContext);

  return (
    <>
      <div className={styles.healthSectorInput}>
        <InputSection
          className={styles.inputSection}
          title={strings.eapsFormHealth}
        >
        </InputSection>
        <InputSection
          className={styles.inputSection}
          title={strings.eapsFormBudgetPerSector}
        >
          <NumberInput
            name="budget"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <Button
            className={styles.removeButton}
            name={undefined}
            onClick={undefined}
            variant="action"
          >
            <IoTrash />
          </Button>
        </InputSection>
      </div>
      <div className={styles.sector}>
        <InputSection
          className={styles.indicator}
        >
          <SearchSelectInput
            label={strings.eapsFormSectorIndicator}
            name="eap_country"
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection>
          <NumberInput
            label={strings.eapsFormSectorIndicatorValue}
            name="eap_country"
            placeholder={strings.eapsFormSectorPlaceholder}
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </InputSection>
        <InputSection
          className={styles.indicator}
        >
          <Button
            name={undefined}
            onClick={undefined}
            variant="secondary"
          >
            <IoAdd />
            {strings.eapsFormSectorAddIndicator}
          </Button>
        </InputSection>
      </div>
      <InputSection
        normalDescription
        description={(
          <>
            <BulletTextArea
              className={styles.addRiskButton}
              label={strings.eapsFormPriotisedRisk}
              value={undefined}
              placeholder={strings.eapsFormListTheRisk}
              onChange={undefined}
              error={undefined}
              name={undefined}>
            </BulletTextArea>
            <Button
              name={undefined}
              onClick={undefined}
              variant="secondary"
            >
              <IoAdd />
              {strings.eapsFormAddRisk}
            </Button>
          </>
        )}
      >
        <div className={styles.targetPeople}>
          <NumberInput
            label={strings.eapsFormTargetPeople}
            name="eap_country"
            placeholder={strings.eapsFormSectorPlaceholder}
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <div className={styles.earlyActions}>
            <BulletTextArea
              label={strings.eapsFormEarlyActions}
              name="eap_country"
              placeholder={strings.eapsFormListTheEarlyAction}
              value={undefined}
              onChange={undefined}
              error={undefined}
            />
            <Button
              name={undefined}
              onClick={undefined}
              variant="secondary"
            >
              <IoAdd />
              {strings.eapsFormAddEarlyAction}
            </Button>
          </div>
          <BulletTextArea
            label={strings.eapsFormReadinessActivities}
            name="eap_country"
            placeholder={strings.eapsFormListTheReadinessActivities}
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
          <BulletTextArea
            label={strings.eapsFormPrePositioningActivities}
            name="eap_country"
            placeholder='List the pre-positioning activities (if any)'
            value={undefined}
            onChange={undefined}
            error={undefined}
          />
        </div>
      </InputSection>
    </>
  );
}

export default HealthSectorInput;