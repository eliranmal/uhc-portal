import { action, ActionType } from 'typesafe-actions';

import { clusterService } from '../../services';
import { clustersConstants } from '../constants';

const fetchUpgradeGateFromAPI = () =>
  clusterService.getUpgradeGates().then((result) => result.data.items);

const fetchUpgradeGates = () =>
  action(clustersConstants.GET_UPGRADE_GATES, fetchUpgradeGateFromAPI());

const setClusterUpgradeGate = (upgradeGateId: string) =>
  action(clustersConstants.SET_CLUSTER_UPGRADE_GATE, upgradeGateId);

const upgradeGateActions = {
  fetchUpgradeGates,
  setClusterUpgradeGate,
};

type UpgradeGateAction = ActionType<typeof upgradeGateActions>;

export { upgradeGateActions, fetchUpgradeGates, setClusterUpgradeGate, UpgradeGateAction };
