import React from 'react';
import PropTypes from 'prop-types';

import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

import {
  getEnableMinorVersionUpgrades,
  isNextMinorVersionAvailableHelper,
} from '../MinorVersionUpgradeAlert/MinorVersionUpgradeAlertHelpers';
import { getClusterAcks } from '../UpgradeAcknowledge/UpgradeAcknowledgeHelpers';

const MinorVersionUpgradeConfirm = ({ upgradeGates, schedules, cluster }) => {
  const isAutomatic = !schedules?.items?.some((policy) => policy.schedule_type === 'automatic');
  const isMinorVersionUpgradesEnabled = getEnableMinorVersionUpgrades(schedules);
  const isNextMinorVersionAvailable = isNextMinorVersionAvailableHelper(cluster);
  const getAcks = getClusterAcks(schedules, cluster, upgradeGates);
  const [clusterUnmetAcks] = getAcks;

  if (
    isAutomatic ||
    !isNextMinorVersionAvailable ||
    !isMinorVersionUpgradesEnabled ||
    clusterUnmetAcks.length !== 0
  ) {
    return null;
  }
  return (
    <div className="ocm-upgrade-additional-versions-available">
      <InfoCircleIcon />
      Next minor version update allowed.
    </div>
  );
};

MinorVersionUpgradeConfirm.propTypes = {
  upgradeGates: PropTypes.object,
  schedules: PropTypes.object,
  cluster: PropTypes.object,
};

export default MinorVersionUpgradeConfirm;
