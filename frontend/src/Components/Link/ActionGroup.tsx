import classNames from 'classnames';
import React, { ComponentPropsWithoutRef } from 'react';
import translate from 'Utilities/String/translate';
import styles from './ActionGroup.css';

interface ActionGroupProps extends ComponentPropsWithoutRef<'div'> {
  label?: string;
}

export default function ActionGroup({
  className,
  label,
  ...otherProps
}: ActionGroupProps) {
  return (
    <div
      className={classNames(styles.actionGroup, className)}
      role="toolbar"
      aria-label={label ?? translate('Actions')}
      {...otherProps}
    />
  );
}
