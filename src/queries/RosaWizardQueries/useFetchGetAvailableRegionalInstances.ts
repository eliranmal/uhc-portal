import { useQuery } from '@tanstack/react-query';

import { queryClient } from '~/components/App/queryClient';
import { accountsService } from '~/services';

import {
  currentEnvironment,
  defaultRegionalInstances,
  formatErrorData,
  getProdRegionalInstances,
} from '../helpers';
import { queryConstants } from '../queriesConstants';
import { AvailableRegionalInstance } from '../types';

export const refetchGetAvailableRegionalInstances = () => {
  queryClient.invalidateQueries({
    queryKey: [queryConstants.FETCH_GET_AVAILABLE_REGIONAL_INSTANCES],
  });
};

export const useFetchGetAvailableRegionalInstances = (isMultiRegionEnabled?: boolean) => {
  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: [queryConstants.FETCH_GET_AVAILABLE_REGIONAL_INSTANCES],
    queryFn: async () => {
      const currentEnv = currentEnvironment();
      const isProduction = currentEnv === 'production';

      const response = await accountsService.getRegionalInstances();

      const regionalInstanceItems = response?.data?.items;

      const availableRegionalInstances = isProduction
        ? getProdRegionalInstances(regionalInstanceItems)
        : regionalInstanceItems?.filter(
            (regionItem: AvailableRegionalInstance) =>
              regionItem.id?.includes(currentEnv) && regionItem?.cloud_provider_id === 'aws',
          );

      const defaultRegionalInstance = isProduction
        ? defaultRegionalInstances.find(
            (obj: AvailableRegionalInstance) => obj.environment === 'production',
          )
        : defaultRegionalInstances.find(
            (obj: AvailableRegionalInstance) => obj.environment === currentEnv,
          );

      const regionalInstances = [...availableRegionalInstances, defaultRegionalInstance];

      return regionalInstances;
    },
    retry: false,
    enabled: isMultiRegionEnabled,
  });

  const errorData = formatErrorData(isLoading, isError, error);

  return {
    data: !isError && !isFetching ? data : undefined,
    isError,
    error: errorData?.error,
    isFetching,
  };
};
