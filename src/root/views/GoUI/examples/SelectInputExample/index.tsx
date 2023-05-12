import React, { useState, useCallback, useRef, useMemo } from "react";
import SelectInput from "#goui/components/SelectInput";
import Heading from "#goui/components/Heading";
import useInputState from '#goui/hooks/useInputState';
import { NumericValueOption } from '#types';

import styles from './styles.module.scss';
import SearchSelectInput from "#components/SearchSelectInput";

const randomOptions = [
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
];

const searchOptions = [
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
];

type FRCallback = (options: NumericValueOption[]) => void;

function SelectInputExample() {
  const [options, setOptions] = useState([]);
  const [multiOptions, setMultiOptions] = useState([]);
  const [searchResults, setSearchResults] = useState<string | undefined>();
  const [searchData, setSearchData] = useInputState<number | undefined>(23);

  const searchResultCallback = useRef<FRCallback>();

  const handleOptionsChange = useCallback((val) => {
    setOptions(val);
  }, [setOptions]);

  const initialOptions = useMemo(() => {
    const optionList = searchOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    }));

    return optionList;
  }, []);

  const handleMultiOptions = useCallback((val) => {
    setMultiOptions(val);
  }, [setMultiOptions]);

  const handleSearchLoad = useCallback((
    input: string | undefined,
    callback: FRCallback,
  ) => {
    if (!input) {
      return setSearchResults('Some result');
    }

    setSearchResults(input);
    searchResultCallback.current = callback;
  }, [
    setSearchResults,
  ]);

  return (
    <div className={styles.selectExample}>
      <Heading>Single Select Input</Heading>
      <SelectInput
        className={styles.selectBox}
        label="Basic Single Select"
        name={"country" as const}
        options={randomOptions}
        value={options}
        onChange={handleOptionsChange}
        placeholder="Select options wisely"
      />
      <SelectInput
        className={styles.selectBox}
        label="Single Select input that can be cleared"
        name={"country" as const}
        options={randomOptions}
        value={options}
        onChange={handleOptionsChange}
        placeholder="Select options wisely"
        isClearable
      />

      <Heading>Multi Select Input</Heading>
      <SelectInput
        className={styles.selectBox}
        label="Basic Multi Select"
        name={"country" as const}
        options={randomOptions}
        value={multiOptions}
        onChange={handleMultiOptions}
        placeholder="Select options wisely"
        isMulti
      />

      <Heading>Search Select Input</Heading>
      <SearchSelectInput
        className={styles.selectBox}
        label="Search your options"
        name={undefined}
        value={searchData}
        onChange={setSearchData}
        loadOptions={handleSearchLoad}
        initialOptions={initialOptions}
        isClearable
      />
    </div>
  );
}
export default SelectInputExample;