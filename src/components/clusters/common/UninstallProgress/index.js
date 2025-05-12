import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getClusterAddOns } from '../../ClusterDetailsMultiRegion/components/AddOns/AddOnsActions';

import UninstallProgress from './UninstallProgress';

const mapStateToProps = (state) => ({
  clusterAddOns: state.addOns.clusterAddOns,
  addOns: state.addOns.addOns,
  logs: state.logs,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getClusterAddOns,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UninstallProgress);
