import React, { ReactNode } from 'react';
import Link, { LinkProps } from 'Components/Link/Link';
import useKeyboardActivation from 'Helpers/Hooks/useKeyboardActivation';
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
  const handleKeyDown = useKeyboardActivation<HTMLTableCellElement>(onKeyDown);

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
