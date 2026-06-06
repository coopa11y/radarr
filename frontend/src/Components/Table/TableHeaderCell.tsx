import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import useKeyboardActivation from 'Helpers/Hooks/useKeyboardActivation';
import { icons, sortDirections } from 'Helpers/Props';
import { SortDirection } from 'Helpers/Props/sortDirections';
import styles from './TableHeaderCell.css';

interface TableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  className?: string;
  name: string;
  label?: string | (() => string) | React.ReactNode;
  columnLabel?: string | (() => string);
  isSortable?: boolean;
  isVisible?: boolean;
  isModifiable?: boolean;
  sortKey?: string;
  fixedSortDirection?: SortDirection;
  sortDirection?: string;
  children?: React.ReactNode;
  onSortPress?: (name: string, sortDirection?: SortDirection) => void;
}

function TableHeaderCell({
  className = styles.headerCell,
  name,
  label,
  columnLabel,
  isSortable = false,
  isVisible,
  isModifiable,
  sortKey,
  sortDirection,
  fixedSortDirection,
  children,
  onSortPress,
  ...otherProps
}: TableHeaderCellProps) {
  const isSorting = isSortable && sortKey === name;
  const sortIcon =
    sortDirection === sortDirections.ASCENDING
      ? icons.SORT_ASCENDING
      : icons.SORT_DESCENDING;
  let ariaSort: 'ascending' | 'descending' | 'none' = 'none';

  if (isSorting) {
    ariaSort =
      sortDirection === sortDirections.ASCENDING ? 'ascending' : 'descending';
  }

  const handlePress = useCallback(() => {
    if (fixedSortDirection) {
      onSortPress?.(name, fixedSortDirection);
    } else {
      onSortPress?.(name);
    }
  }, [name, fixedSortDirection, onSortPress]);

  const handleKeyDown = useKeyboardActivation<HTMLTableHeaderCellElement>();

  return isSortable ? (
    <Link
      {...otherProps}
      component="th"
      className={className}
      tabIndex={0}
      aria-sort={ariaSort}
      // label={typeof label === 'function' ? label() : label}
      title={typeof columnLabel === 'function' ? columnLabel() : columnLabel}
      onKeyDown={handleKeyDown}
      onPress={handlePress}
    >
      {children}

      {isSorting && <Icon name={sortIcon} className={styles.sortIcon} />}
    </Link>
  ) : (
    <th className={className}>{children}</th>
  );
}

export default TableHeaderCell;
