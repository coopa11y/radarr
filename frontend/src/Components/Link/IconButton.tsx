import classNames from 'classnames';
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon, { IconProps } from 'Components/Icon';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import Link, { LinkProps } from './Link';
import styles from './IconButton.css';

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

function getMessagesFromBody(body: unknown) {
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

function getTestResult(error: unknown) {
  if (!error) {
    return {
      hasError: false,
      hasWarning: false,
      wasSuccessful: true,
    };
  }

  if (typeof error === 'string' || typeof error !== 'object') {
    return {
      hasError: true,
      hasWarning: false,
      wasSuccessful: false,
    };
  }

  let body: unknown = undefined;

  if ('responseJSON' in error) {
    body = error.responseJSON;
  } else if ('statusBody' in error) {
    body = error.statusBody;
  }

  if (!Array.isArray(body)) {
    return {
      hasError: true,
      hasWarning: false,
      wasSuccessful: false,
    };
  }

  const result = body.reduce(
    (acc, failure) => {
      if (failure?.isWarning) {
        acc.hasWarning = true;
      } else {
        acc.hasError = true;
      }

      return acc;
    },
    { hasError: false, hasWarning: false }
  );

  return {
    ...result,
    wasSuccessful: false,
  };
}

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

  return getMessagesFromBody(body);
}

function getStatusAnnouncement(
  label: string,
  result: ReturnType<typeof getTestResult>,
  error: unknown
) {
  const [firstErrorMessage] = getErrorMessages(error);

  if (result.wasSuccessful) {
    return `${label} completed successfully.`;
  }

  if (result.hasWarning) {
    return firstErrorMessage
      ? `${label} completed with warnings. ${firstErrorMessage}`
      : `${label} completed with warnings.`;
  }

  return firstErrorMessage
    ? `${label} failed. ${firstErrorMessage}`
    : `${label} failed.`;
}

export interface IconButtonProps
  extends Omit<LinkProps, 'name' | 'kind'>,
    Pick<IconProps, 'name' | 'kind' | 'size' | 'isSpinning'> {
  actionLabel?: string;
  announceCompletion?: boolean;
  context?: string;
  error?: unknown;
  iconClassName?: IconProps['className'];
}

export default function IconButton({
  actionLabel,
  announceCompletion = false,
  className = styles.button,
  context,
  error,
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
  const wasSpinning = usePrevious(isSpinning);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [announcement, setAnnouncement] = useState('');
  const [result, setResult] = useState({
    hasError: false,
    hasWarning: false,
    wasSuccessful: false,
  });

  const showResult =
    result.wasSuccessful || result.hasWarning || result.hasError;
  const iconState = useMemo(() => {
    if (isSpinning) {
      return {
        iconKind: kind,
        iconName: name,
      };
    }

    if (showResult && result.hasError) {
      return {
        iconKind: 'danger' as const,
        iconName: icons.DANGER,
      };
    }

    if (showResult && result.hasWarning) {
      return {
        iconKind: 'warning' as const,
        iconName: icons.WARNING,
      };
    }

    if (showResult && result.wasSuccessful) {
      return {
        iconKind: 'success' as const,
        iconName: icons.CHECK,
      };
    }

    return {
      iconKind: kind,
      iconName: name,
    };
  }, [isSpinning, kind, name, result, showResult]);

  useEffect(() => {
    if (!announceCompletion) {
      return;
    }

    if (!wasSpinning && isSpinning) {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }

      setAnnouncement('');
      setResult({
        hasError: false,
        hasWarning: false,
        wasSuccessful: false,
      });
    }

    if (wasSpinning && !isSpinning) {
      const testResult = getTestResult(error);

      setResult(testResult);
      setAnnouncement(
        getStatusAnnouncement(accessibleLabel, testResult, error)
      );

      clearTimeoutRef.current = setTimeout(() => {
        setResult({
          hasError: false,
          hasWarning: false,
          wasSuccessful: false,
        });
        setAnnouncement('');
      }, 5000);
    }
  }, [accessibleLabel, announceCompletion, error, isSpinning, wasSpinning]);

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
          name={iconState.iconName}
          kind={iconState.iconKind}
          size={size}
          isSpinning={isSpinning}
          aria-hidden={true}
        />
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
