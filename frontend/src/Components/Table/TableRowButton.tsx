import React from 'react';
import Link, { LinkProps } from 'Components/Link/Link';
import useKeyboardActivation from 'Helpers/Hooks/useKeyboardActivation';
import TableRow from './TableRow';
import styles from './TableRowButton.css';

function TableRowButton({
  className = styles.row,
  onKeyDown,
  role = 'button',
  tabIndex = 0,
  ...otherProps
}: LinkProps<typeof TableRow>) {
  const handleKeyDown = useKeyboardActivation<HTMLTableRowElement>(onKeyDown);

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
