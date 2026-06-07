import React, { useId } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import ModalContext from './ModalContext';
import styles from './ModalContent.css';

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  onModalClose: () => void;
}

function ModalContent({
  className = styles.modalContent,
  children,
  showCloseButton = true,
  onModalClose,
  role = 'dialog',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-modal': ariaModal = true,
  ...otherProps
}: ModalContentProps) {
  const titleId = useId();
  const modalLabelledBy = ariaLabelledBy ?? (ariaLabel ? undefined : titleId);

  return (
    <ModalContext.Provider value={{ titleId }}>
      <div
        className={className}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={modalLabelledBy}
        aria-modal={ariaModal}
        {...otherProps}
      >
        {showCloseButton && (
          <Link
            className={styles.closeButton}
            title={translate('Close')}
            onPress={onModalClose}
          >
            <Icon name={icons.CLOSE} size={18} />
          </Link>
        )}

        {children}
      </div>
    </ModalContext.Provider>
  );
}

export default ModalContent;
