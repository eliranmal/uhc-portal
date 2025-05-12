import { useQuery } from '@tanstack/react-query';

import { ErrorResponse, formatClusterListError } from '../helpers/createResponseForFetchCluster';

type Region = { provider?: string; region?: string; url: string };

export const useFetchRegions = ({
  mainQueryKey = 'fetchRegions',
  returnAll = false,
  getMultiRegion = true,
}) => {
  const { isError, data, isLoading, isFetching, error, isFetched } = useQuery({
    queryKey: [mainQueryKey, 'getRegions'],

    // TODO this is currently hard-coded
    // but will be changed to get the information from
    // an api endpoint once that endpoint is ready
    queryFn: () => {
      if (!getMultiRegion) {
        return {};
      }
      return {
        aws: {
          'ap-southeast-1': {
            total: 100,
            'api.stage.openshift.com': 90,
            '***REMOVED***': 10,
          },
        },
      };
    },
  });

  // We need to convert the returned data into
  // an array of Region types so it be more easily used later on

  const regionResponse: any = data;
  const regionsArray: Region[] = [];

  if (regionResponse) {
    const providers = Object.keys(regionResponse);

    providers?.forEach((provider) => {
      const regions = Object.keys(regionResponse[provider]);

      regions?.forEach((region) => {
        const regionDataTypes = Object.keys(regionResponse[provider][region]);

        regionDataTypes?.forEach((type) => {
          // Get the data type that includes the region name - for example: ***REMOVED***
          // Then ensure that there is at least one item in that region
          if (returnAll || (type.includes(region) && regionResponse[provider][region][type] > 0)) {
            const url = type.replace('.openshift.com', '').replace('api.', '');

            regionsArray.push({ provider, region, url });
          }
        });
      });
    });
  }

  const errorObj = formatClusterListError({ error } as { error: ErrorResponse });
  const errors = errorObj ? [errorObj] : [];

  return {
    isLoading,
    data: regionsArray,
    isError,
    isFetching,
    errors,
    isFetched,
  };
};
