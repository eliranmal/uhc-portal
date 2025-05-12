import React, { useMemo } from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import {
  ButtonVariant,
  Card,
  CardBody,
  Divider,
  EmptyState,
  Label,
  Skeleton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { cellWidth, expandable } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';

import { noQuotaTooltip } from '~/common/helpers';
import { versionFormatter } from '~/common/versionHelpers';
import { isMultiAZ } from '~/components/clusters/ClusterDetailsMultiRegion/clusterDetailsHelper';
import { getDefaultClusterAutoScaling } from '~/components/clusters/common/clusterAutoScalingValues';
import { LoadingSkeletonCard } from '~/components/clusters/common/LoadingSkeletonCard/LoadingSkeletonCard';
import { MachineConfiguration } from '~/components/clusters/common/MachineConfiguration';
import { MAX_NODES_INSUFFICIEN_VERSION as MAX_NODES_180 } from '~/components/clusters/common/machinePools/constants';
import { getMaxNodesTotalDefaultAutoscaler } from '~/components/clusters/common/machinePools/utils';
import {
  refetchClusterAutoscalerData,
  useFetchClusterAutoscaler,
} from '~/queries/ClusterDetailsQueries/MachinePoolTab/ClusterAutoscaler/useFetchClusterAutoscaler';
import { useFetchMachineTypes } from '~/queries/ClusterDetailsQueries/MachinePoolTab/MachineTypes/useFetchMachineTypes';
import { useDeleteMachinePool } from '~/queries/ClusterDetailsQueries/MachinePoolTab/useDeleteMachinePool';
import { useFetchMachineOrNodePools } from '~/queries/ClusterDetailsQueries/MachinePoolTab/useFetchMachineOrNodePools';
import {
  ENABLE_MACHINE_CONFIGURATION,
  MAX_NODES_TOTAL_249,
} from '~/queries/featureGates/featureConstants';
import { useFeatureGate } from '~/queries/featureGates/useFetchFeatureGate';
import { useGlobalState } from '~/redux/hooks';
import { clusterService } from '~/services';
import { getClusterServiceForRegion } from '~/services/clusterService';

import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import ButtonWithTooltip from '../../../../common/ButtonWithTooltip';
import ErrorBox from '../../../../common/ErrorBox';
import { openModal } from '../../../../common/Modal/ModalActions';
import modals from '../../../../common/Modal/modals';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';
import clusterStates, {
  isAWS,
  isCCS,
  isHibernating,
  isHypershiftCluster,
  isOSD,
  isROSA,
} from '../../../common/clusterStates';

import { ClusterAutoscalerForm } from './components/AutoscalerModal/ClusterAutoscalerForm';
import DeleteMachinePoolModal from './components/DeleteMachinePoolModal/DeleteMachinePoolModal';
import EditMachinePoolModal from './components/EditMachinePoolModal/EditMachinePoolModal';
import MachinePoolExpandedRow from './components/MachinePoolExpandedRow';
import { canMachinePoolBeUpgradedSelector } from './UpdateMachinePools/updateMachinePoolsHelpers';
import MachinePoolNodesSummary from './MachinePoolNodesSummary';
import {
  actionResolver,
  hasDefaultOrExplicitAutoscalingMachinePool,
  hasSubnets,
} from './machinePoolsHelper';
import {
  hasMachinePoolsQuotaSelector,
  hasOrgLevelBypassPIDsLimitCapability,
} from './machinePoolsSelectors';
import {
  UpdateAllMachinePools,
  UpdateMachinePoolModal,
  UpdatePoolButton,
} from './UpdateMachinePools';

import './MachinePools.scss';

const getOpenShiftVersion = (
  machinePool,
  isDisabled,
  isMachinePoolError,
  isHypershift,
  clusterVersionID,
) => {
  const extractedVersion = get(machinePool, 'version.id', '');

  if (!extractedVersion) {
    return 'N/A';
  }
  return (
    <>
      {versionFormatter(extractedVersion) || extractedVersion}{' '}
      {!isDisabled ? (
        <UpdatePoolButton
          machinePool={machinePool}
          isMachinePoolError={isMachinePoolError}
          isHypershift={isHypershift}
          controlPlaneVersion={clusterVersionID}
        />
      ) : null}
    </>
  );
};

const MachinePools = ({ cluster }) => {
  const dispatch = useDispatch();
  const allow249NodesOSDCCSROSA = useFeatureGate(MAX_NODES_TOTAL_249);

  const isDeleteMachinePoolModalOpen = useGlobalState((state) =>
    shouldShowModal(state, modals.DELETE_MACHINE_POOL),
  );
  const isClusterAutoscalingModalOpen = useGlobalState((state) =>
    shouldShowModal(state, modals.EDIT_CLUSTER_AUTOSCALING_V2),
  );

  const clusterUpgradesSchedules = useGlobalState((state) => state.clusterUpgrades.schedules);

  const hasMachineConfiguration = useFeatureGate(ENABLE_MACHINE_CONFIGURATION);
  const organization = useGlobalState((state) => state.userProfile.organization);

  const canBypassPIDsLimit = hasOrgLevelBypassPIDsLimitCapability(organization?.details);
  const isHypershift = isHypershiftCluster(cluster);
  const region = cluster?.subscription?.rh_region_id;
  const clusterID = cluster?.id;
  const clusterVersionID = cluster?.version?.id;
  // Initial state
  const [deletedRowIndex, setDeletedRowIndex] = React.useState(null);
  const [openedRows, setOpenedRows] = React.useState([]);
  const [hideDeleteMachinePoolError, setHideDeleteMachinePoolError] = React.useState(false);
  const [editMachinePoolId, setEditMachinePoolId] = React.useState(undefined);
  const [addMachinePool, setAddMachinePool] = React.useState(false);
  const [showMachinePoolsConfigModal, setShowMachinePoolsConfigModal] = React.useState(false);

  const {
    data: machineTypes,
    isLoading: isMachineTypesLoading,
    isError: isMachineTypesError,
    error: machineTypesError,
    refetch: refetchMachineTypes,
  } = useFetchMachineTypes(region);

  const {
    data: machinePoolData,
    isLoading: isMachinePoolLoading,
    isError: isMachinePoolError,
    error: machinePoolError,
    refetch: machinePoolOrNodePoolsRefetch,
  } = useFetchMachineOrNodePools(clusterID, isHypershift, clusterVersionID, region);

  const {
    data: clusterAutoscalerData,
    isLoading: isClusterAutoscalerLoading,
    hasClusterAutoscaler,
    isStale: isClusterAutoscalerStale,
    isRefetching: isClusterAutoscalerRefetching,
  } = useFetchClusterAutoscaler(clusterID, region);

  const {
    mutate: deleteMachinePoolMutation,
    isPending: isDeleteMachinePoolPending,
    isError: isDeleteMachinePoolError,
    isSuccess: isDeleteMachinePoolSuccess,
    error: deleteMachinePoolError,
  } = useDeleteMachinePool(clusterID, isHypershift, region);

  React.useEffect(() => {
    refetchMachineTypes();
    dispatch(getOrganizationAndQuota());
    // Should run only once on mount and once on unmount
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!isDeleteMachinePoolPending && isDeleteMachinePoolSuccess && !isMachinePoolLoading) {
      dispatch(getOrganizationAndQuota());
      machinePoolOrNodePoolsRefetch();
    }

    if ((isDeleteMachinePoolSuccess || isDeleteMachinePoolError) && deletedRowIndex !== null) {
      setDeletedRowIndex(null);
    }

    if (
      !isHypershiftCluster(cluster) &&
      hasClusterAutoscaler &&
      isClusterAutoscalerStale &&
      !isClusterAutoscalerLoading
    ) {
      refetchClusterAutoscalerData(clusterID);
    }
    // cluster and getOrganizationAndQuota create infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDeleteMachinePoolPending,
    isDeleteMachinePoolError,
    isDeleteMachinePoolSuccess,
    isMachinePoolLoading,
    deletedRowIndex,
    clusterAutoscalerData,
    hasClusterAutoscaler,
    isClusterAutoscalerLoading,
    machinePoolOrNodePoolsRefetch,
    refetchClusterAutoscalerData,
  ]);

  const maxNodesTotalDefault = useMemo(
    () =>
      allow249NodesOSDCCSROSA
        ? getMaxNodesTotalDefaultAutoscaler(cluster.version?.raw_id, cluster.multi_az)
        : MAX_NODES_180,
    [allow249NodesOSDCCSROSA, cluster.version?.raw_id, cluster.multi_az],
  );

  const onCollapse = (event, rowKey, isOpen, rowData) => {
    let rows = [];
    if (isOpen) {
      if (!openedRows.includes(rowData.machinePool.id)) {
        rows.push(rowData.machinePool.id);
        setOpenedRows(rows);
      }
    } else {
      rows = openedRows.filter((machinePoolId) => machinePoolId !== rowData.machinePool.id);
      setOpenedRows(rows);
    }
  };

  const hasMachinePoolsQuota = hasMachinePoolsQuotaSelector(
    organization,
    cluster,
    machineTypes.types,
  );
  const machinePoolsActions = cluster?.machinePoolsActions || {}; // Data not defined on the cluster list response
  const hasMachinePools = !!machinePoolData?.length;
  const isMultiZoneCluster = isMultiAZ(cluster);
  const hasAutoscalingMachinePools = hasDefaultOrExplicitAutoscalingMachinePool(
    cluster,
    machinePoolData,
  );

  const kubeletConfigActions = cluster?.kubeletConfigActions || {}; // Data not defined on the cluster list response
  const isRosa = isROSA(cluster);
  const isOsd = isOSD(cluster);
  const isCcs = isCCS(cluster);
  const isAws = isAWS(cluster);
  const showMachineConfigurationAction =
    hasMachineConfiguration && ((isRosa && !isHypershift) || (isOsd && isCcs && isAws));
  const canEditMachineConfiguration = kubeletConfigActions.create && kubeletConfigActions.update;
  const isMachineConfigurationActionDisabled =
    cluster?.state !== clusterStates.ready || !canEditMachineConfiguration;
  const isMachineConfigurationActionDisabledReason =
    isMachineConfigurationActionDisabled &&
    (!canEditMachineConfiguration
      ? 'You do not have permission to edit the machine configuration. Only cluster owners and cluster editors can edit machine configuration.'
      : 'Machine configuration is only available when the cluster is ready.');

  if (hasMachinePools && machinePoolError?.error) {
    return (
      <EmptyState>
        <ErrorBox message="Error retrieving machine pools" response={machinePoolError.error} />
      </EmptyState>
    );
  }

  const refreshMachinePools = () => {
    if (!isMachinePoolLoading) {
      machinePoolOrNodePoolsRefetch();
    }
  };

  const columns = [
    { title: 'Machine pool', cellFormatters: [expandable] },
    { title: 'Instance type' },
    { title: 'Availability zones', transforms: [cellWidth(15)] },
  ];
  columns.push({ title: 'Node count' });
  columns.push({ title: 'Autoscaling', transforms: [cellWidth(15)] });
  if (isHypershift) {
    columns.push({ title: 'Version', transforms: [cellWidth(15)] });
  }

  const isReadOnly = cluster?.status?.configuration_mode === 'read_only';
  const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
  const quotaReason = !hasMachinePoolsQuota && noQuotaTooltip;
  const hibernatingReason =
    isHibernating(cluster) && 'This operation is not available while cluster is hibernating';
  // Workaround until these are fixed, once fixed revert changes:
  // https://issues.redhat.com/browse/OCMUI-1221
  // https://issues.redhat.com/browse/OCM-5468
  const canNotCreateOrEditReason =
    !machinePoolsActions.update &&
    'You do not have permission to add or edit machine pools. Only cluster owners, cluster editors, machine pool editors and Organization Administrators can edit machine pools.';

  const canNotEditAutoscalerReason =
    (!cluster?.canEditClusterAutoscaler &&
      'You do not have permission to edit the cluster autoscaler.') ||
    (hasClusterAutoscaler && isClusterAutoscalerLoading && 'The cluster autoscaler is loading.');

  const tableActionsDisabled = !!(readOnlyReason || hibernatingReason || canNotCreateOrEditReason);

  const getMachinePoolRow = (isExpandableRow, machinePool = {}) => {
    const cells = [
      machinePool.id,
      {
        title: (
          <>
            {isHypershift ? machinePool.aws_node_pool?.instance_type : machinePool.instance_type}
            {machinePool.aws?.spot_market_options && (
              <Label variant="outline" className="ocm-c-machine-pools__spot-label">
                Spot
              </Label>
            )}
          </>
        ),
      },
      machinePool.availability_zones?.join(', ') || machinePool.availability_zone,
      {
        title: (
          <MachinePoolNodesSummary
            isMultiZoneCluster={isMultiZoneCluster}
            machinePool={machinePool}
          />
        ),
      },

      {
        title: machinePool.autoscaling ? 'Enabled' : 'Disabled',
      },
      isHypershift
        ? {
            title: getOpenShiftVersion(
              machinePool,
              tableActionsDisabled,
              isMachinePoolError,
              isHypershift,
              clusterVersionID,
            ),
          }
        : null,
    ].filter((column) => column !== null);

    const row = {
      cells,
      key: machinePool.id,
      machinePool,
    };
    if (isExpandableRow) {
      row.isOpen = openedRows.includes(machinePool.id);
    }
    return row;
  };

  const getExpandableRow = (machinePool, parentIndex) => ({
    parent: parentIndex,
    fullWidth: true,
    cells: [
      {
        title: (
          <MachinePoolExpandedRow
            region={region}
            cluster={cluster}
            isMultiZoneCluster={isMultiZoneCluster}
            machinePool={machinePool}
          />
        ),
      },
    ],
    key: `${machinePool.id}-child`,
  });

  // row is expandable if there are extra details to show
  const isExpandable = (machinePool = {}) =>
    !isEmpty(machinePool.labels) ||
    machinePool.taints?.length > 0 ||
    machinePool.autoscaling ||
    machinePool.aws ||
    hasSubnets(machinePool);

  const rows = [];

  // set all other machine pools rows
  machinePoolData?.forEach((machinePool) => {
    const isExpandableRow = isExpandable(machinePool);
    const machinePoolRow = getMachinePoolRow(isExpandableRow, machinePool);

    rows.push(machinePoolRow);

    if (isExpandableRow) {
      const expandableRow = getExpandableRow(machinePool, rows.length - 1);
      rows.push(expandableRow);
    }
  });

  const performDeleteAction = async (rowID, rowData) => {
    if (isDeleteMachinePoolError) {
      setHideDeleteMachinePoolError(false);
    }

    setDeletedRowIndex(rowID);
    setOpenedRows(openedRows?.filter((machinePoolId) => machinePoolId !== rowData.machinePool.id));
    deleteMachinePoolMutation(rowData.machinePool.id);
  };

  const onClickDeleteAction = (_, rowID, rowData) => {
    dispatch(
      openModal(modals.DELETE_MACHINE_POOL, {
        machinePool: rowData.machinePool,
        performDeleteAction: () => performDeleteAction(rowID, rowData),
      }),
    );
  };

  const onClickEdit = (_, __, rowData) => setEditMachinePoolId(rowData.machinePool.id);

  const onClickUpdateAction = (_, __, rowData) =>
    dispatch(
      openModal(modals.UPDATE_MACHINE_POOL_VERSION, {
        machinePool: rowData.machinePool,
      }),
    );

  const showSkeleton = !hasMachinePools && isMachinePoolLoading;

  const skeletonRow = {
    cells: [
      {
        props: { colSpan: 4 },
        title: <Skeleton fontSize="lg" screenreaderText="Loading..." />,
      },
    ],
  };

  if (hasMachinePools && isMachinePoolLoading && deletedRowIndex === null) {
    rows.push(skeletonRow);
  }

  if (hasMachinePools && deletedRowIndex !== null) {
    // when deleting a row check if the row is expandable
    if (rows[deletedRowIndex + 1]?.parent) {
      // remove the child row
      rows.splice(deletedRowIndex + 1, 1);
    }
    rows[deletedRowIndex] = skeletonRow;
  }
  const openAutoScalingModal = () => dispatch(openModal(modals.EDIT_CLUSTER_AUTOSCALING_V2));
  const initialValues = getDefaultClusterAutoScaling(maxNodesTotalDefault);

  return (
    <>
      {showSkeleton ? (
        <LoadingSkeletonCard />
      ) : (
        <>
          {!tableActionsDisabled && (
            <UpdateAllMachinePools
              isMachinePoolError={isMachinePoolError}
              clusterId={clusterID}
              isHypershift={isHypershift}
              controlPlaneVersion={clusterVersionID}
              machinePoolData={machinePoolData}
              region={region}
              refreshMachinePools={refreshMachinePools}
            />
          )}
          <Card className="ocm-c-machine-pools__card">
            <CardBody className="ocm-c-machine-pools__card--body">
              {isMachinePoolError && (
                <ErrorBox message="Error retrieving machine pools" response={machinePoolError} />
              )}
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <ButtonWithTooltip
                      disableReason={
                        readOnlyReason ||
                        hibernatingReason ||
                        canNotCreateOrEditReason ||
                        quotaReason
                      }
                      id="add-machine-pool"
                      onClick={() => setAddMachinePool(true)}
                      variant={ButtonVariant.secondary}
                    >
                      Add machine pool
                    </ButtonWithTooltip>
                  </ToolbarItem>
                  {!isHypershift && (
                    <ToolbarItem>
                      <ButtonWithTooltip
                        id="edit-existing-cluster-autoscaling"
                        disableReason={
                          readOnlyReason || hibernatingReason || canNotEditAutoscalerReason
                        }
                        onClick={() => openAutoScalingModal()}
                        variant={ButtonVariant.secondary}
                      >
                        Edit cluster autoscaling
                      </ButtonWithTooltip>
                    </ToolbarItem>
                  )}
                  {showMachineConfigurationAction && (
                    <ToolbarItem>
                      <ButtonWithTooltip
                        disableReason={isMachineConfigurationActionDisabledReason}
                        onClick={() => setShowMachinePoolsConfigModal(true)}
                        variant={ButtonVariant.secondary}
                      >
                        Edit machine configuration
                      </ButtonWithTooltip>
                    </ToolbarItem>
                  )}
                </ToolbarContent>
              </Toolbar>
              <Divider />
              {isDeleteMachinePoolError && !hideDeleteMachinePoolError && (
                <ErrorBox
                  message="Error deleting machine pool"
                  response={deleteMachinePoolError?.error}
                  showCloseBtn
                  onCloseAlert={() => setHideDeleteMachinePoolError(true)}
                />
              )}
              {machinePoolsActions.list && (
                <TableDeprecated
                  aria-label="Machine pools"
                  cells={columns}
                  rows={rows}
                  onCollapse={onCollapse}
                  actionResolver={(rowData) =>
                    actionResolver({
                      rowData,
                      onClickDelete: onClickDeleteAction,
                      onClickUpdate: canMachinePoolBeUpgradedSelector(
                        clusterUpgradesSchedules,
                        cluster?.version?.id || '',
                        rowData.machinePool,
                        isMachinePoolError,
                        isHypershift,
                      )
                        ? onClickUpdateAction
                        : undefined,
                      canDelete: machinePoolsActions.delete,
                      cluster,
                      machinePools: machinePoolData,
                      machineTypes,
                      onClickEdit,
                    })
                  }
                  areActionsDisabled={() => tableActionsDisabled}
                >
                  <TableHeaderDeprecated />
                  <TableBodyDeprecated />
                </TableDeprecated>
              )}
            </CardBody>
          </Card>
        </>
      )}
      {isDeleteMachinePoolModalOpen && <DeleteMachinePoolModal />}
      {(!!editMachinePoolId || addMachinePool) && (
        <EditMachinePoolModal
          region={region}
          cluster={cluster}
          onSave={refreshMachinePools}
          onClose={() => {
            setEditMachinePoolId(undefined);
            setAddMachinePool(false);
          }}
          isHypershift={isHypershift}
          machinePoolId={editMachinePoolId}
          machinePoolsResponse={machinePoolData}
          machinePoolsLoading={isMachinePoolLoading}
          machinePoolsError={isMachinePoolError}
          machinePoolsErrorResponse={machinePoolError}
          machineTypesResponse={machineTypes}
          machineTypesLoading={isMachineTypesLoading}
          machineTypesError={isMachineTypesError}
          machineTypesErrorResponse={machineTypesError}
        />
      )}
      <UpdateMachinePoolModal
        isHypershift={isHypershift}
        clusterId={clusterID}
        refreshMachinePools={refreshMachinePools}
        controlPlaneVersion={clusterVersionID}
        region={region}
      />
      {isClusterAutoscalingModalOpen && (
        <ClusterAutoscalerForm
          clusterAutoscalerData={clusterAutoscalerData}
          hasClusterAutoscaler={hasClusterAutoscaler}
          clusterId={clusterID}
          initialValues={initialValues}
          isWizard={false}
          hasAutoscalingMachinePools={hasAutoscalingMachinePools}
          isClusterAutoscalerRefetching={isClusterAutoscalerRefetching}
          maxNodesTotalDefault={maxNodesTotalDefault}
        />
      )}
      {showMachinePoolsConfigModal && (
        <MachineConfiguration
          clusterID={cluster.id}
          getMachineConfiguration={
            region
              ? getClusterServiceForRegion(region).getKubeletConfiguration
              : clusterService.getKubeletConfiguration
          }
          createMachineConfiguration={
            region
              ? getClusterServiceForRegion(region).postKubeletConfiguration
              : clusterService.postKubeletConfiguration
          }
          updateMachineConfiguration={
            region
              ? getClusterServiceForRegion(region).patchKubeletConfiguration
              : clusterService.patchKubeletConfiguration
          }
          onClose={() => setShowMachinePoolsConfigModal(false)}
          canBypassPIDsLimit={canBypassPIDsLimit}
        />
      )}
    </>
  );
};

MachinePools.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default MachinePools;
