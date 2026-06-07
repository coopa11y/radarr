# Frontend Accessibility Checklist

This fork keeps accessibility fixes maintainable by routing repeated behavior
through shared UI primitives instead of page-specific patches.

## Keyboard Actions

- Use native `button` or `a` elements when possible.
- When a non-native element must behave like a button, use
  `useKeyboardActivation()` so Enter and Space activate it consistently.
- Avoid duplicating Enter/Space handlers in page components.

## Cards And Provider Tiles

- Use `ActionCard` for provider/add-item tiles with a large visual target,
  a visible primary action, and secondary action buttons.
- Keep decorative underlay links out of the tab order with `tabIndex={-1}`
  and `aria-hidden={true}`.
- Put the accessible action name on the visible primary action, not only on a
  hidden overlay.

## Forms

- Prefer `FormInputGroup` for settings fields so help text, warnings, and
  validation messages are connected to inputs with `aria-describedby`.
- Use `FormLabel name={fieldName}` when the label is rendered separately from
  the input group.
- Add `ariaLabel` when the visible label is not programmatically connected or
  when a compact control needs extra context.
- For numeric fields, describe what increasing or decreasing the value does
  when the effect is not obvious.

## Tooltips And Dialogs

- Use tooltip/popover components that expose focus behavior and
  `aria-describedby`.
- Dialog content should use `ModalContent` so role, modal state, close labels,
  and title relationships remain consistent.

## NVDA Smoke Test

- Run `yarn a11y-check` before a11y commits to catch common regressions.
- Tab through the changed surface without using a mouse.
- Confirm every actionable item has a useful name and can be activated with
  Enter or Space.
- Confirm checkboxes announce checked, unchecked, or mixed state changes.
- Confirm help text or validation text is announced when focusing the field.
