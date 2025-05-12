import { ClusterFromSubscription } from '~/types/types';

export const formatCluster = (cluster: ClusterFromSubscription) => ({
  aws: {
    sts: {
      auto_mode: cluster.aws?.sts?.auto_mode,
      oidc_config: { id: cluster.aws?.sts?.oidc_config?.id },
      oidc_config_endpoint_url: cluster.aws?.sts?.oidc_endpoint_url,
      operator_iam_roles: cluster.aws?.sts?.operator_iam_roles,
      operator_role_prefix: cluster.aws?.sts?.operator_role_prefix,
      role_arn: cluster.aws?.sts?.role_arn,
    },
  },

  ccs: { enabled: cluster.ccs?.enabled },
  cloud_provider: { id: cluster.cloud_provider?.id },
  console: { url: cluster.console?.url },
  creation_timestamp: cluster.creation_timestamp,
  external_id: cluster.external_id,
  gcp_network: {
    compute_subnet: cluster.gcp_network?.compute_subnet,
    control_plane_subnet: cluster.gcp_network?.control_plane_subnet,
    vpc_name: cluster.gcp_network?.vpc_name,
    vpc_project_id: cluster.gcp_network?.vpc_project_id,
  },
  hypershift: { enabled: cluster.hypershift?.enabled },
  id: cluster.id,
  inflight_checks: cluster.inflight_checks,
  managed: cluster.managed,
  metrics: {
    upgrade: {
      state: cluster.metrics?.upgrade,
      version: cluster.metrics?.upgrade.version,
    },
  },
  name: cluster.name,
  openshift_version: cluster.openshift_version,

  product: { id: cluster.product?.id },
  region: { id: cluster.region?.id },
  state: cluster.state,
  status: {
    dns_ready: cluster.status?.dns_ready,
    limited_support_reason_count: cluster.status?.limited_support_reason_count,
    description: cluster.status?.description,
    state: cluster.status?.state,
  },
  subscription: {
    capabilities: cluster.subscription?.capabilities,
    eval_expiration_date: cluster.subscription?.eval_expiration_date,
    id: cluster.subscription?.id,
    display_name: cluster.subscription?.display_name,
    metrics: !!cluster.subscription?.metrics,
    plan: {
      id: cluster.subscription?.plan?.id,
      type: cluster.subscription?.plan?.type,
    },
    status: cluster.subscription?.status,
    support_level: cluster.subscription?.support_level,
    trial_end_date: cluster.subscription?.trial_end_date,
  },
  version: {
    available_upgrades: cluster.version?.available_upgrades,
    raw_id: cluster.version?.raw_id,
  },
});
