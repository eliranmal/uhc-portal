import get from 'lodash/get';
import { connect } from 'react-redux';

import { getUserAccess } from '../../redux/actions/costActions';
import { getSummaryDashboard, getUnhealthyClusters } from '../../redux/actions/dashboardsActions';
import { invalidateSubscriptions } from '../../redux/actions/subscriptionsActions';
import { getOrganizationAndQuota } from '../../redux/actions/userActions';
import { viewConstants } from '../../redux/constants';
import { fetchOrganizationInsights } from '../clusters/ClusterDetailsMultiRegion/components/Insights/InsightsActions';

import Dashboard from './Dashboard';

const mapDispatchToProps = {
  getSummaryDashboard,
  getUnhealthyClusters,
  getUserAccess,
  invalidateSubscriptions,
  fetchOrganizationInsights,
  getOrganizationAndQuota,
};

const mapStateToProps = (state) => ({
  summaryDashboard: state.dashboards.summary,
  unhealthyClusters: state.dashboards.unhealthyClusters,
  viewOptions: state.viewOptions[viewConstants.OVERVIEW_VIEW],
  insightsOverview: state.insightsData.overview,
  userAccess: state.cost.userAccess,
  organization: state.userProfile.organization,

  // summary dashboard contain only one {time, value} pair - the current value.
  totalClusters: get(state.dashboards.summary, 'metrics.clusters_total[0].value', 0),
  totalConnectedClusters: get(
    state.dashboards.summary,
    'metrics.connected_clusters_total[0].value',
    0,
  ),
  totalUnhealthyClusters: get(
    state.dashboards.summary,
    'metrics.unhealthy_clusters_total[0].value',
    0,
  ),
  totalCPU: get(state.dashboards.summary, 'metrics.sum_total_cpu[0]', { value: 0 }),
  usedCPU: get(state.dashboards.summary, 'metrics.sum_used_cpu[0]', { value: 0 }),
  totalMem: get(state.dashboards.summary, 'metrics.sum_total_memory[0]', { value: 0 }),
  usedMem: get(state.dashboards.summary, 'metrics.sum_used_memory[0]', { value: 0 }),
  upToDate: get(state.dashboards.summary, 'metrics.clusters_up_to_date_total[0]', { value: 0 }),
  upgradeAvailable: get(state.dashboards.summary, 'metrics.clusters_upgrade_available_total[0]', {
    value: 0,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
