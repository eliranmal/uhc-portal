import { useCallback, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';

import { WifConfigList } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';
import { WifConfig } from '~/types/clusters_mgmt.v1';

export function useGetWifConfigs(
  getWifConfigService: (query: string) => Promise<AxiosResponse<WifConfigList>>,
): {
  getWifConfigs: (query: string) => void;
  wifConfigs: WifConfig[] | null;
  isLoading: boolean;
  error?: unknown;
} {
  const [wifConfigs, setWifConfigs] = useState<WifConfig[] | null>(null);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);

  const getWifConfigs = useCallback(
    (query: string): void => {
      setIsLoading(true);
      setError(undefined);
      getWifConfigService(query)
        .then((response) => setWifConfigs(response.data.items))
        .catch((err: AxiosError) => {
          setError(err);
        })
        .finally(() => setIsLoading(false));
    },
    [getWifConfigService],
  );

  return { getWifConfigs, isLoading, wifConfigs, error };
}
