import React, { useContext } from 'react';
import ModalContext from './ModalContext';
import styles from './ModalHeader.css';

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function ModalHeader({ children, id, ...otherProps }: ModalHeaderProps) {
  const { titleId } = useContext(ModalContext);

  return (
    <div className={styles.modalHeader} id={id ?? titleId} {...otherProps}>
      {children}
    </div>
  );
}

export default ModalHeader;
