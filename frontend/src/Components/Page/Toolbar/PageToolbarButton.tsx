import classNames from 'classnames';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import Icon, { IconName } from 'Components/Icon';
import Link, { LinkProps } from 'Components/Link/Link';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { icons } from 'Helpers/Props';
import styles from './PageToolbarButton.css';

const screenReaderOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function getErrorMessages(error: unknown) {
  if (!error) {
    return [];
  }

  if (typeof error === 'string') {
    return [error];
  }

  if (typeof error !== 'object') {
    return [];
  }

  let body: unknown = undefined;

  if ('responseJSON' in error) {
    body = error.responseJSON;
  } else if ('statusBody' in error) {
    body = error.statusBody;
  }

  if (Array.isArray(body)) {
    return body
      .map((failure) => {
        return typeof failure?.errorMessage === 'string'
          ? failure.errorMessage
          : undefined;
      })
      .filter(Boolean);
  }

  if (body && typeof body === 'object') {
    if ('message' in body && typeof body.message === 'string') {
      return [body.message];
    }

    if ('details' in body && typeof body.details === 'string') {
      return [body.details];
    }
  }

  return [];
}

function getStatusAnnouncement(label: string, error: unknown) {
  const [firstErrorMessage] = getErrorMessages(error);

  if (!error) {
    return `${label} completed successfully.`;
  }

  return firstErrorMessage
    ? `${label} failed. ${firstErrorMessage}`
    : `${label} failed.`;
}

export interface PageToolbarButtonProps extends LinkProps {
  label: string;
  iconName: IconName;
  spinningName?: IconName;
  isSpinning?: boolean;
  isDisabled?: boolean;
  announceCompletion?: boolean;
  error?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overflowComponent?: React.ComponentType<any>;
}

function PageToolbarButton({
  label,
  iconName,
  spinningName = icons.SPINNER,
  isDisabled = false,
  isSpinning = false,
  announceCompletion = false,
  error,
  overflowComponent,
  ...otherProps
}: PageToolbarButtonProps) {
  const wasSpinning = usePrevious(isSpinning);
  const [announcement, setAnnouncement] = useState('');
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!announceCompletion) {
      return;
    }

    if (!wasSpinning && isSpinning) {
      setAnnouncement('');
    }

    if (wasSpinning && !isSpinning) {
      setAnnouncement(getStatusAnnouncement(label, error));

      clearTimeoutRef.current = setTimeout(() => {
        setAnnouncement('');
      }, 5000);
    }
  }, [announceCompletion, error, isSpinning, label, wasSpinning]);

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Link
        className={classNames(
          styles.toolbarButton,
          isDisabled && styles.isDisabled
        )}
        isDisabled={isDisabled || isSpinning}
        title={label}
        {...otherProps}
      >
        <Icon
          name={isSpinning ? spinningName || iconName : iconName}
          isSpinning={isSpinning}
          size={21}
        />

        <div className={styles.labelContainer}>
          <div className={styles.label}>{label}</div>
        </div>
      </Link>

      {announceCompletion ? (
        <span
          aria-live="polite"
          aria-atomic="true"
          style={screenReaderOnlyStyle}
        >
          {announcement}
        </span>
      ) : null}
    </>
  );
}

export default PageToolbarButton;
