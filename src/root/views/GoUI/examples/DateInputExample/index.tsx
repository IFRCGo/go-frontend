import React from 'react';
import Heading from '#goui/components/Heading';
import DateInput from '#goui/components/DateInput';

import styles from './styles.module.scss';

function DateInputExample() {
  const [dateInput, setDateInput] = React.useState<string | undefined>('');

  const handleDateChange = React.useCallback((val: string | undefined) => {
    setDateInput(val);
  }, [setDateInput]);

  return (
    <div className={styles.dateInput}>
      <Heading level={3}>
        DateInput
      </Heading>
      <Heading level={5}>
        Active
      </Heading>
      <DateInput
        name="date-input"
        value={dateInput}
        onChange={handleDateChange}
      />
      <Heading level={5}>
        Disabled
      </Heading>
      <DateInput
        name="date-input"
        value={dateInput}
        onChange={handleDateChange}
        disabled
      />
      <Heading level={5}>
        Errored
      </Heading>
      <DateInput
        name="date-input"
        value={dateInput}
        onChange={handleDateChange}
        error="This is test error"
        disabled
      />
    </div>
  );
}

export default DateInputExample;
