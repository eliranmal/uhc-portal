import { connect } from 'react-redux';

import { cloudProviderActions } from '../../../redux/actions/cloudProviderActions';
import { clearGlobalError } from '../../../redux/actions/globalErrorActions';
import { modalActions } from '../../common/Modal/ModalActions';

import ArchivedClusterList from './ArchivedClusterList';

const mapDispatchToProps = {
  getCloudProviders: cloudProviderActions.getCloudProviders,
  openModal: modalActions.openModal,
  closeModal: modalActions.closeModal,
  clearGlobalError,
};

const mapStateToProps = (state) => ({
  cloudProviders: state.cloudProviders,
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchivedClusterList);
