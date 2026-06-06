import React from 'react';
import Link, { LinkProps } from 'Components/Link/Link';
import useKeyboardActivation from 'Helpers/Hooks/useKeyboardActivation';
import VirtualTableRow from './VirtualTableRow';
import styles from './VirtualTableRowButton.css';

function VirtualTableRowButton({
  className = styles.row,
  onKeyDown,
  role = 'button',
  tabIndex = 0,
  ...otherProps
}: LinkProps<typeof VirtualTableRow>) {
  const handleKeyDown = useKeyboardActivation<HTMLDivElement>(onKeyDown);

  return (
    <Link
      className={className}
      component={VirtualTableRow}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      {...otherProps}
    />
  );
}

export default VirtualTableRowButton;
