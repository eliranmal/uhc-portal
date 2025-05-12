import React from 'react';

import { Badge, Spinner, TabTitleIcon, TabTitleText } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

import { ClusterTabsId } from '../common/ClusterTabIds';

import { TabsRowInfoType, TabsRowTabType } from './TabsRow.model';

const AccessRequestIcon = ({
  numberOfIssues,
  isLoading,
}: {
  numberOfIssues?: number;
  isLoading?: boolean;
}) =>
  isLoading ? (
    <Spinner size="sm" aria-label="Loading..." />
  ) : (
    <Badge
      screenReaderText="Pending Access Requests"
      isRead={numberOfIssues === undefined || numberOfIssues === 0}
    >
      {numberOfIssues}
    </Badge>
  );

export const getTabs = (tabsInfo: TabsRowInfoType): TabsRowTabType[] => [
  {
    key: 0,
    title: 'Overview',
    contentId: 'overviewTabContent',
    id: ClusterTabsId.OVERVIEW,
    show: true,
    ref: tabsInfo.overview.ref,
  },
  {
    key: 1,
    title: (
      <>
        <TabTitleText>Monitoring</TabTitleText>
        {tabsInfo.monitoring.hasIssues ? (
          <TabTitleIcon id="monitoring-issues-icon">
            <ExclamationCircleIcon className="danger" />
          </TabTitleIcon>
        ) : null}
      </>
    ),
    contentId: 'monitoringTabContent',
    id: ClusterTabsId.MONITORING,
    show: tabsInfo.monitoring.show === undefined ? true : tabsInfo.monitoring.show,
    ref: tabsInfo.monitoring.ref,
  },
  {
    key: 2,
    title: 'Access control',
    id: ClusterTabsId.ACCESS_CONTROL,
    contentId: 'accessControlTabContent',
    show: tabsInfo.accessControl.show,
    ref: tabsInfo.accessControl.ref,
  },
  {
    key: 3,
    title: 'Add-ons',
    contentId: 'addOnsTabContent',
    id: ClusterTabsId.ADD_ONS,
    show: tabsInfo.addOns.show,
    ref: tabsInfo.addOns.ref,
  },
  {
    key: 4,
    title: 'Cluster history',
    contentId: 'clusterHistoryTabContent',
    id: ClusterTabsId.CLUSTER_HISTORY,
    show: tabsInfo.clusterHistory.show,
    ref: tabsInfo.clusterHistory.ref,
  },
  {
    key: 5,
    title: 'Networking',
    contentId: 'networkingTabContent',
    id: ClusterTabsId.NETWORKING,
    show: tabsInfo.networking.show,
    ref: tabsInfo.networking.ref,
  },
  {
    key: 6,
    title: 'Machine pools',
    contentId: 'machinePoolsTabContent',
    id: ClusterTabsId.MACHINE_POOLS,
    show: tabsInfo.machinePools.show,
    ref: tabsInfo.machinePools.ref,
  },
  {
    key: 7,
    title: 'Support',
    contentId: 'supportTabContent',
    id: ClusterTabsId.SUPPORT,
    show: tabsInfo.support.show,
    ref: tabsInfo.support.ref,
  },
  {
    key: 8,
    title: 'Settings',
    contentId: 'upgradeSettingsTabContent',
    id: ClusterTabsId.UPDATE_SETTINGS,
    show: tabsInfo.upgradeSettings.show,
    ref: tabsInfo.upgradeSettings.ref,
  },
  {
    key: 9,
    title: 'Add Hosts',
    contentId: 'addHostsContent',
    id: ClusterTabsId.ADD_ASSISTED_HOSTS,
    show: tabsInfo.addAssisted.show,
    ref: tabsInfo.addAssisted.ref,
    isDisabled: tabsInfo.addAssisted.isDisabled,
    tooltip: tabsInfo.addAssisted.tooltip,
  },
  {
    key: 10,
    title:
      tabsInfo.accessRequest.isLoading || tabsInfo.accessRequest.numberOfIssues !== undefined ? (
        <>
          <TabTitleIcon style={{ paddingRight: '10px' }}>
            <AccessRequestIcon
              numberOfIssues={tabsInfo.accessRequest.numberOfIssues}
              isLoading={tabsInfo.accessRequest.isLoading}
            />
          </TabTitleIcon>
          <TabTitleText>Access Requests</TabTitleText>
        </>
      ) : (
        <TabTitleText>Access Requests</TabTitleText>
      ),
    contentId: 'accessRequestContent',
    id: ClusterTabsId.ACCESS_REQUEST,
    show: tabsInfo.accessRequest.show,
    ref: tabsInfo.accessRequest.ref,
    isDisabled: tabsInfo.accessRequest.isDisabled,
    tooltip: tabsInfo.accessRequest.tooltip,
  },
];

export const getInitTab = (tabs: TabsRowTabType[], initTabOpen?: string): TabsRowTabType =>
  tabs.find((tab) => tab.id === initTabOpen) ?? tabs[0];
