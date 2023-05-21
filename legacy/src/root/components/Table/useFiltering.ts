import { useMemo, useState, useCallback, createContext } from 'react';
import { caseInsensitiveSubmatch, isNotDefined, isFalsyString, listToMap } from '@togglecorp/fujs';

export interface FilterParameter {
  id: string;

  subMatch?: string;

  greaterThanOrEqualTo?: number;
  lessThanOrEqualTo?: number;
}

export function useFilterState(defaultValue?: FilterParameter[]) {
  const [filtering, setFiltering] = useState<FilterParameter[] | undefined>(defaultValue);
  const setFilteringItem = useCallback(
    (id: string, value: Omit<FilterParameter, 'id'> | undefined) => {
      setFiltering((oldFiltering = []) => {
        const index = oldFiltering.findIndex((item) => item.id === id);
        if (isNotDefined(value)) {
          const newFiltering = [...oldFiltering];
          if (index === -1) {
            console.error('There is some error');
          } else {
            newFiltering.splice(index, 1);
          }
          return newFiltering;
        }

        const newValue = {
          ...value,
          id,
        };
        const newFiltering = [...oldFiltering];

        if (index === -1) {
          newFiltering.push(newValue);
        } else {
          newFiltering.splice(index, 1, newValue);
        }
        return newFiltering;
      });
    },
    [],
  );
  const getFilteringItem = useCallback(
    (id: string) => {
      if (!filtering) {
        return undefined;
      }
      return filtering.find((item) => item.id === id);
    },
    [filtering],
  );
  return { filtering, setFiltering, setFilteringItem, getFilteringItem };
}

interface FilterContextInterface {
  filtering: FilterParameter[] | undefined;
  setFiltering: React.Dispatch<React.SetStateAction<FilterParameter[] | undefined>>;
  setFilteringItem: (id: string, value: Omit<FilterParameter, 'id'>) => void;
  getFilteringItem: (id: string) => FilterParameter | undefined;
}
const initialValue: FilterContextInterface = {
  filtering: undefined,
  setFiltering: (state) => {
    console.warn('Trying to set to ', state);
  },
  setFilteringItem: (id, state) => {
    console.warn(`Trying to set ${id} to `, state);
  },
  getFilteringItem: (id) => {
    // console.warn(`Trying to get ${id}`);
    return undefined;
  },
};
export const FilterContext = createContext<FilterContextInterface>(initialValue);

interface FilterColumn<T> {
  id: string;
  valueSelector?: (foo: T) => string | number | boolean | undefined | null;
}

export function useFiltering<T>(
  filterParameters: FilterParameter[] | undefined,
  columns: FilterColumn<T>[],
  data: T[] | undefined,
) {
  const filteredData = useMemo(
    () => {
      if (!filterParameters || filterParameters.length <= 0) {
        return data;
      }
      const columnsMapping = listToMap(
        columns,
        (column) => column.id,
        (column) => column,
      );
      return data?.filter((datum) => (
        filterParameters.every((filterParameter) => {
          let test = true;

          const {
            id,
            subMatch,

            greaterThanOrEqualTo,
            lessThanOrEqualTo,
          } = filterParameter;

          // Identify if filtering is applied
          if (
            isNotDefined(greaterThanOrEqualTo)
          && isNotDefined(lessThanOrEqualTo)
          && isNotDefined(subMatch)
          ) {
            return true;
          }

          // Filter out if we dont't have a column.valueSelector
          const column = columnsMapping[id];
          if (!column?.valueSelector) {
            return false;
          }

          // Filter out if value is undefined
          const val = column.valueSelector(datum);
          if (isNotDefined(val)) {
            return false;
          }

          if (typeof val === 'string') {
            test = isFalsyString(subMatch) || caseInsensitiveSubmatch(val, subMatch);
          } else {
            test = (
              (isNotDefined(greaterThanOrEqualTo) || val >= greaterThanOrEqualTo)
              && (isNotDefined(lessThanOrEqualTo) || val <= lessThanOrEqualTo)
            );
          }
          return test;
        })
      ));
    },
    [columns, data, filterParameters],
  );
  return filteredData;
}

export default useFiltering;
