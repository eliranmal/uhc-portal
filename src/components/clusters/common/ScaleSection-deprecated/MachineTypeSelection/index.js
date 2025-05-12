import { connect } from 'react-redux';

import { getDefaultFlavour } from '~/redux/actions/flavourActions';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';

import MachineTypeSelection from './MachineTypeSelection';

const mapStateToProps = (state) => ({
  flavours: state.flavours,
  machineTypes: state.machineTypes,
  machineTypesByRegion: state.machineTypesByRegion,
  organization: state.userProfile.organization,
  quota: state.userProfile.organization.quotaList,
});

const mapDispatchToProps = {
  getMachineTypes,
  getDefaultFlavour,
};

export default connect(mapStateToProps, mapDispatchToProps)(MachineTypeSelection);
