import { getClusterAcks } from '../UpgradeAcknowledgeHelpers';

const mockGCPCluster = {
  kind: 'Cluster',
  id: '2h9luc0gq0ndb59258q77lr1pmon1j4j',
  href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j',
  name: 'fake-gcp-wif',
  domain_prefix: 'fake-gcp-wif',
  external_id: 'fake-cluster-b5ceeb7c-1b14-4fe5-860e-d6a7d68ab04f',
  infra_id: 'fake-infra-id',
  display_name: 'fake-gcp-wif',
  creation_timestamp: '2025-03-03T13:23:09.271425Z',
  activity_timestamp: '2025-03-03T13:23:09.271425Z',
  expiration_timestamp: '2025-03-05T01:22:58.197216Z',
  cloud_provider: {
    kind: 'CloudProviderLink',
    id: 'gcp',
    href: '/api/clusters_mgmt/v1/cloud_providers/gcp',
  },
  subscription: {
    billing_expiration_date: '0001-01-01T00:00:00Z',
    capabilities: [
      {
        inherited: true,
        name: 'capability.cluster.enable_access_protection',
        value: 'true',
      },
      {
        inherited: true,
        name: 'capability.cluster.subscribed_ocp',
        value: 'true',
      },
      {
        inherited: true,
        name: 'capability.cluster.autoscale_clusters',
        value: 'true',
      },
    ],
    cloud_account_id: 'ocm-ui-dev',
    cloud_provider_id: 'gcp',
    cluster_billing_model: 'standard',
    cluster_id: '2h9luc0gq0ndb59258q77lr1pmon1j4j',
    created_at: '2025-03-03T13:23:08.853988Z',
    creator: {
      email: '***REMOVED***',
      first_name: 'Elizabeta',
      href: '/api/accounts_mgmt/v1/accounts/2K89szemF25dKqb0w16cdfucF92',
      id: '2K89szemF25dKqb0w16cdfucF92',
      kind: 'Account',
      last_name: 'Gilman',
      name: 'Elizabeta Gilman',
      username: 'egilman-ocm',
    },
    display_name: 'fake-gcp-wif',
    eval_expiration_date: '0001-01-01T00:00:00Z',
    href: '/api/accounts_mgmt/v1/subscriptions/2toAjUzoKUv8lkRy69yMfFiWn6y',
    id: '2toAjUzoKUv8lkRy69yMfFiWn6y',
    kind: 'Subscription',
    last_reconcile_date: '0001-01-01T00:00:00Z',
    last_released_at: '0001-01-01T00:00:00Z',
    last_telemetry_date: '0001-01-01T00:00:00Z',
    managed: true,
    organization: {
      created_at: '2021-08-18T17:39:22.305773Z',
      ebs_account_id: '7321618',
      external_id: '15212158',
      href: '/api/accounts_mgmt/v1/organizations/1wuVGGV6SCmD8ya6yRGEJzvmVuC',
      id: '1wuVGGV6SCmD8ya6yRGEJzvmVuC',
      kind: 'Organization',
      name: 'Red Hat, Inc.',
      updated_at: '2025-03-03T08:16:02.719324Z',
    },
    organization_id: '1wuVGGV6SCmD8ya6yRGEJzvmVuC',
    plan: {
      id: 'OSD',
      type: 'OSD',
    },
    provenance: 'Provisioning',
    status: 'Reserved',
    support_level: 'Premium',
    trial_end_date: '0001-01-01T00:00:00Z',
    updated_at: '2025-03-03T13:23:08.853988Z',
  },
  region: {
    kind: 'CloudRegionLink',
    id: 'us-east1',
    href: '/api/clusters_mgmt/v1/cloud_providers/gcp/regions/us-east1',
  },
  console: {
    url: 'https://https://example.com/veryfakewebconsole',
  },
  api: {
    url: 'https://example.com/veryfakeapi',
    listening: 'external',
  },
  nodes: {
    master: 3,
    infra: 2,
    compute: 2,
    availability_zones: ['us-east1-b'],
    compute_machine_type: {
      kind: 'MachineTypeLink',
      id: 'n2-standard-4',
      href: '/api/clusters_mgmt/v1/machine_types/n2-standard-4',
    },
    infra_machine_type: {
      kind: 'MachineTypeLink',
      id: 'n2-highmem-4',
      href: '/api/clusters_mgmt/v1/machine_types/n2-highmem-4',
    },
  },
  state: 'ready',
  flavour: {
    kind: 'FlavourLink',
    id: 'osd-4',
    href: '/api/clusters_mgmt/v1/flavours/osd-4',
  },
  groups: {
    kind: 'GroupListLink',
    href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/groups',
  },
  properties: {
    fake_cluster: 'true',
  },
  gcp: {
    project_id: 'ocm-ui-dev',
    security: {
      secure_boot: false,
    },
    authentication: {
      kind: 'WifConfig',
      id: '2g6lbq1di4s9q3b6hoimg5p7auvk9crc',
      href: '/api/clusters_mgmt/v1/gcp/wif_configs/2g6lbq1di4s9q3b6hoimg5p7auvk9crc',
    },
  },
  dns: {
    base_domain: 'wgvm.s2.devshift.org',
  },
  network: {
    type: 'OVNKubernetes',
    machine_cidr: '10.0.0.0/16',
    service_cidr: '172.30.0.0/16',
    pod_cidr: '10.128.0.0/14',
    host_prefix: 23,
  },
  external_configuration: {
    kind: 'ExternalConfiguration',
    href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/external_configuration',
    syncsets: {
      kind: 'SyncsetListLink',
      href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/external_configuration/syncsets',
    },
    labels: {
      kind: 'LabelListLink',
      href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/external_configuration/labels',
    },
    manifests: {
      kind: 'ManifestListLink',
      href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/external_configuration/manifests',
    },
  },
  multi_az: false,
  managed: true,
  ccs: {
    enabled: true,
    disable_scp_checks: false,
  },
  version: {
    kind: 'Version',
    id: 'openshift-v4.17.19-candidate',
    href: '/api/clusters_mgmt/v1/versions/openshift-v4.17.19-candidate',
    raw_id: '4.17.19',
    channel_group: 'candidate',
    available_upgrades: ['4.18.2'],
    end_of_life_timestamp: '2026-02-14T00:00:00Z',
  },
  identity_providers: {
    kind: 'IdentityProviderListLink',
    href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/identity_providers',
  },
  ingresses: {
    kind: 'IngressListLink',
    href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/ingresses',
  },
  machine_pools: {
    kind: 'MachinePoolListLink',
    href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/machine_pools',
  },
  inflight_checks: [],
  product: {
    id: 'OSD',
  },
  status: {
    state: 'ready',
    dns_ready: true,
    oidc_ready: false,
    provision_error_message: '',
    provision_error_code: '',
    configuration_mode: 'full',
    limited_support_reason_count: 0,
  },
  node_drain_grace_period: {
    value: 60,
    unit: 'minutes',
  },
  etcd_encryption: false,
  billing_model: 'standard',
  disable_user_workload_monitoring: false,
  managed_service: {
    enabled: false,
    managed: false,
  },
  hypershift: {
    enabled: false,
  },
  byo_oidc: {
    enabled: false,
  },
  delete_protection: {
    href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/delete_protection',
    enabled: false,
  },
  external_auth_config: {
    kind: 'ExternalAuthConfig',
    href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/external_auth_config',
    enabled: false,
    external_auths: {
      href: '/api/clusters_mgmt/v1/clusters/2h9luc0gq0ndb59258q77lr1pmon1j4j/external_auth_config/external_auths',
    },
  },
  multi_arch_enabled: false,
  metrics: {
    memory: {
      used: {
        value: 0,
        unit: 'B',
      },
      total: {
        value: 0,
        unit: 'B',
      },
      updated_timestamp: '',
    },
    cpu: {
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 0,
        unit: '',
      },
      updated_timestamp: '',
    },
    storage: {
      used: {
        value: 0,
        unit: 'B',
      },
      total: {
        value: 0,
        unit: 'B',
      },
      updated_timestamp: '',
    },
    nodes: {
      total: 0,
      master: 0,
      compute: 0,
    },
    state: 'N/A',
    upgrade: {
      available: false,
    },
    cloud_provider: '',
    cluster_type: '',
    compute_nodes_cpu: {
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 0,
        unit: '',
      },
      updated_timestamp: '',
    },
    compute_nodes_memory: {
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 0,
        unit: '',
      },
      updated_timestamp: '',
    },
    compute_nodes_sockets: {
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 0,
        unit: '',
      },
      updated_timestamp: '',
    },
    console_url: '',
    critical_alerts_firing: 0,
    non_virt_nodes: 0,
    openshift_version: '',
    operating_system: '',
    operators_condition_failing: 0,
    region: '',
    sockets: {
      used: {
        value: 0,
        unit: '',
      },
      total: {
        value: 0,
        unit: '',
      },
      updated_timestamp: '',
    },
    state_description: '',
    subscription_cpu_total: 0,
    subscription_obligation_exists: 0,
    subscription_socket_total: 0,
  },
  upgradeGates: [],
  limitedSupportReasons: [],
  canEdit: true,
  canEditOCMRoles: true,
  canViewOCMRoles: true,
  canUpdateClusterResource: true,
  canEditClusterAutoscaler: true,
  idpActions: {
    create: true,
    update: true,
    get: true,
    list: true,
    delete: true,
  },
  machinePoolsActions: {
    create: true,
    update: true,
    get: true,
    list: true,
    delete: true,
  },
  kubeletConfigActions: {
    create: true,
    update: true,
    get: true,
    list: true,
    delete: true,
  },
  canDelete: true,
  wifConfigName: 're-wif-13',
};

const mockGates = [
  {
    kind: 'VersionGate',
    id: '3c812985-ac36-11ee-afb8-0a580a83181f',
    href: '/api/clusters_mgmt/v1/version_gates/3c812985-ac36-11ee-afb8-0a580a83181f',
    version_raw_id_prefix: '4.15',
    label: 'api.openshift.com/gate-sts',
    value: '4.15',
    warning_message:
      'STS roles must be updated with 4.15 permissions before the cluster can be updated to OpenShift 4.15. Failure to update the roles before cluster update will cause cluster control plane degradation.',
    description:
      'OpenShift STS clusters include new required cloud provider permissions in OpenShift 4.15.',
    documentation_url: 'https://access.redhat.com/solutions/6808671',
    sts_only: true,
    cluster_condition: '',
    creation_timestamp: '2024-01-06T01:52:23.837326Z',
  },
  {
    kind: 'VersionGate',
    id: '4b6136f6-46c2-11ee-ae96-0a580a821aab',
    href: '/api/clusters_mgmt/v1/version_gates/4b6136f6-46c2-11ee-ae96-0a580a821aab',
    version_raw_id_prefix: '4.14',
    label: 'api.openshift.com/gate-ingress',
    value: '4.14',
    warning_message:
      'In version 4.14 of OSD/ROSA, we are changing how we manage Ingress Controllers. If you are using additional non-default Ingresses, or Custom Domains, your cluster may be affected.',
    description: 'Upgrade to 4.14 may affect additional Ingress behaviour.',
    documentation_url: 'https://access.redhat.com/node/7028653',
    sts_only: false,
    cluster_condition: '',
    creation_timestamp: '2023-08-29T23:17:59.732608Z',
  },
  {
    kind: 'VersionGate',
    id: '596326fb-d1ea-11ed-9f29-0a580a8312f9',
    href: '/api/clusters_mgmt/v1/version_gates/596326fb-d1ea-11ed-9f29-0a580a8312f9',
    version_raw_id_prefix: '4.13',
    label: 'api.openshift.com/gate-sts',
    value: '4.13',
    warning_message:
      'STS roles must be updated with 4.13 permissions before the cluster can be updated to OpenShift 4.13. Failure to update the roles before cluster update will cause cluster control plane degradation.',
    description:
      'OpenShift STS clusters include new required cloud provider permissions in OpenShift 4.13.',
    documentation_url: 'https://access.redhat.com/solutions/7005463',
    sts_only: true,
    cluster_condition: '',
    creation_timestamp: '2023-04-03T06:39:57.057613Z',
  },
  {
    kind: 'VersionGate',
    id: '81c07dbd-57cf-11ee-949e-0a580a800925',
    href: '/api/clusters_mgmt/v1/version_gates/81c07dbd-57cf-11ee-949e-0a580a800925',
    version_raw_id_prefix: '4.14',
    label: 'api.openshift.com/gate-sts',
    value: '4.14',
    warning_message:
      'STS roles must be updated with 4.14 permissions before the cluster can be updated to OpenShift 4.14. Failure to update the roles before cluster update will cause cluster control plane degradation.',
    description:
      'OpenShift STS clusters include new required cloud provider permissions in OpenShift 4.14.',
    documentation_url: 'https://access.redhat.com/solutions/6808671',
    sts_only: true,
    cluster_condition: '',
    creation_timestamp: '2023-09-20T16:05:24.178682Z',
  },
  {
    kind: 'VersionGate',
    id: '86b27fae-d1ea-11ed-9f29-0a580a8312f9',
    href: '/api/clusters_mgmt/v1/version_gates/86b27fae-d1ea-11ed-9f29-0a580a8312f9',
    version_raw_id_prefix: '4.13',
    label: 'api.openshift.com/gate-ocp',
    value: '4.13',
    warning_message:
      'To prevent an outage on your cluster, review any APIs in use that will be removed, and migrate them to the appropriate new API version. Failure to evaluate and migrate components affected by this update can cause some types of workloads to stop functioning.',
    description: 'OpenShift removes several Kubernetes APIs in OpenShift 4.13.',
    documentation_url: 'https://access.redhat.com/solutions/7005465',
    sts_only: false,
    cluster_condition: '',
    creation_timestamp: '2023-04-03T06:41:13.07509Z',
  },
  {
    kind: 'VersionGate',
    id: '8f669a07-1cb4-11ed-a47b-0a580a830836',
    href: '/api/clusters_mgmt/v1/version_gates/8f669a07-1cb4-11ed-a47b-0a580a830836',
    version_raw_id_prefix: '4.11',
    label: 'api.openshift.com/gate-sts',
    value: '4.11',
    warning_message:
      'STS roles must be updated with 4.11 permissions before the cluster can be updated to OpenShift 4.11. Failure to update the roles before cluster update will cause cluster control plane degradation.',
    description:
      'OpenShift STS clusters include new required cloud provider permissions in OpenShift 4.11.',
    documentation_url: 'https://access.redhat.com/solutions/6808671',
    sts_only: true,
    cluster_condition: '',
    creation_timestamp: '2022-08-15T16:08:54.391042Z',
  },
  {
    kind: 'VersionGate',
    id: '9f2d78a1-57d0-11ee-949e-0a580a800925',
    href: '/api/clusters_mgmt/v1/version_gates/9f2d78a1-57d0-11ee-949e-0a580a800925',
    version_raw_id_prefix: '4.14',
    label: 'api.openshift.com/gate-ocp',
    value: '4.14',
    warning_message:
      'To prevent an outage on your cluster, review any APIs in use that will be removed, and migrate them to the appropriate new API version. Failure to evaluate and migrate components affected by this update can cause some types of workloads to stop functioning.',
    description: 'OpenShift removes several Kubernetes APIs in OpenShift 4.14.',
    documentation_url: 'https://access.redhat.com/articles/6958395',
    sts_only: false,
    cluster_condition: '',
    creation_timestamp: '2023-09-20T16:13:23.04355Z',
  },
  {
    kind: 'VersionGate',
    id: 'd6015d79-98a2-11ec-a445-0a580a820d8e',
    href: '/api/clusters_mgmt/v1/version_gates/d6015d79-98a2-11ec-a445-0a580a820d8e',
    version_raw_id_prefix: '4.9',
    label: 'api.openshift.com/gate-ocp',
    value: '4.9',
    warning_message:
      'To prevent an outage on your cluster, review any APIs in use that will be removed, and migrate them to the appropriate new API version. Failure to evaluate and migrate components affected by this update can cause some types of workloads to stop functioning.',
    description: 'OpenShift removes several Kubernetes APIs in OpenShift 4.9.',
    documentation_url: 'https://access.redhat.com/solutions/6657541',
    sts_only: false,
    cluster_condition: '',
    creation_timestamp: '2022-02-28T14:29:28.418035Z',
  },
  {
    kind: 'VersionGate',
    id: 'e4dda6cd-7020-11ed-8152-0a580a810441',
    href: '/api/clusters_mgmt/v1/version_gates/e4dda6cd-7020-11ed-8152-0a580a810441',
    version_raw_id_prefix: '4.12',
    label: 'api.openshift.com/gate-sts',
    value: '4.12',
    warning_message:
      'STS roles must be updated with 4.12 permissions before the cluster can be updated to OpenShift 4.12. Failure to update the roles before cluster update will cause cluster control plane degradation.',
    description:
      'OpenShift STS clusters include new required cloud provider permissions in OpenShift 4.12.',
    documentation_url: 'https://access.redhat.com/solutions/6988198',
    sts_only: true,
    cluster_condition: '',
    creation_timestamp: '2022-11-29T20:03:29.934921Z',
  },
  {
    kind: 'VersionGate',
    id: 'e4e534f0-1f07-11ef-a973-0a580a81063b',
    href: '/api/clusters_mgmt/v1/version_gates/e4e534f0-1f07-11ef-a973-0a580a81063b',
    version_raw_id_prefix: '4.16',
    label: 'api.openshift.com/gate-ocp',
    value: '4.16',
    warning_message:
      'To prevent an outage on your cluster, review any APIs in use that will be removed, and migrate them to the appropriate new API version. Failure to evaluate and migrate components affected by this update can cause some types of workloads to stop functioning.',
    description:
      'OpenShift removes several Kubernetes APIs, including flowschemas (flowcontrol.apiserver.k8s.io/v1beta2) and prioritylevelconfigurations (flowcontrol.apiserver.k8s.io/v1beta2) in OpenShift 4.16.',
    documentation_url: 'https://access.redhat.com/articles/6955985',
    sts_only: false,
    cluster_condition: '',
    creation_timestamp: '2024-05-31T04:40:23.72334Z',
  },
  {
    kind: 'VersionGate',
    id: 'eef86fa3-39f6-11ef-9dc9-0a580a801130',
    href: '/api/clusters_mgmt/v1/version_gates/eef86fa3-39f6-11ef-9dc9-0a580a801130',
    version_raw_id_prefix: '4.10',
    label: 'api.openshift.com/gate-label-test-b64q',
    value: 'value-test',
    warning_message: 'You have been warned',
    description: 'test',
    documentation_url: '',
    sts_only: false,
    cluster_condition: '',
    creation_timestamp: '2024-07-04T11:17:00.577169Z',
  },
  {
    kind: 'VersionGate',
    id: 'f721546f-6f9d-11ef-9a77-0a580a81089a',
    href: '/api/clusters_mgmt/v1/version_gates/f721546f-6f9d-11ef-9a77-0a580a81089a',
    version_raw_id_prefix: '4.17',
    label: 'api.openshift.com/gate-sts',
    value: '4.17',
    warning_message:
      'STS roles must be updated with 4.17 permissions before the cluster can be updated to OpenShift 4.17. Failure to update the roles before cluster update will cause cluster control plane degradation.',
    description:
      'OpenShift STS clusters include new required cloud provider permissions in OpenShift 4.17.',
    documentation_url: 'https://access.redhat.com/solutions/6808671',
    sts_only: true,
    cluster_condition: '',
    creation_timestamp: '2024-09-10T17:56:11.847999Z',
  },
];

const GCPWIFGate = {
  kind: 'VersionGate',
  id: '50efa344-e7db-11ef-b42d-0a580a8010c8',
  href: '/api/clusters_mgmt/v1/version_gates/50efa344-e7db-11ef-b42d-0a580a8010c8',
  version_raw_id_prefix: '4.18',
  label: 'api.openshift.com/gate-wif',
  value: '4.18',
  warning_message:
    'The wif-config associated with this cluster must be updated to support 4.18 before the cluster can be updated to OpenShift 4.18. Failure to update the wif-config before cluster update will cause the upgrade request to fail.',
  description: 'OpenShift WIF clusters require wif-config update.',
  documentation_url: 'TBD',
  sts_only: false,
  cluster_condition: "gcp.authentication.wif_config_id != ''",
  creation_timestamp: '2025-02-10T18:17:41.351099Z',
};

describe('UpgradeAcknowledgeHelpers', () => {
  describe('getClusterAcks', () => {
    it('should not filter out WIF-config realted alert in case of a GCP WIF cluster', () => {
      const result = getClusterAcks({}, mockGCPCluster, [...mockGates, GCPWIFGate], '4.18.2');
      expect(result).toEqual([[GCPWIFGate], []]);
    });
    it('should filter out WIF-config realted alert in case of non GCP WIF cluster', () => {
      const result = getClusterAcks(
        {},
        { id: 'fake-id', aws: {} },
        [...mockGates, GCPWIFGate],
        '4.18.2',
      );
      expect(result).toEqual([[], []]);
    });
  });
});
