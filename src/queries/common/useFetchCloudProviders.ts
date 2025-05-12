import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { clusterService } from '~/services';

import type { CloudProvider, CloudRegion } from '../../types/clusters_mgmt.v1';

export const useFetchCloudProviders = () => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['clusterService', 'cloudProviders'],
    queryFn: () => clusterService.getCloudProviders(),
  });

  const cloudProviders: {
    [providerId: string]: Omit<CloudProvider, 'regions'> & {
      regions: { [id: string]: CloudRegion };
    };
  } = {};

  if (data?.data?.items) {
    data.data.items?.forEach((provider) => {
      if (provider.id) {
        // build a map of region id -> region info
        const regions: { [id: string]: CloudRegion } = {};
        if (provider.regions !== undefined) {
          provider.regions.forEach((region) => {
            if (region.id) {
              regions[region.id] = {
                // explicitly keeping only the fields we care about,
                // to avoid memory bloat with useless "Kind" and "href"
                id: region.id,
                display_name: region.display_name,
                enabled: region.enabled,
                supports_multi_az: region.supports_multi_az,
                kms_location_id: region.kms_location_id,
                ccs_only: region.ccs_only,
                supports_hypershift: region.supports_hypershift,
              };
            }
          });
        }
        cloudProviders[provider.id] = {
          ...provider,
          regions,
        };
      }
    });
  }

  return { isError, isLoading, isFetching, data: cloudProviders };
};

/**
 * Cloud providers invalidation query
 */
export const invalidateCloudProviders = () => {
  queryClient.invalidateQueries({ queryKey: ['cloudProviders', 'getCloudProviders'] });
};
