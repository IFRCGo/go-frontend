import { useState, useCallback, useMemo, createContext } from 'react';
import { listToMap, compareNumber } from '@togglecorp/fujs';

interface OrderItemParameter {
  name: string;
}

export function useOrderState(keys: OrderItemParameter[]) {
  const [ordering, setOrdering] = useState(keys);

  const moveOrderingItem = useCallback(
    (drag: string, drop: string) => {
      setOrdering((oldOrdering) => {
        const dragPosition = oldOrdering.findIndex((o) => o.name === drag);
        const dropPosition = oldOrdering.findIndex((o) => o.name === drop);
        if (dragPosition === dropPosition) {
          return oldOrdering;
        }
        if (dragPosition === -1 || dropPosition === -1) {
          console.error('Drag or drop item could not be found');
          return oldOrdering;
        }
        const dragItem = oldOrdering[dragPosition];

        const newOrdering = [...oldOrdering];
        if (dragPosition > dropPosition) {
          newOrdering.splice(dragPosition, 1);
          newOrdering.splice(dropPosition, 0, dragItem);
        } else {
          newOrdering.splice(dropPosition + 1, 0, dragItem);
          newOrdering.splice(dragPosition, 1);
        }
        return newOrdering;
      });
    },
    [],
  );

  return {
    ordering,
    moveOrderingItem,
    setOrdering,
  };
}

interface OrderContextInterface {
  ordering: OrderItemParameter[];
  setOrdering: React.Dispatch<React.SetStateAction<OrderItemParameter[]>>;
  moveOrderingItem: (drag: string, drop: string) => void;
}
const initialValue: OrderContextInterface = {
  ordering: [],
  setOrdering: (state) => {
    console.warn('Trying to set to ', state);
  },
  moveOrderingItem: (drag, drop) => {
    console.warn(`Trying to drag item ${drag} to item ${drop}`);
  },
};
export const OrderContext = createContext<OrderContextInterface>(initialValue);

interface OrderColumn {
  id: string;
}

function useOrdering<T extends OrderColumn, K extends OrderItemParameter>(
  columns: T[],
  ordering: K[],
) {
  const filteredData = useMemo(
    () => {
      const mapping = listToMap(
        ordering,
        (item) => item.name,
        (item, __, index) => ({
          ...item,
          order: index,
        }),
      );
      const sortedColumns = columns
      .filter((foo) => !!mapping[foo.id])
      .sort((foo, bar) => {
        // FIXME: this can be optimized
        const fooOrder = mapping[foo.id]?.order;
        const barOrder = mapping[bar.id]?.order;
        return compareNumber(fooOrder, barOrder);
      });
      return sortedColumns;
    },
    [ordering, columns],
  );

  return filteredData;
}

export default useOrdering;
