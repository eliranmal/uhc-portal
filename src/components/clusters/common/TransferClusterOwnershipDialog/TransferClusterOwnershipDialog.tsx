import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import getClusterName from '~/common/getClusterName';
import { ocmBaseName } from '~/common/routing';
import { useToggleSubscriptionReleased } from '~/queries/ClusterActionsQueries/useToggleSubscriptionReleased';
import { useGlobalState } from '~/redux/hooks';
import { Subscription, SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription, ErrorState } from '~/types/types';

import ErrorBox from '../../../common/ErrorBox';
import ExternalLink from '../../../common/ExternalLink';
import Modal from '../../../common/Modal/Modal';
import { closeModal } from '../../../common/Modal/ModalActions';
import modals from '../../../common/Modal/modals';

const CHANGE_PULL_SECRET_URL = 'https://access.redhat.com/solutions/4902871';

type TransferClusterOwnershipDialogProps = {
  onClose: () => void;
};

type ModaData = {
  subscription: Subscription;
  shouldDisplayClusterName?: boolean;
};

const TransferClusterOwnershipDialog = ({ onClose }: TransferClusterOwnershipDialogProps) => {
  const dispatch = useDispatch();

  const modalData: ModaData = useGlobalState((state) => state.modal.data) as ModaData;

  const {
    isPending: isToggleSubscriptionReleasedPending,
    isError: isToggleSubscriptionReleasedError,
    error: toggleSubscriptionReleasedError,
    mutate: toggleSubscriptionReleased,
    isSuccess: isToggleSubscriptionReleasedSuccess,
  } = useToggleSubscriptionReleased();

  const clusterDisplayName = useMemo(() => {
    const fakeCluster: ClusterFromSubscription = {
      subscription: modalData.subscription,
    } as ClusterFromSubscription;

    return getClusterName(fakeCluster);
  }, [modalData]);

  const subscription = useMemo(() => modalData.subscription, [modalData]);
  const shouldDisplayClusterName = useMemo(
    () => modalData.shouldDisplayClusterName ?? false,
    [modalData],
  );

  const handleSubmit = () => {
    if (subscription?.id) {
      const isReleased = subscription?.released ?? false;
      toggleSubscriptionReleased(
        { subscriptionID: subscription.id, released: !isReleased },
        {
          // NOTE - it doesn't appear that this dialog is ever called when
          // cancelling a transfer
          // Keeping code just in case this is wrong
          // See src/components/clusters/commonMultiRegion/ClusterActionsDropdown/ClusterActionsDropdownItems.jsx
          // for the code that is called on the cluster actions
          onSuccess: () => {
            if (isReleased) {
              dispatch(
                addNotification({
                  variant: 'success',
                  title: 'Cluster ownership transfer canceled',
                  dismissable: false,
                }),
              );
            }
          },
        },
      );
    }
  };

  const handleClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  useEffect(() => {
    if (isToggleSubscriptionReleasedSuccess) {
      handleClose();
      onClose();
    }
  }, [handleClose, onClose, isToggleSubscriptionReleasedSuccess]);

  return (
    <Modal
      title="Transfer cluster ownership"
      secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
      width={600}
      variant="large"
      onClose={handleClose}
      primaryText="Initiate transfer"
      secondaryText="Cancel"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={handleClose}
      isPrimaryDisabled={isToggleSubscriptionReleasedPending}
    >
      {isToggleSubscriptionReleasedError ? (
        <ErrorBox
          message="Error initiating transfer"
          response={toggleSubscriptionReleasedError?.error as ErrorState}
        />
      ) : null}
      <TextContent>
        <Text component={TextVariants.p}>
          Transferring cluster ownership will allow another individual to manage this cluster. The
          steps for transferring cluster ownership are:
        </Text>
        {subscription?.status === SubscriptionCommonFieldsStatus.Disconnected ? (
          <TextList component={TextListVariants.ol}>
            <TextListItem>Initiate transfer</TextListItem>
            <TextListItem>
              <ExternalLink href={`${ocmBaseName}/register`}>Register the cluster</ExternalLink>{' '}
              within 5 days
            </TextListItem>
          </TextList>
        ) : (
          <>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Initiate transfer</TextListItem>
              <TextListItem>
                <ExternalLink href={CHANGE_PULL_SECRET_URL}>
                  Change the cluster&apos;s pull secret
                </ExternalLink>{' '}
                within 5 days
              </TextListItem>
            </TextList>
            <Text component={TextVariants.p}>
              The transfer is complete when OpenShift Cluster Manager receives telemetry data from
              the cluster with the new pull secret.
            </Text>
          </>
        )}
        <Text component={TextVariants.h4}>
          If the transfer is not completed within 5 days, the procedure must be restarted.
        </Text>
      </TextContent>
    </Modal>
  );
};

TransferClusterOwnershipDialog.modalName = modals.TRANSFER_CLUSTER_OWNERSHIP;

export default TransferClusterOwnershipDialog;
