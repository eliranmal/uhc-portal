import { WifConfig } from '~/types/clusters_mgmt.v1';

export enum CloudProviderType {
  Aws = 'aws',
  Gcp = 'gcp',
}

export enum GCPAuthType {
  WorkloadIdentityFederation = 'workloadIdentityFederation',
  ServiceAccounts = 'serviceAccounts',
}

export interface WifConfigList {
  items: WifConfig[];
  page: number;
  size: number;
  total: number;
}
