import React, { useState } from "react";
import MultiSelectInput from "#goui/components/MultiSelectInput";
import Heading from "#goui/components/Heading";

import styles from './styles.module.scss';

interface Option {
  label: string;
  value: number;
}

const randomOptions: Option[] = [
  {
    label: 'Option 1',
    value: 10,
  },
  {
    label: 'Option 2',
    value: 20,
  },
  {
    label: 'Option 3',
    value: 30,
  },
  {
    label: 'Option 4',
    value: 40,
  },
  {
    label: 'Option 5',
    value: 50,
  },
  {
    label: 'Option 6',
    value: 60,
  },
];

const keySelector = (d: Option) => d.value;

function MultiSelectInputExample() {
  const [selectedOption, setSelectedOption] = useState<number[] | null | undefined>(null);

  return (
    <div className={styles.multiSelectExample}>
      <Heading>MultiSelect Input</Heading>
      <MultiSelectInput
        label="Basic MultiSelect"
        name="Country"
        options={randomOptions}
        keySelector={keySelector}
        value={selectedOption}
        onChange={setSelectedOption}
      />
      <MultiSelectInput
        label="MultiSelect input that is clearable"
        name="country"
        options={randomOptions}
        value={selectedOption}
        keySelector={keySelector}
        onChange={setSelectedOption}
        isClearable
      />
      <MultiSelectInput
        label="MultiSelect input that is searchable"
        name="country"
        options={randomOptions}
        value={selectedOption}
        keySelector={keySelector}
        onChange={setSelectedOption}
        isSearchable
      />
      <MultiSelectInput
        label="MultiSelect input that is required"
        name="country"
        options={randomOptions}
        value={selectedOption}
        keySelector={keySelector}
        onChange={setSelectedOption}
        required
      />
      <MultiSelectInput
        label="MultiSelect input that is disabled"
        name="country"
        options={randomOptions}
        value={selectedOption}
        keySelector={keySelector}
        onChange={setSelectedOption}
        disabled
      />
      <MultiSelectInput
        label="MultiSelect input that is read only"
        name="country"
        options={randomOptions}
        value={selectedOption}
        keySelector={keySelector}
        onChange={setSelectedOption}
        readOnly
      />
    </div>
  );
}
export default MultiSelectInputExample;
