import React from 'react';

import PopoverHint from '~/components/common/PopoverHint';

export const AutoscalerGpuHelpText =
  'Format should be a comma-separated list of "<gpu_type>:<min>:<max>"';

export const AutoscalerGpuPopoverText = (
  <>
    Minimum and maximum number of different GPUs in cluster. Cluster autoscaler will not scale the
    cluster beyond these numbers. Format should be a comma-separated list of
    &quot;&lt;gpu_type&gt;:&lt;min&gt;:&lt;max&gt;&quot;.
  </>
);

export const AutoscalerGpuPopover = () => (
  <PopoverHint title="GPU" maxWidth="30rem" hint={AutoscalerGpuPopoverText} />
);
