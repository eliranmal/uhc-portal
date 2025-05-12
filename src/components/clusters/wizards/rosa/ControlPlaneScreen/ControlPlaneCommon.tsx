import React from 'react';

import { ListItem as PFListItem } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/esm/icons/check-icon';

export const defaultMarginBottomSpacing = 'pf-v5-u-mb-md';
export const defaultMarginTopBottomSpacing = 'pf-v5-u-mb-md pf-v5-u-mt-md';

export const ListItem = ({ children }: { children: React.ReactNode }) => (
  <PFListItem icon={<CheckIcon className="pf-v5-u-active-color-100" />}>{children}</PFListItem>
);

export type hypershiftValue = 'true' | 'false';
