import get from 'lodash/get';

import { getDefaultClusterAutoScaling } from '~/components/clusters/common/clusterAutoScalingValues';

export interface FieldDefinition {
  label: string;
  name: string;
  type: 'boolean' | 'number' | 'min-max' | 'time';
  defaultValue: string | boolean | number | undefined;
}

const defaultValues = getDefaultClusterAutoScaling();

const balancerFields: FieldDefinition[] = [
  {
    label: 'log-verbosity',
    name: 'log_verbosity',
    type: 'number',
    defaultValue: defaultValues.log_verbosity,
  },
  {
    label: 'skip-nodes-with-local-storage',
    name: 'skip_nodes_with_local_storage',
    type: 'boolean',
    defaultValue: defaultValues.skip_nodes_with_local_storage,
  },
  {
    label: 'max-pod-grace-period',
    name: 'max_pod_grace_period',
    type: 'number', // expressed in seconds
    defaultValue: defaultValues.max_pod_grace_period,
  },
  {
    label: 'max-node-provision-time',
    name: 'max_node_provision_time',
    type: 'time',
    defaultValue: defaultValues.max_node_provision_time,
  },
  {
    label: 'pod-priority-threshold',
    name: 'pod_priority_threshold',
    type: 'number',
    defaultValue: defaultValues.pod_priority_threshold,
  },
  {
    label: 'ignore-daemonsets-utilization',
    name: 'ignore_daemonsets_utilization',
    type: 'boolean',
    defaultValue: defaultValues.ignore_daemonsets_utilization,
  },
  {
    label: 'balance-similar-node-groups',
    name: 'balance_similar_node_groups',
    type: 'boolean',
    defaultValue: defaultValues.balance_similar_node_groups,
  },
];

const resourceLimitsFields: FieldDefinition[] = [
  {
    label: 'cores-total-min',
    name: 'resource_limits.cores.min',
    type: 'min-max',
    defaultValue: defaultValues.resource_limits.cores.min,
  },
  {
    label: 'cores-total-max',
    name: 'resource_limits.cores.max',
    type: 'min-max',
    defaultValue: defaultValues.resource_limits.cores.max,
  },
  {
    label: 'memory-total-min',
    name: 'resource_limits.memory.min',
    type: 'min-max',
    defaultValue: get(defaultValues, 'resource_limits.memory.min', 0),
  },
  {
    label: 'memory-total-max',
    name: 'resource_limits.memory.max',
    type: 'min-max',
    defaultValue: get(defaultValues, 'resource_limits.memory.max', 0),
  },
];

const scaleDownFields: FieldDefinition[] = [
  {
    label: 'scale-down-enabled',
    name: 'scale_down.enabled',
    type: 'boolean',
    defaultValue: defaultValues.scale_down.enabled,
  },
  {
    label: 'scale-down-utilization-threshold',
    name: 'scale_down.utilization_threshold',
    type: 'number',
    defaultValue: defaultValues.scale_down.utilization_threshold,
  },
  {
    label: 'scale-down-unneeded-time',
    name: 'scale_down.unneeded_time',
    type: 'time',
    defaultValue: defaultValues.scale_down.unneeded_time,
  },
  {
    label: 'scale-down-delay-after-add',
    name: 'scale_down.delay_after_add',
    type: 'time',
    defaultValue: defaultValues.scale_down.delay_after_add,
  },
  {
    label: 'scale-down-delay-after-delete',
    name: 'scale_down.delay_after_delete',
    type: 'time',
    defaultValue: defaultValues.scale_down.delay_after_delete,
  },
  {
    label: 'scale-down-delay-after-failure',
    name: 'scale_down.delay_after_failure',
    type: 'time',
    defaultValue: defaultValues.scale_down.delay_after_failure,
  },
];
export { balancerFields, scaleDownFields, resourceLimitsFields };
