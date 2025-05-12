import { splitVersion } from '~/common/versionHelpers';

import { getFromVersionFromHelper } from '../UpgradeAcknowledge/UpgradeAcknowledgeHelpers';

export const isNextMinorVersionAvailableHelper = (cluster) => {
  const [fromMajor, fromMinor] = splitVersion(getFromVersionFromHelper(cluster));

  const availableUpgrades = cluster?.version?.available_upgrades || [];

  return availableUpgrades.some((version) => {
    const [major, minor] = splitVersion(version);
    return major === fromMajor && minor > fromMinor;
  });
};

export const getUpgradeScheduleId = (schedules) =>
  schedules?.items?.find((item) => item.schedule_type === 'automatic')?.id;

export const getEnableMinorVersionUpgrades = (schedules) => {
  const automatic = schedules?.items.find((item) => item.schedule_type === 'automatic');
  if (!automatic) return true;
  return automatic.enable_minor_version_upgrades;
};
