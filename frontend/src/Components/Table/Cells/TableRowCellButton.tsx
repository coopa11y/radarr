import React, { ReactNode, useCallback } from 'react';
import Link, { LinkProps } from 'Components/Link/Link';
import TableRowCell from './TableRowCell';
import styles from './TableRowCellButton.css';

interface TableRowCellButtonProps extends LinkProps<typeof TableRowCell> {
  className?: string;
  children: ReactNode;
}

function TableRowCellButton(props: TableRowCellButtonProps) {
  const {
    className = styles.cell,
    onKeyDown,
    role = 'button',
    tabIndex = 0,
    ...otherProps
  } = props;
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableCellElement>) => {
      onKeyDown?.(event);

      if (
        !event.defaultPrevented &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        event.currentTarget.click();
      }
    },
    [onKeyDown]
  );

  return (
    <Link
      className={className}
      component={TableRowCell}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      {...otherProps}
    />
  );
}

export default TableRowCellButton;
