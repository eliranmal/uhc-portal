import get from 'lodash/get';

import { SortByDirection } from '@patternfly/react-table';

import { versionComparator } from '~/common/versionComparator';

import getClusterName from '../../../common/getClusterName';
import { isAISubscriptionWithoutMetrics } from '../../../common/isAssistedInstallerCluster';
import { sortColumns } from '../../../components/clusters/ClusterListMultiRegion/components/ClusterListTable';
import { getClusterStateAndDescription } from '../../../components/clusters/common/clusterStates';
import { clusterType } from '../../../components/clusters/common/clusterType';
import getClusterVersion from '../../../components/clusters/common/getClusterVersion';

const getSortableRowValues = (cluster) => {
  const sortableValues = {};
  sortableValues[sortColumns.Name] = getClusterName(cluster);
  sortableValues[sortColumns.Created] = cluster.creation_timestamp;
  sortableValues[sortColumns.Status] = isAISubscriptionWithoutMetrics(cluster.subscription)
    ? cluster.state
    : getClusterStateAndDescription(cluster).description;
  sortableValues[sortColumns.Type] = clusterType(cluster).name;
  sortableValues[sortColumns.Provider] =
    `${get(cluster, 'cloud_provider.id', 'N/A')} ${get(cluster, 'region.id', 'N/A')}`;
  sortableValues[sortColumns.Version] = getClusterVersion(cluster);
  return sortableValues;
};

export const sortClusters = (clusters, activeSortIndex, activeSortDirection) => {
  if (activeSortDirection === null || !clusters || clusters.length === 0) {
    return clusters;
  }

  return clusters.sort((a, b) => {
    const aValue = getSortableRowValues(a)[activeSortIndex];
    const bValue = getSortableRowValues(b)[activeSortIndex];

    const stringSort = (a, b) =>
      activeSortDirection === SortByDirection.asc
        ? a.localeCompare(b, 'en', { numeric: true, ignorePunctuation: true })
        : b.localeCompare(a, 'en', { numeric: true, ignorePunctuation: true });

    let sortValue = 0;
    if (activeSortIndex === sortColumns.Version) {
      // Set N/A version to a value that can be sorted against
      const versionA = aValue === 'N/A' ? '0.0.0' : aValue;
      const versionB = bValue === 'N/A' ? '0.0.0' : bValue;
      sortValue =
        activeSortDirection === SortByDirection.asc
          ? versionComparator(versionA, versionB)
          : versionComparator(versionB, versionA);
    } else if (typeof aValue === 'number') {
      // Numeric sort (note this isn't currently being used)
      sortValue = activeSortDirection === SortByDirection.asc ? aValue - bValue : bValue - aValue;
    } else {
      // String sort
      sortValue = stringSort(aValue, bValue);
    }
    if (sortValue === 0 && activeSortIndex !== sortColumns.Name) {
      // Both values are tied - so secondary sort by name
      return stringSort(
        getSortableRowValues(a)[sortColumns.Name],
        getSortableRowValues(b)[sortColumns.Name],
      );
    }
    return sortValue;
  });
};
