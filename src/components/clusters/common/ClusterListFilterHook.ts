import * as React from 'react';

import { buildFilterURLParams } from '~/common/queryHelpers';
import { useNavigate } from '~/common/routing';

export const ClusterListFilterHook = (filter: { [flag: string]: any }) => {
  const [previousFilter, setPreviousFilter] = React.useState<{
    [flag: string]: any;
  }>();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (filter && JSON.stringify(filter ?? {}) !== JSON.stringify(previousFilter ?? {})) {
      navigate(
        {
          search: buildFilterURLParams(filter),
        },
        { replace: true },
      );
      setPreviousFilter(filter);
    }
  }, [filter, previousFilter, navigate]);
};
