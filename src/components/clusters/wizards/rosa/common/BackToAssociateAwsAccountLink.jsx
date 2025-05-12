import React from 'react';

import { Button, useWizardContext } from '@patternfly/react-core';

import { getAccountAndRolesStepId } from '~/components/clusters/wizards/rosa/rosaWizardConstants';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/queries/featureGates/featureConstants';
import { useFeatureGate } from '~/queries/featureGates/useFetchFeatureGate';

export const BackToAssociateAwsAccountLink = () => {
  const { goToStepById } = useWizardContext();
  const isHypershiftEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);
  const accountStepId = getAccountAndRolesStepId(isHypershiftEnabled);
  return (
    <Button variant="link" isInline onClick={() => goToStepById(accountStepId)}>
      Back to associate AWS account
    </Button>
  );
};
