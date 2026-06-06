import React, { ReactNode, SyntheticEvent } from 'react';
import Link from './Link';

interface ActionCardProps {
  className: string;
  underlayClassName: string;
  overlayClassName: string;
  nameClassName: string;
  actionsClassName: string;
  label: string;
  name: ReactNode;
  title?: string;
  children?: ReactNode;
  onPress(event: SyntheticEvent): void;
}

function ActionCard({
  className,
  underlayClassName,
  overlayClassName,
  nameClassName,
  actionsClassName,
  label,
  name,
  title,
  children,
  onPress,
}: ActionCardProps) {
  return (
    <div className={className}>
      <Link
        className={underlayClassName}
        tabIndex={-1}
        aria-hidden={true}
        onPress={onPress}
      />

      <div className={overlayClassName}>
        <Link
          className={nameClassName}
          aria-label={label}
          title={title}
          onPress={onPress}
        >
          {name}
        </Link>

        <div className={actionsClassName}>{children}</div>
      </div>
    </div>
  );
}

export default ActionCard;
