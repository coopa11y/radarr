import classNames from 'classnames';
import React, { ComponentPropsWithoutRef } from 'react';
import translate from 'Utilities/String/translate';
import styles from './ActionGroup.css';

interface ActionGroupProps extends ComponentPropsWithoutRef<'div'> {
  context?: string;
  label?: string;
}

export default function ActionGroup({
  className,
  context,
  label,
  ...otherProps
}: ActionGroupProps) {
  const ariaLabel =
    label ??
    (context ? `${translate('Actions')}: ${context}` : translate('Actions'));

  return (
    <div
      className={classNames(styles.actionGroup, className)}
      role="toolbar"
      aria-label={ariaLabel}
      {...otherProps}
    />
  );
}
