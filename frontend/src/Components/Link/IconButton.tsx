import classNames from 'classnames';
import React from 'react';
import Icon, { IconProps } from 'Components/Icon';
import translate from 'Utilities/String/translate';
import Link, { LinkProps } from './Link';
import styles from './IconButton.css';

export interface IconButtonProps
  extends Omit<LinkProps, 'name' | 'kind'>,
    Pick<IconProps, 'name' | 'kind' | 'size' | 'isSpinning'> {
  actionLabel?: string;
  context?: string;
  iconClassName?: IconProps['className'];
}

export default function IconButton({
  actionLabel,
  className = styles.button,
  context,
  iconClassName,
  name,
  kind,
  size = 12,
  isSpinning,
  ...otherProps
}: IconButtonProps) {
  const ariaLabel = otherProps['aria-label'];
  const { title, ...linkProps } = otherProps;
  const label = actionLabel ?? title;
  const accessibleLabel =
    ariaLabel ??
    (label && context ? `${label}: ${context}` : label) ??
    translate('Options');

  return (
    <Link
      {...linkProps}
      className={classNames(
        className,
        linkProps.isDisabled && styles.isDisabled
      )}
      aria-label={accessibleLabel}
      title={title}
    >
      <Icon
        className={iconClassName}
        name={name}
        kind={kind}
        size={size}
        isSpinning={isSpinning}
        aria-hidden={true}
      />
    </Link>
  );
}
