import React from 'react';

import { useFetchCloudProviders } from '~/queries/common/useFetchCloudProviders';

export type ClusterLocationLabelProps = {
  regionID: string;
  cloudProviderID: string;
};

export const ClusterLocationLabel = ({ regionID, cloudProviderID }: ClusterLocationLabelProps) => {
  const { data: cloudProviders } = useFetchCloudProviders();

  return (
    <>
      {cloudProviders?.[cloudProviderID]?.display_name
        ? cloudProviders?.[cloudProviderID].display_name
        : cloudProviderID.toUpperCase()}
      {regionID !== 'N/A' && ` (${regionID})`}
    </>
  );
};

export default ClusterLocationLabel;
