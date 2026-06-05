import React, { useCallback } from 'react';
import Link, { LinkProps } from 'Components/Link/Link';
import TableRow from './TableRow';
import styles from './TableRowButton.css';

function TableRowButton({
  className = styles.row,
  onKeyDown,
  role = 'button',
  tabIndex = 0,
  ...otherProps
}: LinkProps<typeof TableRow>) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>) => {
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
      component={TableRow}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      {...otherProps}
    />
  );
}

export default TableRowButton;
