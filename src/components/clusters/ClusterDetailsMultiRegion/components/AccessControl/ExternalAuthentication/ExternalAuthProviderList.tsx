import React from 'react';

import {
  ActionsColumn,
  Caption,
  IAction,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';

import ErrorBox from '~/components/common/ErrorBox';
import { useFetchExternalAuths } from '~/queries/ClusterDetailsQueries/AccessControlTab/ExternalAuthenticationQueries/useFetchExternalAuths';
import type { ExternalAuth } from '~/types/clusters_mgmt.v1';

import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

import { DeleteExternalAuthProviderModal } from './DeleteExternalAuthProviderModal';
import { ExternalAuthProviderModal } from './ExternalAuthProviderModal';

export const ExternalAuthProviderList = ({
  clusterID,
  canUpdateClusterResource,
  region,
}: {
  clusterID: string;
  canUpdateClusterResource: boolean;
  region?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [editProvider, setEditProvider] = React.useState<ExternalAuth | undefined>(undefined);

  const { data: items, isError, error } = useFetchExternalAuths(region, clusterID);

  const handleEdit = (provider: ExternalAuth | undefined) => {
    setIsModalOpen(true);
    setEditProvider(provider);
  };
  const handleDelete = (provider: ExternalAuth | undefined) => {
    setIsDeleteModalOpen(true);
    setEditProvider(provider);
  };
  const columns = { name: 'Name', issuer: 'Issuer URL', audiences: 'Audiences' };
  const defaultActions = (provider: ExternalAuth): IAction[] => [
    {
      title: 'Edit',
      onClick: () => handleEdit(provider),
    },
    {
      title: 'Delete',
      onClick: () => handleDelete(provider),
    },
  ];

  const disableNewProviderReason =
    !canUpdateClusterResource &&
    'You do not have permission to create a new provider for this cluster.';

  return isError ? (
    <ErrorBox
      message="A problem occurred while getting provider"
      response={{
        errorMessage: error.error.errorMessage,
        operationID: error.error.operationID,
      }}
    />
  ) : (
    <>
      {!items?.length ? (
        <ButtonWithTooltip
          className="access-control-add"
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          disableReason={disableNewProviderReason}
        >
          Add external authentication provider
        </ButtonWithTooltip>
      ) : null}

      {isModalOpen ? (
        <ExternalAuthProviderModal
          clusterID={clusterID || ''}
          onClose={() => {
            setIsModalOpen(false);
            setEditProvider(undefined);
          }}
          region={region}
          externalAuthProvider={editProvider}
          isEdit={!!editProvider}
        />
      ) : null}
      {items?.length ? (
        <Table aria-label="External authentication providers table" variant="compact">
          <Caption>External authentication provider</Caption>
          <Thead>
            <Tr>
              <Th>{columns.name}</Th>
              <Th>{columns.issuer}</Th>
              <Th>{columns.audiences}</Th>
              <Th screenReaderText="Action Menu" aria-label="Action Menu" />
            </Tr>
          </Thead>
          <Tbody>
            {items?.map((provider: ExternalAuth) => {
              const rowActions: IAction[] | null = defaultActions(provider);

              return (
                <Tr key={provider.id}>
                  <Td>{provider.id}</Td>
                  <Td>{provider.issuer?.url ?? ''}</Td>
                  <Td>{provider.issuer?.audiences?.join(', ') ?? ''}</Td>
                  <Td isActionCell>
                    {canUpdateClusterResource && <ActionsColumn items={rowActions} />}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : null}
      <DeleteExternalAuthProviderModal
        externalAuthProvider={editProvider ?? undefined}
        clusterId={clusterID || ''}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEditProvider(undefined);
        }}
        region={region}
        isOpen={isDeleteModalOpen}
      />
    </>
  );
};
