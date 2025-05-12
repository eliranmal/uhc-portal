import React from 'react';
import { Field } from 'formik';

import { ReduxBooleanSelectDropdown } from './ReduxBooleanSelectDropdown';

interface BooleanFieldProps {
  fieldName: string;
  fieldProps: object;
}

// This component needs passing the "parse" function at the Field level to work properly
const ReactFormBooleanField = ({ fieldName, fieldProps }: BooleanFieldProps) => (
  // @ts-ignore
  <Field
    component={ReduxBooleanSelectDropdown}
    parse={(value: string) => value === 'true'}
    name={fieldName}
    {...fieldProps}
  />
);

export default ReactFormBooleanField;
