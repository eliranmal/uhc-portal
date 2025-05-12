import React from 'react';
import { Formik } from 'formik';

import { Button, Modal, StackItem } from '@patternfly/react-core';

import { queryClient } from '~/components/App/queryClient';
import ErrorBox from '~/components/common/ErrorBox';
import { EditClusterInput, useEditCluster } from '~/queries/ClusterDetailsQueries/useEditCluster';
import { queryConstants } from '~/queries/queriesConstants';
import { AugmentedCluster } from '~/types/types';

import { AWSBillingAccountForm } from './AWSBillingAccountForm';

type OverviewBillingAccountModalProps = {
  onClose: () => void;
  billingAccount: string;
  isOpen?: boolean;
  cluster: AugmentedCluster | undefined;
};

export function OverviewBillingAccountModal(props: OverviewBillingAccountModalProps) {
  const { onClose, billingAccount, isOpen = true, cluster } = props;

  const region = cluster?.subscription?.rh_region_id;
  const {
    isPending: isClusterEditPending,
    isError: isClusterEditError,
    error: clusterEditError,
    mutate: mutateClusterEdit,
    // reset: resetEditClusterResponse,
  } = useEditCluster(region);

  const handleClose = () => {
    onClose();
  };

  return (
    <Formik
      initialValues={{
        billingAccountId: billingAccount,
      }}
      onSubmit={async (values) => {
        if (billingAccount === values.billingAccountId) {
          handleClose();
        }
        const clusterBody: EditClusterInput = {
          clusterID: cluster?.id ?? '',
          cluster: {
            aws: {
              billing_account_id: values.billingAccountId,
            },
          },
        };
        mutateClusterEdit(clusterBody, {
          onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({
              queryKey: [
                queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
                'clusterService',
                cluster?.id,
                cluster?.subscription,
              ],
            });
          },
        });
      }}
    >
      {(formik) => (
        <Modal
          id="edit-billing-aws-account-modal"
          title="Edit AWS billing account"
          onClose={handleClose}
          variant="small"
          description="Updating the billing marketplace account changes the account that is charged for your subscription usage. There might be a delay in updating the account."
          isOpen={isOpen}
          actions={[
            <Button
              data-testid="Update"
              key="update"
              variant="primary"
              onClick={formik.submitForm}
              isDisabled={
                !formik.isValid || !formik.dirty || formik.isSubmitting || isClusterEditPending
              }
            >
              Update
            </Button>,
            <Button key="cancel" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>,
          ]}
        >
          {' '}
          <AWSBillingAccountForm
            name="billingAccountId"
            selectedAWSBillingAccountID={formik.values.billingAccountId}
          />
          {isClusterEditError && (
            <StackItem>
              <ErrorBox
                message="A problem occurred updating the billing account."
                response={{
                  errorMessage: clusterEditError?.message || clusterEditError?.errorMessage,
                  operationID: clusterEditError?.operationID,
                }}
              />
            </StackItem>
          )}
        </Modal>
      )}
    </Formik>
  );
}
