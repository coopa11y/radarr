import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import useKeyboardActivation from 'Helpers/Hooks/useKeyboardActivation';
import { icons, sortDirections } from 'Helpers/Props';
import { SortDirection } from 'Helpers/Props/sortDirections';
import styles from './VirtualTableHeaderCell.css';

interface VirtualTableHeaderCellProps {
  className?: string;
  name: string;
  columnLabel?: string | (() => string);
  isSortable?: boolean;
  sortKey?: string;
  fixedSortDirection?: SortDirection;
  sortDirection?: string;
  children?: React.ReactNode;
  onSortPress?: (name: string, sortDirection?: SortDirection) => void;
  'aria-label'?: string;
}

function getTextValue(value: VirtualTableHeaderCellProps['columnLabel']) {
  if (typeof value === 'function') {
    return value();
  }

  return value;
}

function getSortLabel(
  column: string | undefined,
  ariaSort: 'ascending' | 'descending' | 'none'
) {
  if (!column) {
    return undefined;
  }

  if (ariaSort === 'none') {
    return `Sort by ${column}`;
  }

  return `Sort by ${column}. Current sort ${ariaSort}.`;
}

function VirtualTableHeaderCell({
  className = styles.headerCell,
  name,
  columnLabel,
  isSortable = false,
  sortKey,
  sortDirection,
  fixedSortDirection,
  children,
  onSortPress,
  'aria-label': ariaLabel,
  ...otherProps
}: VirtualTableHeaderCellProps) {
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

  const handleKeyDown = useKeyboardActivation<HTMLDivElement>();
  const columnLabelText =
    getTextValue(columnLabel) ??
    (typeof children === 'string' ? children : undefined) ??
    name;
  const sortLabel = ariaLabel ?? getSortLabel(columnLabelText, ariaSort);

  return isSortable ? (
    <Link
      component="div"
      className={className}
      role="columnheader"
      tabIndex={0}
      aria-sort={ariaSort}
      aria-label={sortLabel}
      title={columnLabelText}
      onKeyDown={handleKeyDown}
      onPress={handlePress}
      {...otherProps}
    >
      {children}

      {isSorting ? <Icon name={sortIcon} className={styles.sortIcon} /> : null}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export default VirtualTableHeaderCell;
