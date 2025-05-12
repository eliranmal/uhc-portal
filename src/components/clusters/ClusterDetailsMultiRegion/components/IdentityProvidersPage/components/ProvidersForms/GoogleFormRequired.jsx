import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';

import { GridItem } from '@patternfly/react-core';

import { useFormState } from '~/components/clusters/wizards/hooks';

import { checkHostDomain } from '../../../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents_deprecated/ReduxVerticalFormGroup';
import { FieldId } from '../../constants';

import IDPBasicFields from './IDPBasicFields';

function GoogleForm({ isPending, isRequired }) {
  const { getFieldProps, getFieldMeta, setFieldValue } = useFormState();
  return (
    <>
      <IDPBasicFields />
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name={FieldId.HOSTED_DOMAIN}
          label="Hosted domain"
          type="text"
          helpText="Restrict users to a Google Apps domain"
          disabled={isPending}
          isRequired={isRequired}
          meta={getFieldMeta(FieldId.HOSTED_DOMAIN)}
          input={{
            ...getFieldProps(FieldId.HOSTED_DOMAIN),
            onChange: (_, value) => setFieldValue(FieldId.HOSTED_DOMAIN, value),
          }}
          validate={checkHostDomain}
        />
      </GridItem>
    </>
  );
}

GoogleForm.propTypes = {
  isPending: PropTypes.bool,
  isRequired: PropTypes.bool,
};

GoogleForm.defaultProps = {
  isPending: false,
  isRequired: false,
};

export default GoogleForm;
