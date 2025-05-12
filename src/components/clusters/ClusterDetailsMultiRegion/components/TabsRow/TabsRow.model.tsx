import React, { RefObject } from 'react';

import { ClusterTabsId } from '../common/ClusterTabIds';

export type TabsRowTabType = {
  key: number;
  title: string | React.ReactNode;
  contentId: string;
  id: ClusterTabsId;
} & TabsRowTabProperties;

export type TabsRowTabProperties = {
  show?: boolean;
  ref: RefObject<any>;
  isDisabled?: boolean;
  tooltip?: React.ReactElement<any>;
  hasIssues?: boolean;
  numberOfIssues?: number;
  isLoading?: boolean;
};

export type TabsRowInfoType = {
  overview: TabsRowTabProperties;
  monitoring: TabsRowTabProperties;
  accessControl: TabsRowTabProperties;
  addOns: TabsRowTabProperties;
  clusterHistory: TabsRowTabProperties;
  networking: TabsRowTabProperties;
  machinePools: TabsRowTabProperties;
  support: TabsRowTabProperties;
  upgradeSettings: TabsRowTabProperties;
  addAssisted: TabsRowTabProperties;
  accessRequest: TabsRowTabProperties;
};
