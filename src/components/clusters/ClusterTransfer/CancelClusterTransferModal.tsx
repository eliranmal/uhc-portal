import React from 'react';
import { useDispatch } from 'react-redux';

import { Button, Flex, Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import ButtonWithTooltip from '~/components/common/ButtonWithTooltip';
import ErrorBox from '~/components/common/ErrorBox';
import { useEditClusterTransfer } from '~/queries/ClusterActionsQueries/useClusterTransfer';
import { ErrorState } from '~/types/types';

type CancelClusterTransferModalProps = {
  transferId: string;
  displayName?: string;
  disableCancelReason?: string;
  buttonText?: string;
};

export const CancelClusterTransferModal = (props: CancelClusterTransferModalProps) => {
  const { transferId, displayName, disableCancelReason, buttonText = 'Cancel' } = props;
  const [isOpen, setIsOpen] = React.useState(false);

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
    setIsOpen(false);
  };

  return (
    <>
      <ButtonWithTooltip
        variant="secondary"
        onClick={() => setIsOpen(true)}
        disableReason={disableCancelReason}
        isAriaDisabled={!!disableCancelReason}
      >
        {buttonText}
      </ButtonWithTooltip>

      <Modal
        title="Cancel cluster transfer"
        onClose={handleClose}
        isOpen={isOpen}
        variant="small"
        actions={[
          <Button
            key="rescind-transfer"
            variant="primary"
            isDisabled={isPending}
            isLoading={isPending}
            onClick={() => {
              cancelClusterTransfer({ transferID: transferId, updatedStatus: 'rescinded' });
              dispatch(
                addNotification({
                  variant: 'info',
                  title: 'Cluster ownership transfer canceled',
                  dismissable: true,
                }),
              );

              handleClose();
            }}
          >
            Cancel Transfer
          </Button>,
          <Button
            key="close-cancel"
            variant="secondary"
            onClick={handleClose}
            aria-label="Close Cancel Button"
          >
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
            <p>
              This action cannot be undone. It will cancel the impending transfer for cluster{' '}
              {displayName}.
            </p>
          </Flex>
        )}
      </Modal>
    </>
  );
};
