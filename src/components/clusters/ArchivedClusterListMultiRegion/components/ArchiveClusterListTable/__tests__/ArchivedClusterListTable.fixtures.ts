import { SubscriptionCommonFieldsStatus } from '~/types/accounts_mgmt.v1';
import { ClusterWithPermissions } from '~/types/types';

const setSorting = jest.fn();
const openModal = jest.fn();

const clusters: ClusterWithPermissions[] = [
  {
    id: '1HAtguRKqqlQYCSFk14uwMl6g6p',
    name: 'teset-cluster',
    canEdit: true,
    subscription: {
      id: '1HAtdkNPWql68fuOI7Kvuyk4OTp',
      managed: false,
      status: SubscriptionCommonFieldsStatus.Archived,
      provenance: 'Provisioning',
      last_reconcile_date: '0001-01-01T00:00:00Z',
      last_released_at: '0001-01-01T00:00:00Z',
    },
    metrics: {
      arch: '',
      channel_info: '',
      cloud_provider: '',
      cluster_type: '',
      compute_nodes_cpu: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      compute_nodes_memory: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      compute_nodes_sockets: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      console_url: '',
      cpu: {
        used: { value: 0, unit: '' },
        updated_timestamp: '',
        total: { value: 0, unit: '' },
      },
      critical_alerts_firing: 0,
      memory: {
        total: { value: 0, unit: '' },
        updated_timestamp: '',
        used: { value: 0, unit: '' },
      },
      nodes: {
        total: 0,
        master: 0,
        compute: 0,
      },
      non_virt_nodes: 0,
      openshift_version: '',
      operating_system: '',
      operators_condition_failing: 0,
      region: '',
      sockets: {
        total: { value: 0, unit: '' },
        updated_timestamp: '',
        used: { value: 0, unit: '' },
      },
      state: 'N/A',
      state_description: '',
      storage: {
        total: { value: 0, unit: '' },
        updated_timestamp: '',
        used: { value: 0, unit: '' },
      },
      subscription_cpu_total: 0,
      subscription_obligation_exists: 0,
      subscription_socket_total: 0,
      upgrade: { available: false },
    },
  },
];

export { clusters, openModal, setSorting };
