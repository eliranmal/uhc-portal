import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1/enums';

export const LoadBalancerFlavorLabel = {
  [LoadBalancerFlavor.classic]: 'Classic Load Balancer',
  [LoadBalancerFlavor.nlb]: 'Network Load Balancer',
};
