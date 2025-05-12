import React from 'react';

import { ExpandableSection } from '@patternfly/react-core';

import { isCompatibleFeature, SupportedFeature } from '~/common/featureCompatibility';
import WithTooltip from '~/components/common/WithTooltip';
import { ClusterFromSubscription } from '~/types/types';

import EditSecurityGroupsField from './EditSecurityGroupsField';

export interface EditSecurityGroupsSectionProps {
  cluster: ClusterFromSubscription;
  isReadOnly: boolean;
}

const EditSecurityGroupsSection = ({ cluster, isReadOnly }: EditSecurityGroupsSectionProps) => {
  const showSecurityGroupSection = isCompatibleFeature(SupportedFeature.SECURITY_GROUPS, cluster);

  return showSecurityGroupSection ? (
    <ExpandableSection
      toggleContent={
        <WithTooltip
          showTooltip={isReadOnly}
          content="This option cannot be edited from its original setting selection."
        >
          <span>Security groups</span>
        </WithTooltip>
      }
    >
      <EditSecurityGroupsField cluster={cluster} isReadOnly={isReadOnly} />
    </ExpandableSection>
  ) : null;
};

export default EditSecurityGroupsSection;
