import React from 'react';

import { render } from '~/testUtils';

import * as useClusterWizardResetStepsHook from '../hooks/useClusterWizardResetStepsHook';

import { CreateOsdWizard } from './CreateOsdWizard';

const isWizardParentStepSpy = jest.spyOn(
  useClusterWizardResetStepsHook,
  'useClusterWizardResetStepsHook',
);

describe('CreateOsdWizard', () => {
  it('is useClusterWizardResetStepsHook called', () => {
    // Act
    render(<CreateOsdWizard />);

    // Assert
    expect(isWizardParentStepSpy).toHaveBeenCalledWith({
      currentStep: undefined,
      values: expect.any(Object),
      wizardContextRef: { current: undefined },
    });
  });
});
