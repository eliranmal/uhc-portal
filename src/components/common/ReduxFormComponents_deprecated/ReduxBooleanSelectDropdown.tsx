import React from 'react';
import { FieldInputProps, FieldMetaProps } from 'formik';

import {
  Flex,
  FormGroup,
  LabelProps,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  SelectProps,
} from '@patternfly/react-core';

import { FormGroupHelperText } from '../FormGroupHelperText';
import PopoverHint from '../PopoverHint';

import './ReduxBooleanSelectDropdown.scss';

interface ReduxSelectOption {
  name: string;
  value: string;
  label?: React.ReactElement<LabelProps>;
}

interface ReduxSelectDropdownProps {
  options: ReduxSelectOption[];
  label: string;
  helpText: string;
  meta: FieldMetaProps<string>;
  input: FieldInputProps<string>;
  isDisabled: boolean;
  isFormGroup: boolean;
  isRequired: boolean;
  extendedHelpText: React.ReactNode;
  formGroupClass?: string;
}

export const ReduxBooleanSelectDropdown = ({
  label,
  helpText,
  meta: { error, touched },
  input,
  isDisabled,
  isFormGroup = true,
  isRequired,
  formGroupClass,
  extendedHelpText,
  ...extraProps
}: ReduxSelectDropdownProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const onSelect: SelectProps['onSelect'] = (_event, selection) => {
    setIsExpanded(false);
    input.onChange(selection);
  };

  const toggle = (toggleRef?: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggle}
      isExpanded={isExpanded}
      isDisabled={isDisabled}
      isFullWidth
      className="redux-boolean-select-menu-toggle"
    >
      {input.value.toString()}
    </MenuToggle>
  );

  const formSelect = (
    <Select
      {...input}
      id={input.name}
      isOpen={isExpanded}
      selected={`${Boolean(input.value)}`}
      toggle={toggle}
      onSelect={onSelect}
      onOpenChange={setIsExpanded}
      onBlur={(event) => event.stopPropagation()}
      {...extraProps}
    >
      <SelectList>
        <SelectOption value="true">
          <Flex
            flexWrap={{ default: 'nowrap' }}
            spaceItems={{ default: 'spaceItemsSm' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            true
          </Flex>
        </SelectOption>
        <SelectOption value="false">
          <Flex
            flexWrap={{ default: 'nowrap' }}
            spaceItems={{ default: 'spaceItemsSm' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            false
          </Flex>
        </SelectOption>
      </SelectList>
    </Select>
  );

  return isFormGroup ? (
    <FormGroup
      fieldId={input.name}
      label={label}
      isRequired={isRequired}
      labelIcon={extendedHelpText ? <PopoverHint hint={extendedHelpText} /> : undefined}
      className={formGroupClass}
    >
      {formSelect}

      <FormGroupHelperText touched={touched} error={error}>
        {helpText}
      </FormGroupHelperText>
    </FormGroup>
  ) : (
    formSelect
  );
};
