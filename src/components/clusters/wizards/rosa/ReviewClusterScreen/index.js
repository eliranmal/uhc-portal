import { connect } from 'react-redux';

import { openModal } from '~/components/common/Modal/ModalActions';
import {
  clearGetOcmRoleResponse,
  clearGetUserRoleResponse,
  getOCMRole,
  getUserRole,
} from '~/redux/actions/rosaActions';

import ReviewClusterScreen from './ReviewClusterScreen';

const mapStateToProps = (state) => {
  const { getUserRoleResponse, getOCMRoleResponse } = state.rosaReducer;
  return {
    getUserRoleResponse,
    getOCMRoleResponse,
    createClusterResponse: state.clusters.createdCluster,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserRole: () => dispatch(getUserRole()),
  getOCMRole: (awsAccountID) => dispatch(getOCMRole(awsAccountID)),
  clearGetUserRoleResponse: () => dispatch(clearGetUserRoleResponse()),
  clearGetOcmRoleResponse: () => dispatch(clearGetOcmRoleResponse()),
  openModal: (name, data) => dispatch(openModal(name, data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewClusterScreen);
