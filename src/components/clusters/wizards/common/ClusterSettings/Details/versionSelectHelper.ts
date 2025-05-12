import { FuzzyEntryType } from '~/components/common/FuzzySelect/types';
import { Organization } from '~/types/accounts_mgmt.v1';
import { Version } from '~/types/clusters_mgmt.v1';

export const channelGroups = {
  STABLE: 'stable',
  CANDIDATE: 'candidate',
  FAST: 'fast',
  NIGHTLY: 'nightly',
};

const supportStatuses = {
  FULL: 'Full Support',
  MAINTENANCE: 'Maintenance Support',
  EXTENDED: 'Extended Support',
};

type SupportStatus = (typeof supportStatuses)[keyof typeof supportStatuses];

type SupportMap = {
  [version: string]: SupportStatus;
};

const getVersionsData = (
  versions: Version[],
  unstableVersionsIncluded: boolean,
  supportVersionMap?: SupportMap,
) => {
  const fullSupport: FuzzyEntryType[] = [];
  const maintenanceSupport: FuzzyEntryType[] = [];

  const candidate: FuzzyEntryType[] = [];
  const nightly: FuzzyEntryType[] = [];
  const fast: FuzzyEntryType[] = [];

  versions.forEach((version: Version) => {
    const { raw_id: versionRawId, id: versionId, channel_group: channelGroup } = version;
    if (versionRawId && versionId) {
      // HACK: This relies on parseFloat of '4.11.3' to return 4.11 ignoring trailing '.3'.
      // BUG(OCMUI-1736): We rely on converting float back to exactly '4.11'
      //   for indexing `supportVersionMap`.  Float round-tripping is fragile.
      //   Will break when parseFloat('4.20.0').toString() returns '4.2' not '4.20'!
      if (!unstableVersionsIncluded || channelGroup === channelGroups.STABLE) {
        const majorMinorVersion = parseFloat(versionRawId);
        const hasFullSupport = supportVersionMap?.[majorMinorVersion] === supportStatuses.FULL;

        const versionEntry = {
          entryId: versionId,
          label: versionRawId,
          groupKey: hasFullSupport ? supportStatuses.FULL : supportStatuses.MAINTENANCE,
        };

        if (hasFullSupport) {
          fullSupport.push(versionEntry);
        } else {
          maintenanceSupport.push(versionEntry);
        }
        return;
      }

      if (unstableVersionsIncluded) {
        const versionEntry = {
          entryId: versionId,
          label: `${versionRawId} (${channelGroup})`,
          groupKey: channelGroup,
        };

        switch (channelGroup) {
          case channelGroups.CANDIDATE:
            candidate.push(versionEntry);
            break;
          case channelGroups.NIGHTLY:
            nightly.push(versionEntry);
            break;
          case channelGroups.FAST:
            fast.push(versionEntry);
            break;
          default:
            break;
        }
      }
    }
  });

  const stableVersions = {
    'Full support': fullSupport,
    'Maintenance support': maintenanceSupport,
  };

  return unstableVersionsIncluded
    ? {
        ...stableVersions,
        Candidate: candidate,
        Nightly: nightly,
        Fast: fast,
      }
    : stableVersions;
};

const hasUnstableVersionsCapability = (organization?: Organization) =>
  (organization?.capabilities ?? []).some(
    (capability) =>
      capability.name === 'capability.organization.non_stable_channel_group' &&
      capability.value === 'true',
  );

const getVersionNameWithChannel = (version: Version): string =>
  `${version?.raw_id} ${version?.channel_group !== channelGroups.STABLE ? `(${version?.channel_group})` : ''}`;

export {
  getVersionsData,
  supportStatuses,
  hasUnstableVersionsCapability,
  getVersionNameWithChannel,
};
