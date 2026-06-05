import React from 'react';
import Link, { LinkProps } from 'Components/Link/Link';
import styles from './Card.css';

interface CardProps extends Pick<LinkProps, 'onPress'> {
  // TODO: Consider using different properties for classname depending if it's overlaying content or not
  ariaLabel?: string;
  className?: string;
  overlayClassName?: string;
  overlayContent?: boolean;
  title?: string;
  children: React.ReactNode;
}

function Card(props: CardProps) {
  const {
    className = styles.card,
    ariaLabel,
    overlayClassName = styles.overlay,
    overlayContent = false,
    children,
    onPress,
    title,
  } = props;

  if (overlayContent) {
    return (
      <div className={className}>
        <Link
          className={styles.underlay}
          aria-label={ariaLabel}
          title={title}
          onPress={onPress}
        />

        <div className={overlayClassName}>{children}</div>
      </div>
    );
  }

  return (
    <Link
      className={className}
      aria-label={ariaLabel}
      title={title}
      onPress={onPress}
    >
      {children}
    </Link>
  );
}

export default Card;
