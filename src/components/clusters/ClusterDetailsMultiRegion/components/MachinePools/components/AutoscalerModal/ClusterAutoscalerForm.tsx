import React from 'react';
import { Formik } from 'formik';

import {
  ClusterAutoScalingForm,
  getClusterAutoScalingSubmitSettings,
  getDefaultClusterAutoScaling,
} from '~/components/clusters/common/clusterAutoScalingValues';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import modals from '~/components/common/Modal/modals';
import { useUpdateClusterAutoscaler } from '~/queries/ClusterDetailsQueries/MachinePoolTab/ClusterAutoscaler/useUpdateClusterAutoscaler';
import { ClusterAutoscalerResponseType } from '~/queries/types';
import { useGlobalState } from '~/redux/hooks';

import { ClusterAutoscalerModal } from './ClusterAutoscalerModal';

// ClusterAutoScalingForm does not remove href and kind fields during runtime
// Needed to reset form and make sure initial values are the same as getDefaultClusterAutoScaling
const transformClusterAutoscalerData = (data: ClusterAutoScalingForm) => ({
  balance_similar_node_groups: data.balance_similar_node_groups,
  balancing_ignored_labels: data.balancing_ignored_labels,
  skip_nodes_with_local_storage: data.skip_nodes_with_local_storage,
  log_verbosity: data.log_verbosity,
  ignore_daemonsets_utilization: data.ignore_daemonsets_utilization,
  max_node_provision_time: data.max_node_provision_time,
  max_pod_grace_period: data.max_pod_grace_period,
  pod_priority_threshold: data.pod_priority_threshold,
  resource_limits: data.resource_limits,
  scale_down: data.scale_down,
});

type ClusterAutoscalerFormProps = {
  hasClusterAutoscaler: boolean;
  clusterId: string;
  isWizard: boolean;
  hasAutoscalingMachinePools: boolean;
  region?: string;
  clusterAutoscalerData: ClusterAutoscalerResponseType;
  isClusterAutoscalerRefetching: boolean;
  maxNodesTotalDefault: number;
};

export const ClusterAutoscalerForm = ({
  hasClusterAutoscaler,
  clusterId,
  isWizard,
  hasAutoscalingMachinePools,
  region,
  clusterAutoscalerData,
  isClusterAutoscalerRefetching,
  maxNodesTotalDefault,
}: ClusterAutoscalerFormProps) => {
  const isOpen = useGlobalState(
    (state) => state.modal.modalName === modals.EDIT_CLUSTER_AUTOSCALING_V2,
  );
  const {
    mutate: mutateUpdateClusterAutoscaler,
    isPending: isUpdateClusterAutoscalerPending,
    isError: isUpdateAutoscalerFormError,
    error: updateAutoscalerFormError,
  } = useUpdateClusterAutoscaler(clusterId, region);

  return (
    <Formik
      enableReinitialize
      validateOnMount
      initialValues={{
        [FieldId.ClusterAutoscaling]: !hasClusterAutoscaler
          ? getDefaultClusterAutoScaling(maxNodesTotalDefault)
          : transformClusterAutoscalerData(clusterAutoscalerData.data),
      }}
      validate={() => {}}
      onSubmit={(values: any) => {
        mutateUpdateClusterAutoscaler(
          getClusterAutoScalingSubmitSettings(values.cluster_autoscaling),
        );
      }}
    >
      {({ dirty, submitForm }) => (
        <ClusterAutoscalerModal
          submitForm={submitForm}
          isUpdateClusterAutoscalerPending={isUpdateClusterAutoscalerPending}
          clusterId={clusterId}
          hasClusterAutoscaler={hasClusterAutoscaler}
          isRosa
          isOpen={isOpen}
          isWizard={isWizard}
          dirty={dirty}
          hasAutoscalingMachinePools={hasAutoscalingMachinePools}
          isClusterAutoscalerRefetching={isClusterAutoscalerRefetching}
          maxNodesTotalDefault={maxNodesTotalDefault}
          isUpdateAutoscalerFormError={isUpdateAutoscalerFormError}
          updateAutoscalerFormError={updateAutoscalerFormError}
        />
      )}
    </Formik>
  );
};
