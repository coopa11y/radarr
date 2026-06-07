import classNames from 'classnames';
import React, { Children, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Size } from 'Helpers/Props/sizes';
import FormLabel from './FormLabel';
import styles from './FormGroup.css';

interface FormGroupProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  children: ReactNode;
  size?: Extract<Size, keyof typeof styles>;
  advancedSettings?: boolean;
  isAdvanced?: boolean;
}

function FormGroup(props: FormGroupProps) {
  const {
    className = styles.group,
    children,
    size = 'small',
    advancedSettings = false,
    isAdvanced = false,
    ...otherProps
  } = props;

  if (!advancedSettings && isAdvanced) {
    return null;
  }

  const childrenArray = Children.toArray(children);
  const inputName = childrenArray.find((child) => {
    if (!React.isValidElement(child) || child.type === FormLabel) {
      return false;
    }

    return typeof child.props.name === 'string';
  });
  const labelName =
    React.isValidElement(inputName) && typeof inputName.props.name === 'string'
      ? inputName.props.name
      : undefined;
  const childProps = isAdvanced ? { isAdvanced } : {};

  return (
    <div className={classNames(className, styles[size])} {...otherProps}>
      {childrenArray.map((child) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        const element = child as React.ReactElement<{
          isAdvanced?: boolean;
          name?: string;
        }>;

        if (element.type === FormLabel && !element.props.name && labelName) {
          return React.cloneElement(element, {
            ...childProps,
            name: labelName,
          });
        }

        return React.cloneElement(element, childProps);
      })}
    </div>
  );
}

export default FormGroup;
