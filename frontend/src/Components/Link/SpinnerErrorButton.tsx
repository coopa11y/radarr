import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Error } from 'App/State/AppSectionState';
import Icon, { IconKind, IconName } from 'Components/Icon';
import SpinnerButton, {
  SpinnerButtonProps,
} from 'Components/Link/SpinnerButton';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { icons } from 'Helpers/Props';
import { ValidationFailure } from 'typings/pending';
import styles from './SpinnerErrorButton.css';

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

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join(' ').trim();
  }

  if (React.isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return '';
}

function getErrorMessages(error: Error | string | undefined) {
  if (!error) {
    return [];
  }

  if (typeof error === 'string') {
    return [error];
  }

  const responseJSON = error.responseJSON;

  if (Array.isArray(responseJSON)) {
    return responseJSON.map((failure) => failure.errorMessage).filter(Boolean);
  }

  if (responseJSON?.message) {
    return [responseJSON.message];
  }

  return [];
}

function getTestResult(error: Error | string | undefined) {
  if (!error) {
    return {
      wasSuccessful: true,
      hasWarning: false,
      hasError: false,
    };
  }

  if (typeof error === 'string' || error.status !== 400) {
    return {
      wasSuccessful: false,
      hasWarning: false,
      hasError: true,
    };
  }

  const failures = error.responseJSON as ValidationFailure[];

  const { hasError, hasWarning } = failures.reduce(
    (acc, failure) => {
      if (failure.isWarning) {
        acc.hasWarning = true;
      } else {
        acc.hasError = true;
      }

      return acc;
    },
    { hasWarning: false, hasError: false }
  );

  return {
    wasSuccessful: false,
    hasWarning,
    hasError,
  };
}

function getStatusAnnouncement(
  actionLabel: string,
  result: ReturnType<typeof getTestResult>,
  error: Error | string | undefined
) {
  const label = actionLabel || 'Action';
  const [firstErrorMessage] = getErrorMessages(error);

  if (result.wasSuccessful) {
    return `${label} completed successfully.`;
  }

  if (result.hasWarning) {
    return firstErrorMessage
      ? `${label} completed with warnings. ${firstErrorMessage}`
      : `${label} completed with warnings.`;
  }

  if (result.hasError) {
    return firstErrorMessage
      ? `${label} failed. ${firstErrorMessage}`
      : `${label} failed.`;
  }

  return '';
}

interface SpinnerErrorButtonProps extends SpinnerButtonProps {
  isSpinning: boolean;
  error?: Error | string;
  children: React.ReactNode;
}

function SpinnerErrorButton({
  kind,
  isSpinning,
  error,
  children,
  ...otherProps
}: SpinnerErrorButtonProps) {
  const wasSpinning = usePrevious(isSpinning);
  const updateTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [result, setResult] = useState({
    wasSuccessful: false,
    hasWarning: false,
    hasError: false,
  });
  const [announcement, setAnnouncement] = useState('');
  const { wasSuccessful, hasWarning, hasError } = result;
  const actionLabel = useMemo(() => getTextContent(children), [children]);

  const showIcon = wasSuccessful || hasWarning || hasError;

  const { iconName, iconKind } = useMemo<{
    iconName: IconName;
    iconKind: IconKind;
  }>(() => {
    if (hasWarning) {
      return {
        iconName: icons.WARNING,
        iconKind: 'warning',
      };
    }

    if (hasError) {
      return {
        iconName: icons.DANGER,
        iconKind: 'danger',
      };
    }

    return {
      iconName: icons.CHECK,
      iconKind: kind === 'primary' ? 'default' : 'success',
    };
  }, [kind, hasError, hasWarning]);

  useEffect(() => {
    if (wasSpinning && !isSpinning) {
      const testResult = getTestResult(error);

      setResult(testResult);
      setAnnouncement(getStatusAnnouncement(actionLabel, testResult, error));

      const { wasSuccessful, hasWarning, hasError } = testResult;

      if (wasSuccessful || hasWarning || hasError) {
        updateTimeout.current = setTimeout(() => {
          setResult({
            wasSuccessful: false,
            hasWarning: false,
            hasError: false,
          });
        }, 3000);
      }
    }
  }, [isSpinning, wasSpinning, error, actionLabel]);

  useEffect(() => {
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, []);

  return (
    <>
      <SpinnerButton kind={kind} isSpinning={isSpinning} {...otherProps}>
        <span className={showIcon ? styles.showIcon : undefined}>
          {showIcon && (
            <span className={styles.iconContainer}>
              <Icon name={iconName} kind={iconKind} />
            </span>
          )}

          <span className={styles.label}>{children}</span>
        </span>
      </SpinnerButton>

      <span aria-live="polite" aria-atomic="true" style={screenReaderOnlyStyle}>
        {announcement}
      </span>
    </>
  );
}

export default SpinnerErrorButton;
