import React from 'react';
import { Field } from 'formik';

import { GridItem } from '@patternfly/react-core';

import { useFormState } from '~/components/clusters/wizards/hooks';

import { required } from '../../../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents_deprecated/ReduxVerticalFormGroup';
import { FieldId } from '../../constants';

export type IDPBasicFieldsProps = {
  isPending?: boolean;
};

const IDPBasicFields = ({ isPending = false }: IDPBasicFieldsProps) => {
  const { getFieldProps, getFieldMeta, setFieldValue } = useFormState();
  return (
    <>
      <GridItem span={8}>
        <Field
          id={FieldId.CLIENT_ID}
          component={ReduxVerticalFormGroup}
          name={FieldId.CLIENT_ID}
          input={{
            ...getFieldProps(FieldId.CLIENT_ID),
            onChange: (_: React.FormEvent<HTMLInputElement>, value: string) =>
              setFieldValue(FieldId.CLIENT_ID, value),
          }}
          meta={getFieldMeta(FieldId.CLIENT_ID)}
          label="Client ID"
          type="text"
          validate={required}
          isRequired
          disabled={isPending}
        />
      </GridItem>
      <GridItem span={8}>
        <Field
          id={FieldId.CLIENT_SECRET}
          component={ReduxVerticalFormGroup}
          name={FieldId.CLIENT_SECRET}
          input={{
            ...getFieldProps(FieldId.CLIENT_SECRET),
            onChange: (_: React.FormEvent<HTMLInputElement>, value: string) =>
              setFieldValue(FieldId.CLIENT_SECRET, value),
          }}
          meta={getFieldMeta(FieldId.CLIENT_SECRET)}
          label="Client secret"
          type="password"
          validate={required}
          isRequired
          disabled={isPending}
        />
      </GridItem>
    </>
  );
};

export default IDPBasicFields;
