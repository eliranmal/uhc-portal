import React from 'react';

import { Button, Flex, Modal } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import { useRevokeBreakGlassCredentials } from '~/queries/ClusterDetailsQueries/AccessControlTab/ExternalAuthenticationQueries/useRevokeBreakGlassCredentials';

type RevokeBreakGlassCredentialsModalProps = {
  clusterId: string;
  onClose: () => void;
  isOpen?: boolean;
  region?: string;
};

export const RevokeBreakGlassCredentialsModal = (props: RevokeBreakGlassCredentialsModalProps) => {
  const { clusterId, onClose, region, isOpen = true } = props;
  const {
    isPending,
    isError,
    error,
    mutate: deleteBreakGlassCredential,
    reset,
  } = useRevokeBreakGlassCredentials(clusterId, region);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Revoke all credentials for cluster"
      onClose={handleClose}
      isOpen={isOpen}
      variant="medium"
      actions={[
        <Button
          key="revoke"
          variant="primary"
          isDisabled={isPending}
          isLoading={isPending}
          onClick={() => {
            deleteBreakGlassCredential();
            handleClose();
          }}
        >
          Revoke all
        </Button>,
        <Button key="cancel" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    >
      {isError ? (
        <ErrorBox
          message="A problem occurred while deleting the credentials."
          response={{
            errorMessage: error.error.errorMessage,
            operationID: error.error.operationID,
          }}
        />
      ) : (
        <Flex direction={{ default: 'column' }}>
          <p>This action cannot be undone. It will permanently revoke all credentials.</p>
        </Flex>
      )}
    </Modal>
  );
};
