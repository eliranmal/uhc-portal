import React, { useEffect, useState } from 'react';
import { Field, FormikValues, useFormikContext } from 'formik';

import {
  Alert,
  AlertVariant,
  Form,
  FormGroup,
  FormHelperText,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  TextArea,
} from '@patternfly/react-core';

import { RadioButtons } from '~/components/common/ReduxFormComponents_deprecated';
import { AccessRequest, AccessRequestStatusState } from '~/types/access_transparency.v1';

import { AccessRequestFieldId } from '../model/AccessRequestFieldId';

import AccessRequestDetails from './AccessRequestDetails';

type AccessRequestEditProps = {
  accessRequest: AccessRequest;
  userDecisionRights?: boolean;
};

const AccessRequestEdit = ({ accessRequest, userDecisionRights }: AccessRequestEditProps) => {
  const {
    setFieldValue,
    getFieldProps,
    values: {
      [AccessRequestFieldId.State]: accessRequestState,
      [AccessRequestFieldId.Justification]: justification,
    },
    errors,
  } = useFormikContext<FormikValues>();

  const [justificationHelperText, setJustificationHelperText] = useState(
    'Add justification for denying it',
  );
  const [validated, setValidated] = useState<
    'default' | 'error' | 'warning' | 'success' | undefined
  >('default');

  useEffect(() => {
    if (accessRequestState === AccessRequestStatusState.Denied) {
      const isJustificationErrorState = errors?.[AccessRequestFieldId.Justification];
      setValidated(isJustificationErrorState ? 'error' : 'success');
      setJustificationHelperText(
        isJustificationErrorState
          ? (errors?.[AccessRequestFieldId.Justification] as string)
          : 'Thanks for your justification!',
      );
    } else {
      setValidated('default');
      setJustificationHelperText('');
    }
  }, [accessRequestState, errors]);

  return (
    <Grid hasGutter>
      <GridItem>
        <AccessRequestDetails accessRequest={accessRequest} />
      </GridItem>
      {userDecisionRights ? (
        <Form id="modal-with-form-form">
          <GridItem sm={12}>
            <FormGroup label="Decision" isRequired isInline fieldId={AccessRequestFieldId.State}>
              <Field
                component={RadioButtons}
                name={AccessRequestFieldId.State}
                ariaLabel="Decision"
                onChange={(value: AccessRequestStatusState) =>
                  setFieldValue(AccessRequestFieldId.State, value)
                }
                input={{
                  ...getFieldProps(AccessRequestFieldId.State),
                  onChange: (value: AccessRequestStatusState) =>
                    setFieldValue(AccessRequestFieldId.State, value),
                }}
                options={[
                  {
                    value: AccessRequestStatusState.Approved,
                    label: 'Approve',
                  },
                  {
                    value: AccessRequestStatusState.Denied,
                    label: 'Deny',
                  },
                ]}
                required
              />
            </FormGroup>
          </GridItem>
          <GridItem sm={12}>
            <FormGroup
              label="Justification"
              isRequired={accessRequestState === AccessRequestStatusState.Denied}
              fieldId={AccessRequestFieldId.Justification}
            >
              <TextArea
                name={AccessRequestFieldId.Justification}
                value={justification}
                onChange={(_event, value) =>
                  setFieldValue(AccessRequestFieldId.Justification, value)
                }
                isRequired
                aria-label="access request justification"
                validated={validated}
                isDisabled={accessRequestState !== AccessRequestStatusState.Denied}
                resizeOrientation="vertical"
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant={validated}>{justificationHelperText}</HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
          </GridItem>
        </Form>
      ) : (
        <GridItem sm={12}>
          <Alert variant={AlertVariant.warning} title="No rights for making a decision" isInline>
            The user has no rights for approving or denying the access request. Please contact
            cluster owner or organization admin.
          </Alert>
        </GridItem>
      )}
    </Grid>
  );
};

export default AccessRequestEdit;
