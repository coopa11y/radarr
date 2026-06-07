import classNames from 'classnames';
import React, {
  ComponentPropsWithoutRef,
  ElementType,
  SyntheticEvent,
  useCallback,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styles from './Link.css';

export type LinkProps<C extends ElementType = 'button'> =
  ComponentPropsWithoutRef<C> & {
    actionLabel?: string;
    component?: C;
    context?: string;
    to?: string;
    target?: string;
    isDisabled?: LinkProps<C>['disabled'];
    noRouter?: boolean;
    onPress?(event: SyntheticEvent): void;
  };

export default function Link<C extends ElementType = 'button'>({
  actionLabel,
  className,
  component,
  context,
  to,
  target,
  type,
  isDisabled,
  noRouter,
  onPress,
  ...otherProps
}: LinkProps<C>) {
  const Component = component || 'button';
  const ariaLabel = otherProps['aria-label'];
  const label = actionLabel ?? otherProps.title;
  const accessibleLabel =
    ariaLabel ?? (label && context ? `${label}: ${context}` : actionLabel);

  const onClick = useCallback(
    (event: SyntheticEvent) => {
      if (isDisabled) {
        return;
      }

      onPress?.(event);
    },
    [isDisabled, onPress]
  );

  const linkClass = classNames(
    className,
    styles.link,
    to && styles.to,
    isDisabled && 'isDisabled'
  );

  if (to) {
    const toLink = /\w+?:\/\//.test(to);

    if (toLink || noRouter) {
      return (
        <a
          href={to}
          target={target || (toLink ? '_blank' : '_self')}
          rel={toLink ? 'noreferrer' : undefined}
          className={linkClass}
          aria-label={accessibleLabel}
          onClick={onClick}
          {...otherProps}
        />
      );
    }

    return (
      <RouterLink
        to={`${window.Radarr.urlBase}/${to.replace(/^\//, '')}`}
        target={target}
        className={linkClass}
        aria-label={accessibleLabel}
        onClick={onClick}
        {...otherProps}
      />
    );
  }

  return (
    <Component
      type={
        component === 'button' || component === 'input'
          ? type || 'button'
          : type
      }
      target={target}
      className={linkClass}
      aria-label={accessibleLabel}
      disabled={isDisabled}
      onClick={onClick}
      {...otherProps}
    />
  );
}
