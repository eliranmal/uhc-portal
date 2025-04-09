import React from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { Form, Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import getClusterName from '~/common/getClusterName';
import ErrorBox from '~/components/common/ErrorBox';
import TextField from '~/components/common/formik/TextField';
import Modal from '~/components/common/Modal/Modal';
import { closeModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import {
  useCreateClusterTransfer,
  useEditClusterTransfer,
} from '~/queries/ClusterActionsQueries/useClusterTransfer';
import { useFetchClusterTransfer } from '~/queries/ClusterDetailsQueries/AccessControlTab/ClusterTransferOwnership/useFetchClusterTransfer';
import { useFetchActionsPermissions } from '~/queries/ClusterDetailsQueries/useFetchActionsPermissions';
import { queryConstants } from '~/queries/queriesConstants';
import { useGlobalState } from '~/redux/hooks';
import { ClusterTransferStatus, Subscription } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription, ErrorState } from '~/types/types';

import { TransferDetails } from '../../ClusterDetailsMultiRegion/components/AccessControl/ClusterTransferOwnership/TransferDetails';

type AutoTransferClusterOwnershipFormProps = {
  onClose: () => void;
};

type ModalData = {
  subscription: Subscription;
};
const MAX_CHARACTERS = 64;
const MAX_CHARACTERS_MESSAGE = `Must be ${MAX_CHARACTERS} characters or less`;

function AutoTransferClusterOwnershipForm(props: AutoTransferClusterOwnershipFormProps) {
  const { onClose } = props;

  const dispatch = useDispatch();
  const modalData: ModalData = useGlobalState((state) => state.modal.data) as ModalData;
  const {
    isPending,
    isError,
    error,
    mutate: transferClusterOwnership,
    isSuccess,
    reset,
  } = useCreateClusterTransfer();
  const {
    isPending: isPendingCancel,
    isError: isErrorCancel,
    error: errorCancel,
    mutate: cancelClusterTransfer,
  } = useEditClusterTransfer();
  const cluster: ClusterFromSubscription = React.useMemo(
    () =>
      ({
        subscription: modalData.subscription,
      }) as unknown as ClusterFromSubscription,
    [modalData],
  );

  const clusterExternalID = cluster.subscription?.external_cluster_id || '';
  const { data, isLoading } = useFetchClusterTransfer({
    clusterExternalID,
    showPendingTransfer: true,
  });
  const transfer = data?.items?.[0] || {};
  const isTransferPending = transfer.status === ClusterTransferStatus.Pending.toLowerCase();
  const username = useGlobalState((state) => state.userProfile.keycloakProfile.username);
  const isOwner = cluster.subscription?.creator?.username === username;

  const { canEdit } = useFetchActionsPermissions(
    cluster.subscription?.id || '',
    queryConstants.FETCH_CLUSTER_DETAILS_QUERY_KEY,
    cluster.subscription?.status,
  );
  const submitTransfer = async ({
    username,
    accountID,
    orgID,
  }: {
    username: string;
    accountID: string;
    orgID: string;
  }) => {
    transferClusterOwnership(
      {
        clusterExternalID: cluster.subscription?.external_cluster_id || '',
        currentOwner: cluster.subscription?.creator?.username || '',
        recipient: username,
        recipientOrgId: orgID,
      },
      {
        onSuccess: () => {
          dispatch(
            addNotification({
              variant: 'success',
              title: 'Cluster ownership transfer initiated',
              dismissable: true,
            }),
          );
        },
      },
    );
  };

  const handleClose = React.useCallback(() => {
    dispatch(closeModal());
    reset();
  }, [dispatch, reset]);

  const handleCancelTransfer = () => {
    cancelClusterTransfer({ transferID: transfer.id || '', updatedStatus: 'rescinded' });
    dispatch(
      addNotification({
        variant: 'info',
        title: 'Cluster ownership transfer rescinded',
        dismissable: true,
      }),
    );
    handleClose();
  };

  React.useEffect(() => {
    if (isSuccess) {
      handleClose();
      onClose();
    }
  }, [handleClose, onClose, isSuccess]);

  const errorNotice =
    isError || isErrorCancel ? (
      <Stack hasGutter>
        <StackItem>
          <ErrorBox
            message="A problem occurred while transfering cluster ownership"
            response={(error?.error as ErrorState) || (errorCancel?.error as ErrorState)}
          />
        </StackItem>
      </Stack>
    ) : null;
  if (isLoading) {
    return null;
  }
  return isTransferPending ? (
    <Modal
      id="transfer-in-progress-modal"
      title={`Transfer in progress for ${getClusterName(cluster)}`}
      aria-labelledby="transfer-in-progress-modal"
      onClose={handleClose}
      modalSize="medium"
      isSmall={false}
      primaryText="Cancel transfer"
      isPrimaryDisabled={!canEdit || !isOwner || isPendingCancel}
      secondaryText="Close"
      onSecondaryClick={handleClose}
      onPrimaryClick={() => {
        handleCancelTransfer();
      }}
    >
      <TransferDetails transfer={transfer} />
      {errorNotice}
    </Modal>
  ) : (
    <Formik
      initialValues={{
        username: '',
        accountID: '',
        orgID: '',
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .max(MAX_CHARACTERS, MAX_CHARACTERS_MESSAGE)
          .test(
            'same-username',
            'Username must be different from the current owner',
            (value) => value !== cluster.subscription?.creator?.username,
          )
          .required('Required'),
        accountID: Yup.string()
          .max(MAX_CHARACTERS, MAX_CHARACTERS_MESSAGE)
          .test('alpha-numeric', 'Account ID must be an alpha numeric with no symbols', (value) =>
            /^[a-zA-Z0-9]+$/.test(value || ''),
          )
          .required('Required'),
        orgID: Yup.string()
          .max(MAX_CHARACTERS, MAX_CHARACTERS_MESSAGE)
          .test(
            'alpha-numeric',
            'Organization ID must be an alpha numeric with no symbols',
            (value) => /^[a-zA-Z0-9]+$/.test(value || ''),
          )
          .required('Required'),
      })}
      onSubmit={submitTransfer}
    >
      {(formik) => (
        <Modal
          id="auto-transfer-cluster-ownership-modal"
          title={`Transfer ownership of ${getClusterName(cluster)}`}
          aria-labelledby="auto-transfer-cluster-ownership-modal"
          onClose={handleClose}
          modalSize="medium"
          isSmall={false}
          primaryText="Initiate transfer"
          secondaryText="Cancel"
          onSecondaryClick={handleClose}
          onPrimaryClick={formik.submitForm}
          isPrimaryDisabled={
            !formik.isValid ||
            !formik.dirty ||
            formik.isSubmitting ||
            isPending ||
            !canEdit ||
            !isOwner
          }
          isSecondaryDisabled={formik.isSubmitting || isPending}
        >
          <TextContent>
            <Text component={TextVariants.small}>
              You can transfer cluster ownership to another account within or outside of your
              organization. By doing so, you give up all rights or access to the cluster and its
              resources. If approved, only the new account will have access to manage the cluster.
              Learn more about the transfer approval process.
            </Text>
            <Text component={TextVariants.p}>Account information</Text>
            <Text component={TextVariants.small}>
              When you initiate the transfer, the user specified below will receive an email request
              to approve the ownership transfer. Keep in mind the transfer request automatically
              expires 5 days after initiation, and can be canceled at any time.
            </Text>
            <Text component={TextVariants.small}>
              The transfer is complete when the new owner accepts the transfer from their portal.
            </Text>
            <Text component={TextVariants.small}>
              If the transfer is not completed within 5 days, the procedure must be restarted.
            </Text>
          </TextContent>
          <br />
          <Form>
            <TextField fieldId="username" label="Username" isRequired />
            <TextField fieldId="accountID" label="Account ID" isRequired />
            <TextField fieldId="orgID" label="Organization ID" isRequired />
          </Form>
          {errorNotice}
        </Modal>
      )}
    </Formik>
  );
}

AutoTransferClusterOwnershipForm.modalName = modals.TRANSFER_CLUSTER_OWNERSHIP_AUTO;

export default AutoTransferClusterOwnershipForm;
