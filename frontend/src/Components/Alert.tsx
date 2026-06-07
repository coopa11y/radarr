import classNames from 'classnames';
import React from 'react';
import { Kind } from 'Helpers/Props/kinds';
import styles from './Alert.css';

interface AlertProps {
  className?: string;
  kind?: Extract<Kind, keyof typeof styles>;
  role?: 'alert' | 'status';
  children: React.ReactNode;
}

function Alert(props: AlertProps) {
  const { className = styles.alert, kind = 'info', role, children } = props;

  let alertRole = role;

  if (!alertRole && kind === 'danger') {
    alertRole = 'alert';
  } else if (!alertRole && kind === 'warning') {
    alertRole = 'status';
  }

  let ariaLive: 'assertive' | 'polite' | undefined = undefined;

  if (alertRole === 'alert') {
    ariaLive = 'assertive';
  } else if (alertRole === 'status') {
    ariaLive = 'polite';
  }

  return (
    <div
      className={classNames(className, styles[kind])}
      role={alertRole}
      aria-live={ariaLive}
    >
      {children}
    </div>
  );
}

export default Alert;
