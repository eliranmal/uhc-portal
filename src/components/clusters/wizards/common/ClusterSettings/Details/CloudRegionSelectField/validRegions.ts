import {
  AWS_DEFAULT_REGION,
  GCP_DEFAULT_REGION,
} from '~/components/clusters/wizards/common/constants';
import type { CloudRegion } from '~/types/clusters_mgmt.v1';

export type CheckedRegion = CloudRegion & {
  // Functionality: Valid iff undefined.  TODO: text not shown yet.
  disableReason: string | undefined;
  // Presentation: When not valid, prefer hiding or showing as disabled?
  // (Even if hide === true, disableReason ought to be set.)
  hide: boolean;
};

/** Single source of truth on potential reasons to hide/disable regions.
 * TODO(OCMUI-87, OCMUI-957): Use version & ccsInquiries data.
 */
export const checkRegion = (
  region: CloudRegion,
  context: {
    cloudProviderID: string;
    isBYOC: boolean;
    isMultiAz: boolean;
    isHypershiftSelected?: boolean;
  },
): CheckedRegion => {
  if (!region.enabled) {
    return {
      ...region,
      hide: true, // regions may be in DB but disabled for long time before GA.
      disableReason: 'This region is not supported',
    };
  }
  if (!context.isBYOC && region.ccs_only) {
    return {
      ...region,
      hide: true, // As of 2023, around 30% are ccs_only, worth hiding?
      disableReason:
        'This region only supported on Customer cloud subscription, not Red Hat account',
    };
  }
  if (context.isMultiAz && !region.supports_multi_az) {
    return {
      ...region,
      hide: false, // Rare, and AZs toggled on same screen, so better show than disappear.
      disableReason: 'This region only supported for Single-zone, not Multi-zone',
    };
  }
  if (context.isHypershiftSelected && !region.supports_hypershift) {
    return {
      ...region,
      hide: true, // As of 2023, only supports a handful in staging and <70% in production.
      disableReason: 'This region is not supported with Hosted Control Plane, only Standalone',
    };
  }
  return { ...region, hide: false, disableReason: undefined };
};

/** Selects default valid region, or `undefined` if nothing applicable. */
export const defaultRegionID = (
  regions: CheckedRegion[],
  cloudProviderID: string,
): string | undefined => {
  const defaultID = cloudProviderID === 'aws' ? AWS_DEFAULT_REGION : GCP_DEFAULT_REGION;
  const region = regions.find((r) => r.id === defaultID);
  if (region && !region.disableReason) {
    return region.id!;
  }
  // Possible with Hypershift!  Then fallback to first valid region, if any.
  return regions.find((r) => !r.disableReason)?.id;
};
