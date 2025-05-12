import React from 'react';

import {
  Button,
  ClipboardCopy,
  ClipboardCopyVariant,
  Modal,
  StackItem,
} from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import { useFetchBreakGlassCredentialDetails } from '~/queries/ClusterDetailsQueries/AccessControlTab/ExternalAuthenticationQueries/useFetchBreakGlassCredentialDetails';
import { BreakGlassCredential } from '~/types/clusters_mgmt.v1';

const DownloadButton = ({ textOutput, disabled }: { textOutput: string; disabled: boolean }) => {
  const file = new Blob([textOutput], { type: 'text/plain' });

  return (
    <Button
      component="a"
      variant="primary"
      download="kubeConfig.txt"
      target="_blank"
      rel="noreferrer"
      href={URL.createObjectURL(file)}
      isDisabled={disabled}
    >
      Download
    </Button>
  );
};

type BreakGlassCredentialDetailsModalProps = {
  clusterID: string;
  onClose: () => void;
  credential?: BreakGlassCredential;
  isOpen?: boolean;
  region?: string;
};

export function BreakGlassCredentialDetailsModal(props: BreakGlassCredentialDetailsModalProps) {
  const { clusterID, onClose, credential, region, isOpen = true } = props;

  const {
    data: credentialData,
    isLoading,
    isError,
    error,
  } = useFetchBreakGlassCredentialDetails(region, clusterID, credential?.id);

  const statusMessage = () => {
    if (credentialData?.status === 'revoked') {
      return 'Credentials have been revoked.';
    }
    if (credentialData?.status === 'created') {
      return 'Credentials are being created. Try again later.';
    }
    return 'Here are the credentials';
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      id="edit-mp-modal"
      title={`${credential?.username} credentials`}
      onClose={handleClose}
      variant="medium"
      description="Use these temporary credentials to access your cluster."
      isOpen={isOpen}
      actions={[
        <DownloadButton
          textOutput={credentialData?.kubeconfig || ''}
          disabled={isLoading || !credentialData?.kubeconfig}
        />,
        <Button key="cancel" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    >
      {statusMessage()}
      {isError && (
        <StackItem>
          <ErrorBox
            message="A problem occurred while retrieving credential"
            response={{
              errorMessage: error.error.reason,
              operationID: error.error.operationID,
            }}
          />
        </StackItem>
      )}

      <ClipboardCopy isReadOnly variant={ClipboardCopyVariant.expansion}>
        {isLoading ? 'Loading...' : credentialData?.kubeconfig || 'No kubeconfig'}
      </ClipboardCopy>
    </Modal>
  );
}
