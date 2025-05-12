import { action, ActionType } from 'typesafe-actions';

import { clusterService } from '~/services';

const UPDATE_DELETE_PROTECTION = 'UPDATE_DELETE_PROTECTION';
const CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE = 'CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE';

const deleteProtectionConstants = {
  UPDATE_DELETE_PROTECTION,
  CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE,
};

// KKD - hoping we can remove these
const updateDeleteProtection = (clusterID: string, isProtected: boolean) =>
  action(UPDATE_DELETE_PROTECTION, clusterService.updateDeleteProtection(clusterID, isProtected));

const clearUpdateDeleteProtection = () => action(CLEAR_UPDATE_DELETE_PROTECTION_RESPONSE);

const deleteProtectionActions = { updateDeleteProtection };

type DeleteProtectionActions = ActionType<typeof deleteProtectionActions>;

export {
  deleteProtectionActions,
  updateDeleteProtection,
  DeleteProtectionActions,
  deleteProtectionConstants,
  clearUpdateDeleteProtection,
};
