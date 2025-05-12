import { connect } from 'react-redux';

import { getCloudProviders } from '~/redux/actions/cloudProviderActions';
import {
  clearInstallableVersions,
  createCluster,
  resetCreatedClusterResponse,
} from '~/redux/actions/clustersActions';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';
import { getUserRole } from '~/redux/actions/rosaActions';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';

import { openModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import submitOSDRequest from '../common/submitOSDRequest';

import CreateROSAWizard from './CreateROSAWizard';

const mapStateToProps = (state) => {
  const { organization } = state.userProfile;
  const { getUserRoleResponse } = state.rosaReducer;
  const { clusterVersions } = state?.clusters || {};

  return {
    isErrorModalOpen: shouldShowModal(state, 'osd-create-error'), // TODO: change 'osd' to 'rosa'
    createClusterResponse: state.clusters.createdCluster,
    machineTypes: state.machineTypes,
    organization,
    cloudProviders: state.cloudProviders,
    getUserRoleResponse,
    getInstallableVersionsResponse: clusterVersions,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (formikValues) =>
    dispatch(() => {
      // If changing these params, keep test & DebugClusterRequest props synced.
      const params = { isWizard: true };
      return submitOSDRequest(dispatch, params)(formikValues); // TODO: change to submitROSARequest(...
    }),
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
  openModal: (modalName) => {
    dispatch(openModal(modalName));
  },

  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getUserRole: () => dispatch(getUserRole()),
  getMachineTypes: () => dispatch(getMachineTypes()),
  getCloudProviders: () => dispatch(getCloudProviders()),
  clearInstallableVersions: () => dispatch(clearInstallableVersions()),
  createCluster: (clusterRequest, upgradeSchedule) =>
    dispatch(createCluster(clusterRequest, upgradeSchedule)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateROSAWizard);
