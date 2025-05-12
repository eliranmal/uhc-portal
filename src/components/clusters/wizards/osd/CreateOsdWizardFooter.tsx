import React, { useEffect, useState } from 'react';
import { setNestedObjectValues } from 'formik';

import { Button, useWizardContext, WizardFooterWrapper } from '@patternfly/react-core';
import { WizardContextProps } from '@patternfly/react-core/dist/esm/components/Wizard/WizardContext';

import { scrollToFirstField } from '~/common/helpers';
import { getScrollErrorIds } from '~/components/clusters/wizards/form/utils';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { StepId } from '~/components/clusters/wizards/osd/constants';
import { useGlobalState } from '~/redux/hooks/useGlobalState';

interface CreateOsdWizardFooterProps {
  isLoading?: boolean;
  onNext?(): void | Promise<void>;
  track?(): void;
  onWizardContextChange(context: Partial<WizardContextProps>): void;
}

export const CreateOsdWizardFooter = ({
  isLoading,
  onNext,
  track = () => {},
  onWizardContextChange,
}: CreateOsdWizardFooterProps) => {
  const { goToNextStep, goToPrevStep, close, activeStep, steps, setStep, goToStepById } =
    useWizardContext();
  const { values, validateForm, setTouched, isValidating, submitForm } = useFormState();
  // used to determine the actions' disabled state.
  // (as a more exclusive rule than isValidating, which relying upon would block progress to the next step)
  const [isNextDeferred, setIsNextDeferred] = useState<boolean>(false);

  useEffect(() => {
    // callback to pass updated context back up
    onWizardContextChange({
      steps,
      setStep,
      goToStepById,
    });
  }, [steps, setStep, goToStepById, onWizardContextChange]);

  const createClusterResponse = useGlobalState((state) => state.clusters.createdCluster);
  const isSubmitting = createClusterResponse.pending;

  const isButtonLoading = isValidating || isLoading;
  const isButtonDisabled = isNextDeferred || isLoading;

  const onValidateNext = async () => {
    // defer execution until any ongoing validation is done
    if (isValidating) {
      if (!isNextDeferred) {
        setIsNextDeferred(true);
      }
      return;
    }

    const errors = await validateForm(values);

    if (Object.keys(errors || {}).length > 0) {
      setTouched(setNestedObjectValues(errors, true));
      scrollToFirstField(getScrollErrorIds(errors));

      return;
    }

    (onNext ?? goToNextStep)();
  };

  useEffect(() => {
    // if "next" invocation was deferred due to earlier ongoing validation,
    // revive the invocation when the validation is done.
    if (isNextDeferred && isValidating === false) {
      setIsNextDeferred(false);
      onValidateNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating, isNextDeferred]);

  return isSubmitting ? null : (
    <WizardFooterWrapper>
      {activeStep.id === StepId.Review ? (
        <Button
          variant="primary"
          data-testid="wizard-create-cluster-button"
          onClick={() => {
            submitForm();
            track();
          }}
          isLoading={isButtonLoading}
          isDisabled={isButtonDisabled}
        >
          Create cluster
        </Button>
      ) : (
        <Button
          variant="primary"
          data-testid="wizard-next-button"
          onClick={onValidateNext}
          isLoading={isButtonLoading}
          isDisabled={isButtonDisabled}
        >
          Next
        </Button>
      )}
      <Button
        variant="secondary"
        data-testid="wizard-back-button"
        onClick={goToPrevStep}
        isDisabled={isButtonDisabled || steps.indexOf(activeStep) === 0}
      >
        Back
      </Button>
      <Button
        variant="link"
        data-testid="wizard-cancel-button"
        onClick={close}
        isDisabled={isButtonDisabled}
      >
        Cancel
      </Button>
    </WizardFooterWrapper>
  );
};
