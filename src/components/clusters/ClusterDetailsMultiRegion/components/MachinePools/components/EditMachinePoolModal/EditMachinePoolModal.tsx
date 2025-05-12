import * as React from 'react';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import isEqual from 'lodash/isEqual';
import { useDispatch } from 'react-redux';

import { Button, ExpandableSection, Form, Stack, StackItem, Tooltip } from '@patternfly/react-core';

import { getErrorMessage } from '~/common/errors';
import getClusterName from '~/common/getClusterName';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { getMaxNodesHCP, getNodeCount } from '~/components/clusters/common/machinePools/utils';
import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { closeModal } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import { useFetchMachineTypes } from '~/queries/ClusterDetailsQueries/MachinePoolTab/MachineTypes/useFetchMachineTypes';
import { useEditCreateMachineOrNodePools } from '~/queries/ClusterDetailsQueries/MachinePoolTab/useEditCreateMachineOrNodePools';
import { useFetchMachineOrNodePools } from '~/queries/ClusterDetailsQueries/MachinePoolTab/useFetchMachineOrNodePools';
import { MAX_NODES_TOTAL_249 } from '~/queries/featureGates/featureConstants';
import { useFeatureGate } from '~/queries/featureGates/useFetchFeatureGate';
import { MachineTypesResponse } from '~/queries/types';
import { useGlobalState } from '~/redux/hooks';
import { MachinePool } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription, ErrorState } from '~/types/types';

import { canUseSpotInstances } from '../../machinePoolsHelper';

import AutoRepairField from './fields/AutoRepairField';
import DiskSizeField from './fields/DiskSizeField';
import useMachinePoolFormik, { EditMachinePoolValues } from './hooks/useMachinePoolFormik';
import EditDetailsSection from './sections/EditDetailsSection';
import EditLabelsSection from './sections/EditLabelsSection';
import EditNodeCountSection from './sections/EditNodeCountSection';
import EditTaintsSection from './sections/EditTaintsSection';
import EditSecurityGroupsSection from './sections/SecurityGroups/EditSecurityGroupsSection';
import SpotInstancesSection from './sections/SpotInstancesSection';

const modalDescription =
  'A machine pool is a group of machines that are all clones of the same configuration, that can be used on demand by an application running on a pod.';

type EditMachinePoolModalProps = {
  cluster: ClusterFromSubscription;
  region?: string;
  onClose: () => void;
  onSave?: () => void;
  machinePoolId?: string;
  isEdit?: boolean;
  shouldDisplayClusterName?: boolean;
  machinePoolsResponse?: MachinePool[];
  machineTypesResponse: MachineTypesResponse;
  isHypershift?: boolean;
  machinePoolsLoading: boolean;
  machinePoolsError: boolean;
  machineTypesLoading: boolean;
  machineTypesError: boolean;
  machinePoolsErrorResponse: Pick<ErrorState, 'errorMessage' | 'errorDetails' | 'operationID'>;
  machineTypesErrorResponse: Pick<ErrorState, 'errorMessage' | 'errorDetails' | 'operationID'>;
};

const EditMachinePoolModal = ({
  cluster,
  region,
  onClose,
  onSave,
  machinePoolId,
  isEdit: isInitEdit,
  machinePoolsResponse,
  machineTypesResponse,
  shouldDisplayClusterName,
  isHypershift,
  machinePoolsLoading,
  machinePoolsError,
  machineTypesLoading,
  machineTypesError,
  machineTypesErrorResponse,
  machinePoolsErrorResponse,
}: EditMachinePoolModalProps) => {
  const getIsEditValue = React.useCallback(
    () => !!isInitEdit || !!machinePoolId,
    [isInitEdit, machinePoolId],
  );

  const clusterName = getClusterName(cluster);
  const [submitError, setSubmitError] = React.useState<AxiosError<any>>();
  const [currentMachinePool, setCurrentMachinePool] = React.useState<MachinePool>();
  const [isEdit, setIsEdit] = React.useState<boolean>(getIsEditValue());
  const { initialValues, validationSchema } = useMachinePoolFormik({
    machinePool: currentMachinePool,
    cluster,
    machinePools: machinePoolsResponse || [],
    machineTypes: machineTypesResponse,
  });

  const allow249NodesOSDCCSROSA = useFeatureGate(MAX_NODES_TOTAL_249);

  const setCurrentMPId = React.useCallback(
    (id: string) => setCurrentMachinePool(machinePoolsResponse?.find((mp) => mp.id === id)),
    [setCurrentMachinePool, machinePoolsResponse],
  );

  React.useEffect(() => {
    if (machinePoolsLoading) {
      setCurrentMachinePool(undefined);
    } else if (machinePoolsResponse?.length) {
      if (machinePoolId) {
        setCurrentMPId(machinePoolId);
      } else if (isEdit) {
        setCurrentMachinePool(machinePoolsResponse[0]);
      }
    }
  }, [machinePoolsLoading, machinePoolsResponse, machinePoolId, isEdit, setCurrentMPId]);

  React.useEffect(() => {
    setIsEdit(getIsEditValue());
  }, [getIsEditValue]);

  // Checks if max nodes amount is reached for add machine pool nodes
  const isMaxReached =
    isHypershift &&
    machinePoolsResponse &&
    getNodeCount(
      machinePoolsResponse,
      isHypershift,
      currentMachinePool?.id,
      currentMachinePool?.instance_type,
    ) === getMaxNodesHCP(cluster.version?.raw_id);

  const { mutateAsync: editCreateMachineOrNodePoolMutation } = useEditCreateMachineOrNodePools(
    isHypershift,
    cluster,
    currentMachinePool,
  );

  return (
    <Formik<EditMachinePoolValues>
      onSubmit={async (values) => {
        setSubmitError(undefined);
        try {
          await editCreateMachineOrNodePoolMutation({
            region,
            values,
            currentMPId: currentMachinePool?.id,
          });
          onSave?.();
          onClose();
        } catch (err) {
          setSubmitError(err as any);
        }
      }}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      validateOnMount
    >
      {({ isValid, submitForm, isSubmitting, values }) => (
        <Modal
          id="edit-mp-modal"
          title={isEdit ? 'Edit machine pool' : 'Add machine pool'}
          secondaryTitle={shouldDisplayClusterName ? clusterName : undefined}
          onClose={isSubmitting ? undefined : onClose}
          isPending={
            machinePoolsLoading ||
            (!machinePoolsError && machinePoolsLoading) ||
            (!machineTypesError && machineTypesLoading) ||
            (isEdit && machineTypesResponse && machinePoolsResponse && !currentMachinePool)
          }
          modalSize="large"
          description={!isEdit && modalDescription}
          footer={
            <Stack hasGutter>
              {submitError && (
                <StackItem>
                  <ErrorBox
                    message={isEdit ? 'Error editing machine pool' : 'Error adding machine pool'}
                    response={{
                      errorDetails: submitError.response?.data?.details,
                      errorMessage: getErrorMessage({ payload: submitError }),
                      operationID: submitError.response?.data.operation_id,
                    }}
                  />
                </StackItem>
              )}

              <StackItem>
                {isMaxReached ? (
                  <Tooltip content="Maximum cluster node count limit reached">
                    <Button
                      isAriaDisabled={isMaxReached || !isValid}
                      isDisabled={
                        isSubmitting ||
                        !machinePoolsResponse ||
                        !machineTypesResponse ||
                        isEqual(initialValues, values)
                      }
                      onClick={submitForm}
                      isLoading={isSubmitting}
                      className="pf-v5-u-mr-md"
                      data-testid="submit-btn"
                    >
                      {isEdit ? 'Save' : 'Add machine pool'}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    isAriaDisabled={isMaxReached}
                    isDisabled={
                      !isValid ||
                      isSubmitting ||
                      !machinePoolsResponse ||
                      !machineTypesResponse ||
                      isEqual(initialValues, values)
                    }
                    onClick={submitForm}
                    isLoading={isSubmitting}
                    className="pf-v5-u-mr-md"
                    data-testid="submit-btn"
                  >
                    {isEdit ? 'Save' : 'Add machine pool'}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  isDisabled={isSubmitting}
                  onClick={onClose}
                  data-testid="cancel-btn"
                >
                  Cancel
                </Button>
              </StackItem>
            </Stack>
          }
        >
          {machinePoolsError || machineTypesError ? (
            <ErrorBox
              message="Failed to fetch resources"
              response={machinePoolsError ? machinePoolsErrorResponse : machineTypesErrorResponse}
            />
          ) : (
            <Form>
              <EditDetailsSection
                cluster={cluster}
                machinePools={machinePoolsResponse || []}
                isEdit={isEdit}
                region={region}
                currentMPId={currentMachinePool?.id}
                setCurrentMPId={setCurrentMPId}
                machineTypesResponse={machineTypesResponse}
                machineTypesLoading={machineTypesLoading}
              />
              <EditNodeCountSection
                cluster={cluster}
                machinePool={currentMachinePool}
                machinePools={machinePoolsResponse || []}
                machineTypes={machineTypesResponse}
                allow249NodesOSDCCSROSA={allow249NodesOSDCCSROSA}
              />
              <AutoRepairField cluster={cluster} />
              <DiskSizeField cluster={cluster} isEdit={isEdit} />
              <ExpandableSection toggleText="Edit node labels and taints">
                <EditLabelsSection />
                <EditTaintsSection
                  cluster={cluster}
                  machinePools={machinePoolsResponse || []}
                  machinePoolId={currentMachinePool?.id}
                  machineTypes={machineTypesResponse}
                />
              </ExpandableSection>
              <EditSecurityGroupsSection cluster={cluster} isReadOnly={isEdit} />
              {canUseSpotInstances(cluster) && <SpotInstancesSection isEdit={isEdit} />}
            </Form>
          )}
        </Modal>
      )}
    </Formik>
  );
};

type ConnectedEditMachinePoolModalProps = {
  clearMachinePools: boolean;
};

export const ConnectedEditMachinePoolModal = ({
  clearMachinePools,
}: ConnectedEditMachinePoolModalProps) => {
  const data = useGlobalState((state) => state.modal.data);
  const dispatch = useDispatch();

  const onModalClose = () => {
    dispatch(closeModal());
  };
  const { cluster, shouldDisplayClusterName } = data as any;
  const hypershiftCluster = isHypershiftCluster(cluster);
  const clusterID = cluster?.id;
  const clusterVersionID = cluster?.version?.id;
  const region = cluster?.subscription?.rh_region_id;

  const {
    data: machineTypes,
    isLoading: isMachineTypesLoading,
    isError: isMachineTypesError,
    error: machineTypesError,
  } = useFetchMachineTypes(region);

  const {
    data: machinePoolData,
    isLoading: isMachinePoolLoading,
    isError: isMachinePoolError,
    error: machinePoolError,
    refetch: machinePoolOrNodePoolsRefetch,
  } = useFetchMachineOrNodePools(clusterID, hypershiftCluster, clusterVersionID, region);

  const isHypershift = isHypershiftCluster(cluster);
  return cluster ? (
    <EditMachinePoolModal
      region={region}
      isHypershift={isHypershift}
      shouldDisplayClusterName={shouldDisplayClusterName}
      cluster={cluster}
      onClose={onModalClose}
      isEdit
      machineTypesResponse={machineTypes}
      machinePoolsResponse={machinePoolData}
      machinePoolsLoading={isMachinePoolLoading}
      machinePoolsError={isMachinePoolError}
      machineTypesLoading={isMachineTypesLoading}
      machineTypesError={isMachineTypesError}
      machinePoolsErrorResponse={machinePoolError.error}
      machineTypesErrorResponse={machineTypesError.error}
      onSave={() => {
        if (!isMachinePoolLoading) {
          machinePoolOrNodePoolsRefetch();
        }
      }}
    />
  ) : null;
};

ConnectedEditMachinePoolModal.modalName = modals.EDIT_MACHINE_POOL;

export default EditMachinePoolModal;
