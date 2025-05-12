import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { TableVariant, textCenter } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';
import { global_success_color_100 as successColor } from '@patternfly/react-tokens/dist/esm/global_success_color_100';

import { Link } from '~/common/routing';
import { usePreviousProps } from '~/hooks/usePreviousProps';

import getClusterName from '../../../common/getClusterName';
import { createOverviewQueryObject, viewPropsChanged } from '../../../common/queryHelpers';
import { viewConstants } from '../../../redux/constants';
import ViewPaginationRow from '../../clusters/common/ViewPaginationRow/viewPaginationRow';
import skeletonRows from '../../common/SkeletonRows';
import { getIssuesCount } from '../overviewHelpers';

import { actionResolver } from './ClustersWithIssuesActionResolver';

const ClustersWithIssuesTableCard = (props) => {
  const prevProps = usePreviousProps(props);

  React.useEffect(() => {
    const { getUnhealthyClusters, viewOptions } = props;
    if (prevProps && viewPropsChanged(viewOptions, prevProps.viewOptions)) {
      getUnhealthyClusters(createOverviewQueryObject(viewOptions));
    }
  }, [props, prevProps]);

  const { unhealthyClusters, viewOptions } = props;
  if (unhealthyClusters.fulfilled && unhealthyClusters.subscriptions.length === 0) {
    return (
      <Card className="ocm-overview-clusters__card">
        <CardTitle>Clusters with issues</CardTitle>
        <CardBody>
          <EmptyState>
            <EmptyStateHeader
              icon={<EmptyStateIcon icon={CheckCircleIcon} color={successColor.value} />}
            />
            <EmptyStateBody>No issues detected</EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  const clusterWithIssuesRow = (subscription) => {
    const issuesCount = <span>{getIssuesCount(subscription)}</span>;

    const clusterName = (
      <Link to={`/details/s/${subscription.id}`}>{getClusterName({ subscription })}</Link>
    );

    return {
      cells: [{ title: clusterName }, { title: issuesCount }],
      subscription,
    };
  };

  const columns = [
    { title: 'Name' },
    { title: 'Issues detected', transforms: [textCenter], columnTransforms: [textCenter] },
  ];

  const showSkeleton =
    unhealthyClusters.pending &&
    unhealthyClusters.subscriptions &&
    unhealthyClusters.subscriptions.length > 0;

  const rows = showSkeleton
    ? skeletonRows(viewOptions.pageSize)
    : unhealthyClusters.subscriptions.map((subscription) => clusterWithIssuesRow(subscription));
  const resolver = unhealthyClusters.pending
    ? undefined
    : (rowData) => actionResolver(rowData.subscription);

  return (
    <Card className="ocm-overview-clusters__card">
      <CardTitle>Clusters with issues</CardTitle>
      <CardBody>
        <TableDeprecated
          className="clusters-with-issues"
          aria-label="Clusters with issues"
          cells={columns}
          rows={rows}
          actionResolver={resolver}
          variant={TableVariant.compact}
        >
          <TableHeaderDeprecated />
          <TableBodyDeprecated />
        </TableDeprecated>
        <ViewPaginationRow
          viewType={viewConstants.OVERVIEW_VIEW}
          currentPage={viewOptions.currentPage}
          pageSize={viewOptions.pageSize}
          totalCount={viewOptions.totalCount}
          totalPages={viewOptions.totalPages}
          variant="bottom"
        />
      </CardBody>
    </Card>
  );
};

ClustersWithIssuesTableCard.propTypes = {
  unhealthyClusters: PropTypes.shape({
    subscriptions: PropTypes.array,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  viewOptions: PropTypes.shape({
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  getUnhealthyClusters: PropTypes.func.isRequired,
};

export default ClustersWithIssuesTableCard;
