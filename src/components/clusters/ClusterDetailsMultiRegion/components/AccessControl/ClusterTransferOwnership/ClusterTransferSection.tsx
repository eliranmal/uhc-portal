import React from 'react';
import { useDispatch } from 'react-redux';

import { Alert, Card, CardBody, Flex, FlexItem, Title } from '@patternfly/react-core';

import ButtonWithTooltip from '~/components/common/ButtonWithTooltip';
import ErrorBox from '~/components/common/ErrorBox';
import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { useFetchClusterTransfer } from '~/queries/ClusterDetailsQueries/AccessControlTab/ClusterTransferOwnership/useFetchClusterTransfer';
import { useGlobalState } from '~/redux/hooks';
import { ClusterTransferStatus, Subscription } from '~/types/accounts_mgmt.v1';
import { ErrorState } from '~/types/types';

import { CancelClusterTransferModal } from './CancelClusterTransferModal';
import { TransferDetails } from './TransferDetails';

type ClusterTransferSectionProps = {
  clusterExternalID: string;
  subscription: Subscription;
  canEdit: boolean;
};

export const ClusterTransferSection = ({
  clusterExternalID,
  subscription,
  canEdit,
}: ClusterTransferSectionProps) => {
  const { data, isLoading, isError, error } = useFetchClusterTransfer({
    clusterExternalID,
    showPendingTransfer: true,
  });
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const transfer = data?.items?.[0] || {};
  const isTransferPending = transfer.status === ClusterTransferStatus.Pending.toLowerCase();
  const username = useGlobalState((state) => state.userProfile.keycloakProfile.username);

  const disableCancelReason =
    (!canEdit || subscription?.creator?.username !== username) &&
    'You do not have permission to cancel transfer.';
  const disableInitiateReason =
    (!canEdit || subscription?.creator?.username !== username) &&
    'You do not have permission to initiate transfer.';

  return (
    <>
      <Card>
        <CardBody>
          <Title className="card-title" headingLevel="h3" size="lg">
            Transfer ownership
          </Title>
          <p>
            Transferring cluster ownership allows another individual in the same or a different
            organization to manage this cluster.
          </p>
          <br />

          {isTransferPending && (
            <Alert variant="info" title="Cluster ownership transfer pending">
              <p>
                The ownership transfer process will be completed once the request is approved. You
                can cancel this process at any time. Actions on the cluster are disabled while the
                transfer is pending.
              </p>
            </Alert>
          )}
        </CardBody>
        <CardBody>
          {isError && (
            <ErrorBox
              message="A problem occurred while transfering cluster ownership"
              response={error?.error as ErrorState}
            />
          )}
          {isLoading ? <p>Loading...</p> : null}
          {transfer?.id && (
            <>
              <Title className="card-title" headingLevel="h3" size="lg">
                Transfer details
              </Title>
              <br />
              <TransferDetails transfer={transfer} />
            </>
          )}
        </CardBody>
        {!transfer?.id && (
          <CardBody>
            <Flex>
              <FlexItem>
                <ButtonWithTooltip
                  variant="primary"
                  onClick={() =>
                    dispatch(
                      openModal(modals.TRANSFER_CLUSTER_OWNERSHIP_AUTO, {
                        subscription,
                      }),
                    )
                  }
                  disableReason={disableInitiateReason}
                  isAriaDisabled={!!disableInitiateReason}
                >
                  Initiate transfer
                </ButtonWithTooltip>
              </FlexItem>
            </Flex>
          </CardBody>
        )}
        {isTransferPending && (
          <CardBody>
            <Flex>
              <FlexItem>
                <ButtonWithTooltip
                  variant="primary"
                  onClick={() => setIsCancelModalOpen(true)}
                  disableReason={disableCancelReason}
                  isAriaDisabled={!!disableCancelReason}
                >
                  Cancel transfer
                </ButtonWithTooltip>
              </FlexItem>
            </Flex>
          </CardBody>
        )}
      </Card>
      {isCancelModalOpen && (
        <CancelClusterTransferModal
          transferId={transfer.id || ''}
          onClose={() => {
            setIsCancelModalOpen(false);
          }}
        />
      )}
    </>
  );
};
