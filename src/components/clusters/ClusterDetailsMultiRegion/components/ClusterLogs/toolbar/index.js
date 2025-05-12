import { connect } from 'react-redux';

import {
  onClearFiltersAndFlags,
  onListFilterSet,
  onListFlagsSet,
} from '../../../../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../../../../redux/constants';

import ClusterLogsToolbar from './ClusterLogsToolbar';

const mapStateToProps = (state, ownProps) => ({
  viewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
  currentFilter: state.viewOptions[ownProps.view].filter || { conditionalFilterFlags: {} },
  currentFlags: state.viewOptions[ownProps.view].flags.conditionalFilterFlags || {},
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: (filter) => dispatch(onListFilterSet(filter, ownProps.view)),
  setFlags: (flags) => dispatch(onListFlagsSet('conditionalFilterFlags', flags, ownProps.view)),
  clearFiltersAndFlags: () => dispatch(onClearFiltersAndFlags(ownProps.view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterLogsToolbar);
