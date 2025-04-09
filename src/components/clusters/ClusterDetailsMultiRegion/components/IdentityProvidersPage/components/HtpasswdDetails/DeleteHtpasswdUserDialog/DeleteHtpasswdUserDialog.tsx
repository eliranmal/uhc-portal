import React from 'react';
import { useDispatch } from 'react-redux';

import { Spinner } from '@patternfly/react-core';

import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { modalActions } from '~/components/common/Modal/ModalActions';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { useDeleteHtpasswdUser } from '~/queries/ClusterDetailsQueries/AccessControlTab/UserQueries/useDeleteHtpasswdUser';
import { useGlobalState } from '~/redux/hooks';

type DeleteHtpasswdUserDialogProps = {
  refreshHtpasswdUsers: () => void;
};

type ModalData = {
  clusterId: string;
  idpId: string;
  idpName: string;
  htpasswdUserId: string;
  htpasswdUserName: string;
  region: string | undefined;
};

const DeleteHtpasswdUserDialog = ({ refreshHtpasswdUsers }: DeleteHtpasswdUserDialogProps) => {
  const modalData = useGlobalState((state) => state.modal.data) as ModalData;

  const { clusterId, idpId, idpName, htpasswdUserId, htpasswdUserName, region } = modalData;

  const dispatch = useDispatch();
  const isOpen = useGlobalState((state) => shouldShowModal(state, 'delete-htpasswd-user'));

  const {
    isPending,
    isError,
    error,
    isSuccess,
    mutate,
    reset: resetResponse,
  } = useDeleteHtpasswdUser(clusterId, idpId, region);

  const closeModal = () => {
    if (resetResponse) {
      resetResponse();
    }
    dispatch(modalActions.closeModal());
  };

  if (isSuccess) {
    resetResponse();
    refreshHtpasswdUsers();
    closeModal();
  }

  const errorContainer = isError && (
    <ErrorBox message="Error removing identity provider" response={error.error} />
  );

  return (
    isOpen && (
      <Modal
        onClose={closeModal}
        primaryText="Remove user"
        primaryVariant="danger"
        onPrimaryClick={() =>
          mutate(htpasswdUserId, {
            onSuccess: () => {
              closeModal();
              refreshHtpasswdUsers();
            },
          })
        }
        onSecondaryClick={closeModal}
        title="Remove htpasswd user"
        isPending={isPending}
        data-testid="delete-htpasswd-user-dialog"
      >
        {errorContainer}
        {isPending ? (
          <Spinner size="xl" aria-label="Deleting user" />
        ) : (
          <>
            <p>
              You are about to remove <strong>{htpasswdUserName}</strong> from the identity provider{' '}
              <strong>{idpName}</strong>.
            </p>
            <p>This user will lose access to this cluster.</p>
          </>
        )}
      </Modal>
    )
  );
};

export default DeleteHtpasswdUserDialog;
