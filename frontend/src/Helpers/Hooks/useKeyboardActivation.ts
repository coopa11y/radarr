import { KeyboardEvent, KeyboardEventHandler, useCallback } from 'react';

function isActivationKey({ key }: KeyboardEvent<HTMLElement>) {
  return key === 'Enter' || key === ' ';
}

export default function useKeyboardActivation<T extends HTMLElement>(
  onKeyDown?: KeyboardEventHandler<T>
) {
  return useCallback(
    (event: KeyboardEvent<T>) => {
      onKeyDown?.(event);

      if (!event.defaultPrevented && isActivationKey(event)) {
        event.preventDefault();
        event.currentTarget.click();
      }
    },
    [onKeyDown]
  );
}
