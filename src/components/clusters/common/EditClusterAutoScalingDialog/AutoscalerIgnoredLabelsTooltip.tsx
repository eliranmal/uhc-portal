import React from 'react';

import PopoverHint from '~/components/common/PopoverHint';

export const AutoscalerIgnoredLabelsHelpText = 'Format should be a comma-separated list of labels.';

export const AutoscalerIgnoredLabelsPopoverText = (
  <>
    Define a node label that should be ignored when considering node group similarity. Format should
    be a comma-separated list of labels.
  </>
);

export const AutoscalerIgnoredLabelsPopover = () => (
  <PopoverHint
    title="Balancing ignored labels"
    maxWidth="30rem"
    hint={AutoscalerIgnoredLabelsPopoverText}
  />
);
