import React from 'react';
import { useDispatch } from 'react-redux';

import { Button, Flex, Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import ErrorBox from '~/components/common/ErrorBox';
import { useEditClusterTransfer } from '~/queries/ClusterActionsQueries/useClusterTransfer';
import { ErrorState } from '~/types/types';

type AcceptDeclineClusterTransferModalProps = {
  transferId: string;
  displayName?: string;
};

export const AcceptDeclineClusterTransferModal = (
  props: AcceptDeclineClusterTransferModalProps,
) => {
  const { transferId, displayName } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    isPending,
    isError,
    error,
    mutate: editClusterTransfer,
    reset,
  } = useEditClusterTransfer();
  const dispatch = useDispatch();

  const handleClose = (status?: string) => {
    reset();
    if (status) {
      dispatch(
        addNotification({
          variant: 'info',
          title:
            status === 'accepted'
              ? 'Cluster ownership transfer was approved. It can take up to 24 hours for the transfer to complete.'
              : `Cluster ownership transfer was ${status}`,
          dismissable: true,
        }),
      );
    }
    setIsOpen(false);
  };

  const approveTransfer = (id: string) => {
    editClusterTransfer({ transferID: id, updatedStatus: 'accepted' });
    handleClose('accepted');
  };
  const declineTransfer = (id: string) => {
    editClusterTransfer({ transferID: id, updatedStatus: 'declined' });
    handleClose('declined');
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Accept/Decline
      </Button>
      <Modal
        title="Complete cluster transfer"
        onClose={() => handleClose()}
        isOpen={isOpen}
        variant="small"
        actions={[
          <Button
            key={`approve-${transferId}`}
            aria-label="Accept Transfer"
            onClick={() => approveTransfer(transferId)}
            isDisabled={isPending}
            isLoading={isPending}
            isInline
          >
            Accept Transfer
          </Button>,

          <Button
            key={`decline-${transferId}`}
            aria-label="Decline Transfer"
            onClick={() => declineTransfer(transferId)}
            isDisabled={isPending}
            isLoading={isPending}
            isInline
            variant="danger"
          >
            Decline Transfer
          </Button>,
          <Button
            key={`cancel-${transferId}`}
            variant="secondary"
            isInline
            component="span"
            aria-label="Cancel"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>,
        ]}
      >
        {isError ? (
          <ErrorBox
            message="A problem occurred while canceling the transfer."
            response={error?.error as ErrorState}
          />
        ) : (
          <Flex direction={{ default: 'column' }}>
            <p>
              Accepting this transfer will change the ownership of cluster {displayName} to you.
              Declining the transfer will end the transfer process and the cluster will not be
              transferred.
            </p>
          </Flex>
        )}
      </Modal>
    </>
  );
};
