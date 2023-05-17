import React, {
  memo,
  useCallback,
  useState,
  useRef,
  useContext,
} from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  FaSortUp,
  FaSortDown,
  FaSort,
  FaSearch,
  FaGripVertical,
} from 'react-icons/fa';

import { IoMdEyeOff } from 'react-icons/io';

import Button from '#components/Button';
import TextInput from '#components/TextInput';

import { BaseHeader, SortDirection, FilterType } from '../types';
import { SortContext } from '../useSorting';
import { FilterContext } from '../useFiltering';
import { OrderContext } from '../useOrdering';
import { HideContext } from '../useHiding';

import useDropHandler from '#hooks/useDropHandler';

import styles from './styles.module.scss';

export interface HeaderCellProps extends BaseHeader {
  sortable?: boolean;
  defaultSortDirection?: SortDirection;
  filterType?: FilterType;
  orderable?: boolean;
  hideable?: boolean;
}

interface DropInfo {
  name: string;
  index: number;
}

let tempDropInfo: DropInfo | undefined;

function HeaderCell(props: HeaderCellProps) {
  const {
    className,
    titleClassName,
    titleContainerClassName,
    title,
    name,
    index,

    sortable,
    defaultSortDirection = SortDirection.asc,
    filterType,
    orderable,
    hideable,
  } = props;

  const {
    setHidden: onHide,
  } = useContext(HideContext);

  const {
    moveOrderingItem: onReorder,
  } = useContext(OrderContext);

  const {
    setFilteringItem: onFilterValueChange,
    getFilteringItem,
  } = useContext(FilterContext);

  const filterValue = getFilteringItem(name);

  const {
    sorting,
    setSorting: onSortChange,
  } = useContext(SortContext);

  const sortDirection = sorting?.name === name
    ? sorting.direction
    : undefined;

    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const [dropInfo, setDropInfo] = useState<DropInfo | undefined>();

    const handleHideClick = useCallback(
      () => {
        if (onHide) {
          onHide(name);
        }
      },
      [onHide, name],
    );

    const handleSortClick = useCallback(
      () => {
        if (!onSortChange) {
          return;
        }
        let newSortDirection: SortDirection | undefined;
        if (!sortDirection) {
          newSortDirection = defaultSortDirection;
        } else if (sortDirection === SortDirection.asc) {
          newSortDirection = SortDirection.dsc;
        } else if (sortDirection === SortDirection.dsc) {
          newSortDirection = SortDirection.asc;
        }

        if (newSortDirection) {
          onSortChange({ name, direction: newSortDirection });
        } else {
          onSortChange(undefined);
        }
      },
      [name, onSortChange, sortDirection, defaultSortDirection],
    );

    const handleStringFilterChange = useCallback(
      (value: string | undefined) => {
        if (onFilterValueChange) {
          onFilterValueChange(
            name,
            { ...filterValue, subMatch: value },
          );
        }
      },
      [name, filterValue, onFilterValueChange],
    );

    const handleDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        setDragging(true);

        if (containerRef.current) {
          const size = containerRef.current.getBoundingClientRect();
          e.dataTransfer.setDragImage(containerRef.current, size.width, 0);
        }
        const content: DropInfo = {
          name,
          index,
        };
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(content));

        tempDropInfo = content;
      },
      [index, name],
    );
    const handleDragEnd = useCallback(
      () => {
        setDragging(false);

        tempDropInfo = undefined;
      },
      [],
    );

    const handleDragEnter = useCallback(
      () => {
        // NOTE: this is a hack as we event.dataTransfer.getData() doesn't work
        setDropInfo(tempDropInfo);
      },
      [],
    );

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (!onReorder) {
          return;
        }

        try {
          const data = e.dataTransfer.getData('text/plain');
          const parsedData = JSON.parse(data) as DropInfo;

          if (parsedData.name) {
            onReorder(parsedData.name, name);
          }
        } catch (ex) {
          console.error(ex);
        }
      },
      [name, onReorder],
    );

    const {
      dropping,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
    } = useDropHandler(handleDrop, handleDragEnter);

    return (
      <div
        ref={containerRef}
        className={_cs(
          className,
          styles.headerCell,
          dragging && styles.dragging,
          (!dragging && dropping) && (
            dropInfo && index > dropInfo.index
              ? styles.droppingBehind
              : styles.dropping
          ),
        )}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className={_cs(titleContainerClassName, styles.titleContainer)}
        >
          {sortable && (
            <Button
              name="header-cell-sort"
              onClick={handleSortClick}
              title="Sort column"
              // uiMode={uiMode}
              variant="action"
            >
              {!sortDirection && <FaSort />}
              {sortDirection === SortDirection.asc && <FaSortUp />}
              {sortDirection === SortDirection.dsc && <FaSortDown />}
            </Button>
          )}
          <div
            className={_cs(titleClassName, styles.title)}
          >
            {title}
          </div>
          {hideable && (
            <Button
              name="header cell hide"
              className={styles.hideButton}
              onClick={handleHideClick}
              title="Hide column"
              // uiMode={uiMode}
              variant="action"
            >
              <IoMdEyeOff />
            </Button>
          )}
          {orderable && (
            <div
              className={styles.grip}
              role="presentation"
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <FaGripVertical />
            </div>
          )}
        </div>
        { filterType && (
          <div className={styles.filterContainer}>
            {filterType === FilterType.string && (
              <TextInput
                name="textFilter"
                icons={<FaSearch className={styles.icon} />}
                className={styles.textInput}
                value={filterValue?.subMatch}
                placeholder="Search"
                onChange={handleStringFilterChange}
              />
            )}
          </div>
        )}
      </div>
    );
}

export default memo(HeaderCell);
