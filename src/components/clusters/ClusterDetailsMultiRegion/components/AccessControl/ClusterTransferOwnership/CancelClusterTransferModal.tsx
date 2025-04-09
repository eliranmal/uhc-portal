import React from 'react';
import { useDispatch } from 'react-redux';

import { Button, Flex, Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import ErrorBox from '~/components/common/ErrorBox';
import { useEditClusterTransfer } from '~/queries/ClusterActionsQueries/useClusterTransfer';
import { ErrorState } from '~/types/types';

type CancelClusterTransferModalProps = {
  transferId: string;
  onClose: () => void;
  isOpen?: boolean;
};

export const CancelClusterTransferModal = (props: CancelClusterTransferModalProps) => {
  const { transferId, onClose, isOpen = true } = props;
  const {
    isPending,
    isError,
    error,
    mutate: cancelClusterTransfer,
    reset,
  } = useEditClusterTransfer();
  const dispatch = useDispatch();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Cancel cluster transfer"
      onClose={handleClose}
      isOpen={isOpen}
      variant="small"
      actions={[
        <Button
          key="cancel-transfer"
          variant="primary"
          isDisabled={isPending}
          isLoading={isPending}
          onClick={() => {
            cancelClusterTransfer({ transferID: transferId, updatedStatus: 'rescinded' });
            dispatch(
              addNotification({
                variant: 'info',
                title: 'Cluster ownership transfer rescinded',
                dismissable: true,
              }),
            );

            handleClose();
          }}
        >
          Cancel transfer
        </Button>,
        <Button key="cancel" variant="secondary" onClick={handleClose}>
          Close
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
          <p>This action cannot be undone. It will cancel the impending transfer.</p>
        </Flex>
      )}
    </Modal>
  );
};
