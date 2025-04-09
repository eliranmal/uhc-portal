import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Icon,
} from '@patternfly/react-core';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';

import { isCompatibleFeature, SupportedFeature } from '~/common/featureCompatibility';
import clusterStates from '~/components/clusters/common/clusterStates';
import { openModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { useFetchClusterDetails } from '~/queries/ClusterDetailsQueries/useFetchClusterDetails';
import { AUTO_CLUSTER_TRANSFER_OWNERSHIP } from '~/queries/featureGates/featureConstants';
import { useFeatureGate } from '~/queries/featureGates/useFetchFeatureGate';
import { useGlobalState } from '~/redux/hooks';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

export function Owner() {
  const dispatch = useDispatch();

  const params = useParams();

  const { cluster } = useFetchClusterDetails(params.id || '');

  const hasFeatureGate = useFeatureGate(AUTO_CLUSTER_TRANSFER_OWNERSHIP);
  const username = useGlobalState((state) => state.userProfile.keycloakProfile.username);

  const showOwnershipTransfer =
    cluster?.canEdit &&
    cluster?.state === clusterStates.ready &&
    cluster?.subscription?.creator?.username === username &&
    hasFeatureGate &&
    isCompatibleFeature(SupportedFeature.AUTO_CLUSTER_TRANSFER_OWNERSHIP, cluster);
  const disableChangeReason =
    !cluster?.canEdit && 'You do not have permission to transfer ownership.';
  const owner =
    cluster?.subscription?.creator?.name || cluster?.subscription?.creator?.username || 'N/A';
  return (
    <DescriptionListGroup>
      <DescriptionListTerm>Owner</DescriptionListTerm>
      <DescriptionListDescription>
        {showOwnershipTransfer ? (
          <Flex>
            <FlexItem>
              <ButtonWithTooltip
                data-testid="ownerTranswerOverviewLink"
                isDisabled={!cluster?.canEdit}
                variant="link"
                isInline
                onClick={() =>
                  dispatch(
                    openModal(modals.TRANSFER_CLUSTER_OWNERSHIP_AUTO, {
                      subscription: cluster?.subscription,
                    }),
                  )
                }
                disableReason={disableChangeReason}
                isAriaDisabled={!!disableChangeReason}
              >
                {owner}{' '}
                <Icon>
                  <PencilAltIcon color="blue" />
                </Icon>
              </ButtonWithTooltip>
            </FlexItem>
          </Flex>
        ) : (
          owner
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
}
