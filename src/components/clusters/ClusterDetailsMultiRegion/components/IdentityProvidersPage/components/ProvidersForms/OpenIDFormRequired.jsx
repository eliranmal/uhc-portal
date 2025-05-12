import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';

import { GridItem } from '@patternfly/react-core';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { FormikFieldArray } from '~/components/common/FormikFormComponents/FormikFieldArray/FormikFieldArray';

import { checkOpenIDIssuer } from '../../../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents_deprecated/ReduxVerticalFormGroup';
import { FieldId } from '../../constants';
import { isEmptyReduxArray } from '../../IdentityProvidersHelper';

import IDPBasicFields from './IDPBasicFields';

const OpenIDFormRequired = ({ isPending }) => {
  const { getFieldProps, getFieldMeta, setFieldValue } = useFormState();

  const validateFunc = (_, allValues) => {
    if (
      isEmptyReduxArray(allValues.openid_preferred_username, 'openid_preferred_username') &&
      isEmptyReduxArray(allValues.openid_name, 'openid_name') &&
      isEmptyReduxArray(allValues.openid_email, 'openid_email')
    ) {
      return 'At least one claim is required';
    }
    return undefined;
  };

  return (
    <>
      <IDPBasicFields />
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name={FieldId.ISSUER}
          label="Issuer URL"
          type="text"
          disabled={isPending}
          validate={checkOpenIDIssuer}
          input={{
            ...getFieldProps(FieldId.ISSUER),
            onChange: (_, value) => setFieldValue(FieldId.ISSUER, value),
          }}
          meta={getFieldMeta(FieldId.ISSUER)}
          isRequired
          helpText="The URL that the OpenID provider asserts as the issuer identifier. It must use the https scheme with no URL query parameters or fragment."
        />
      </GridItem>
      <GridItem span={8}>
        <h4>Claims mappings</h4>
      </GridItem>
      <FormikFieldArray
        fieldID={FieldId.OPENID_EMAIL}
        label="Email"
        type="text"
        placeHolderText="e.g. email"
        disabled={isPending}
        helpText="The list of attributes whose values should be used as the email address."
        validate={validateFunc}
        isRequired
      />
      <FormikFieldArray
        fieldID={FieldId.OPENID_NAME}
        label="Name"
        type="text"
        placeHolderText="e.g. name"
        disabled={isPending}
        validate={validateFunc}
        helpText="The end user's full name including all name parts, ordered according to the end user's locale and preferences."
        isRequired
      />
      <FormikFieldArray
        fieldID={FieldId.OPENID_PREFFERED_USERNAME}
        label="Preferred username"
        type="text"
        placeHolderText="e.g. preferred_username"
        disabled={isPending}
        validate={validateFunc}
        helpText="Shorthand name by which the end user wishes to be referred to at the RP, such as janedone or j.doe."
        isRequired
      />
    </>
  );
};

OpenIDFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

OpenIDFormRequired.defaultProps = {
  isPending: false,
};

export default OpenIDFormRequired;
