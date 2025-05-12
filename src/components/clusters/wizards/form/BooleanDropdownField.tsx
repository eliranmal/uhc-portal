import React from 'react';
import { FormikValues, useField, useFormikContext } from 'formik';

import {
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  SelectProps,
} from '@patternfly/react-core';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

import './BooleanDropdownField.scss';

interface BooleanDropdownFieldProps {
  name: string;
  label: string;
  helperText?: React.ReactNode;
  isDisabled?: boolean;
}

const isTrue = (sel: string | number | undefined) => sel?.toString() === 'true';
const isFalse = (sel: string | number | undefined) => sel?.toString() === 'false';

const trueOption = {
  toString: () => 'true',
  compareTo: isTrue,
};

const falseOption = {
  toString: () => 'false',
  compareTo: isFalse,
};

const options = [trueOption, falseOption];

export const BooleanDropdownField = ({
  name,
  label,
  helperText,
  isDisabled,
}: BooleanDropdownFieldProps) => {
  const [field, { touched, error }] = useField<string[]>(name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };
  const onSelect: SelectProps['onSelect'] = (_event, selection) => {
    setIsOpen(false);
    setFieldValue(name, isTrue(selection));
    setFieldTouched(name);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggle}
      isExpanded={isOpen}
      isDisabled={isDisabled}
      isFullWidth
      className="boolean-dropdown-menu-toggle"
    >
      {field.value?.toString() ?? falseOption.toString()}
    </MenuToggle>
  );

  return (
    <FormGroup role="group" fieldId={name} label={label}>
      <Select
        isOpen={isOpen}
        toggle={toggle}
        onSelect={onSelect}
        onOpenChange={setIsOpen}
        selected={field.value ? trueOption : falseOption}
      >
        <SelectList>
          {options.map((opObj) => (
            <SelectOption value={opObj} key={opObj.toString()}>
              {opObj.toString()}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
      <FormGroupHelperText touched={touched} error={error}>
        {helperText}
      </FormGroupHelperText>
    </FormGroup>
  );
};
