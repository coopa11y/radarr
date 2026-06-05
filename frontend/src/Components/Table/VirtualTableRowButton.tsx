import React, { useCallback } from 'react';
import Link, { LinkProps } from 'Components/Link/Link';
import VirtualTableRow from './VirtualTableRow';
import styles from './VirtualTableRowButton.css';

function VirtualTableRowButton({
  className = styles.row,
  onKeyDown,
  role = 'button',
  tabIndex = 0,
  ...otherProps
}: LinkProps<typeof VirtualTableRow>) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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
      component={VirtualTableRow}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      {...otherProps}
    />
  );
}

export default VirtualTableRowButton;
