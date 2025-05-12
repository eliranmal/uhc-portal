import * as React from 'react';
import { FormikValues } from 'formik';

import { isWizardParentStep, WizardStepType } from '@patternfly/react-core';
import { WizardContextProps } from '@patternfly/react-core/dist/esm/components/Wizard/WizardContext';

export const useClusterWizardResetStepsHook = ({
  currentStep,
  values,
  wizardContextRef,
  additionalStepIndex,
  additionalCondition,
}: {
  currentStep?: WizardStepType;
  values: FormikValues;
  wizardContextRef: React.MutableRefObject<Partial<WizardContextProps> | undefined>;
  additionalStepIndex?: number | string;
  additionalCondition?: boolean;
}) => {
  React.useEffect(() => {
    if (!currentStep) {
      return;
    }

    const steps = wizardContextRef?.current?.steps || [];
    const setStep = wizardContextRef?.current?.setStep || (() => {});

    for (let i = currentStep.index; i < steps.length; i += 1) {
      const nextStep = steps[i];
      const isParentStep = isWizardParentStep(nextStep);

      if (!isParentStep && !nextStep.isHidden) {
        if (nextStep.isVisited === false) {
          // specifically check for false, since undefined is valid
          // can break out early if isVisited is false for the remainder
          break;
        }
        // unvisit if step is past the current step that has had a form change
        const afterChangedStep = nextStep.index > currentStep.index;

        if (additionalStepIndex && additionalCondition) {
          const additionalCheck = nextStep.id > additionalStepIndex && additionalCondition;
          // Exclusions: Not all form changes must cause following steps to be unvisited, i.e. the cluster name
          // Custom code can be added here to exclude some fields
          setStep({
            ...nextStep,
            isVisited: !afterChangedStep && !additionalCheck,
          });
        } else {
          // Exclusions: Not all form changes must cause following steps to be unvisited, i.e. the cluster name
          // Custom code can be added here to exclude some fields
          setStep({
            ...nextStep,
            isVisited: !afterChangedStep,
          });
        }
      } else if (!isParentStep && nextStep.isHidden) {
        setStep({
          ...nextStep,
          isVisited: undefined,
        });
      }
    }
    // Only run useEffect on value changes, not anything else
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
};
