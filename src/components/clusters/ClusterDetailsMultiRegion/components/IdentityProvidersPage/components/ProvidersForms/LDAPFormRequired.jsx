import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';

import { Divider, GridItem, Title } from '@patternfly/react-core';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { FormikFieldArray } from '~/components/common/FormikFormComponents/FormikFieldArray/FormikFieldArray';

import { required } from '../../../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents_deprecated/ReduxVerticalFormGroup';
import { FieldId } from '../../constants';

const LDAPFormRequired = ({ isPending }) => {
  const { getFieldProps, setFieldValue, getFieldMeta, values } = useFormState();

  const hasBindDN = values[FieldId.BIND_DN];

  return (
    <>
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name={FieldId.LDAP_URL}
          label="LDAP URL"
          type="text"
          disabled={isPending}
          validate={required}
          isRequired
          helpText="An RFC 2255 URL which specifies the LDAP search parameters to use."
          meta={getFieldMeta(FieldId.LDAP_URL)}
          input={{
            ...getFieldProps(FieldId.LDAP_URL),
            onChange: (_, value) => setFieldValue(FieldId.LDAP_URL, value),
          }}
        />
      </GridItem>
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name={FieldId.BIND_DN}
          meta={getFieldMeta(FieldId.BIND_DN)}
          input={{
            ...getFieldProps(FieldId.BIND_DN),
            onChange: (_, value) => setFieldValue(FieldId.BIND_DN, value),
          }}
          label="Bind DN"
          type="text"
          disabled={isPending}
          helpText="DN to bind with during the search phase."
        />
      </GridItem>

      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name={FieldId.BIND_PASSWORD}
          meta={getFieldMeta(FieldId.BIND_PASSWORD)}
          input={{
            ...getFieldProps(FieldId.BIND_PASSWORD),
            onChange: (_, value) => setFieldValue(FieldId.BIND_PASSWORD, value),
          }}
          label="Bind password"
          type="password"
          helpText={
            !hasBindDN
              ? 'Cannot be used if Bind DN is not set'
              : 'Password to bind with during the search phase.'
          }
          disabled={!hasBindDN || isPending}
          validate={hasBindDN ? required : undefined}
          isRequired={hasBindDN}
        />
      </GridItem>
      <GridItem span={8}>
        <Divider />
        <Title headingLevel="h3" size="xl" className="idp-helptext-heading">
          Attributes
        </Title>
        <p>Attributes map LDAP attributes to identities.</p>
      </GridItem>
      <FormikFieldArray
        fieldID={FieldId.LDAP_ID}
        label="ID"
        placeHolderText="e.g. id"
        disabled={isPending}
        isRequired
        validateField={required}
        helpText="The list of attributes whose values should be used as the user ID."
      />
      <FormikFieldArray
        fieldID={FieldId.LDAP_PREFFERED_USERNAME}
        label="Preferred username"
        type="text"
        placeholderText="e.g. preferred username"
        disabled={isPending}
        helpText="The list of attributes whose values should be used as the preferred username."
      />
      <FormikFieldArray
        fieldID={FieldId.LDAP_NAME}
        label="Name"
        type="text"
        placeholderText="e.g. name"
        disabled={isPending}
        helpText="The list of attributes whose values should be used as the display name."
      />
      <FormikFieldArray
        fieldID={FieldId.LDAP_EMAIL}
        label="Email"
        type="text"
        placeholderText="e.g. email"
        disabled={isPending}
        helpText="The list of attributes whose values should be used as the email address."
      />
    </>
  );
};

LDAPFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

export default LDAPFormRequired;
