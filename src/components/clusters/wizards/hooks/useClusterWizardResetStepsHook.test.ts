import React from 'react';

import * as ReactCore from '@patternfly/react-core';
import { WizardContextProps } from '@patternfly/react-core/dist/esm/components/Wizard/WizardContext';

import { renderHook } from '~/testUtils';

import { useClusterWizardResetStepsHook } from './useClusterWizardResetStepsHook';

jest.mock('@patternfly/react-core', () => ({
  __esModule: true,
  ...jest.requireActual('@patternfly/react-core'),
}));

const isWizardParentStepSpy = jest.spyOn(ReactCore, 'isWizardParentStep');

describe('useClusterWizardResetStepsHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('no steps to perform opeations to', () =>
    it.each([
      [
        'wizardContextRef',
        {} as React.MutableRefObject<Partial<WizardContextProps> | undefined>,
        undefined,
      ],
      [
        'wizardContextRef.current undefined',
        { current: undefined } as React.MutableRefObject<Partial<WizardContextProps> | undefined>,
        undefined,
      ],
      [
        'steps undefined',
        { current: { steps: undefined } } as React.MutableRefObject<
          Partial<WizardContextProps> | undefined
        >,
        undefined,
      ],
      [
        'steps empty',
        { current: { steps: [] } } as React.MutableRefObject<
          Partial<WizardContextProps> | undefined
        >,
        undefined,
      ],
      [
        'with steps but currentStep',
        { current: { steps: [{ name: 'y', id: 1, index: 1 }] } } as React.MutableRefObject<
          Partial<WizardContextProps> | undefined
        >,
        undefined,
      ],
      [
        'with steps, currentStep.index equal than steps length',
        { current: { steps: [{ name: 'y', id: 1, index: 1 }] } } as React.MutableRefObject<
          Partial<WizardContextProps> | undefined
        >,
        { name: 'x', id: 1, index: 1 },
      ],
      [
        'with steps, currentStep.index greater than steps length',
        { current: { steps: [{ name: 'y', id: 1, index: 1 }] } } as React.MutableRefObject<
          Partial<WizardContextProps> | undefined
        >,
        { name: 'x', id: 2, index: 1 },
      ],
    ])(
      '%s',
      async (
        _title: string,
        wizardContextRef: React.MutableRefObject<Partial<WizardContextProps> | undefined>,
        currentStep: ReactCore.WizardStepType | undefined,
      ) => {
        // Act
        await renderHook(() =>
          useClusterWizardResetStepsHook({ values: {}, wizardContextRef, currentStep }),
        );

        // Assert
        expect(isWizardParentStepSpy).toHaveBeenCalledTimes(0);
      },
    ));

  describe('with steps to perform opeations to. setStep not called', () =>
    it.each([
      [
        'with steps, currentStep.index lower than steps length. is not hidden is parent',
        [{ name: 'y', id: 1, index: 1, isHidden: false }],
        { name: 'x', id: 1, index: 0 },
        true,
      ],
      [
        'with steps, currentStep.index lower than steps length. is not hidden is not parent and it is not visited',
        [{ name: 'y', id: 1, index: 1, isHidden: false, isVisited: false }],
        { name: 'x', id: 1, index: 0 },
        false,
      ],
    ])(
      '%s',
      async (
        _title: string,
        steps: ReactCore.WizardStepType[],
        currentStep: ReactCore.WizardStepType | undefined,
        isParentStepValue: boolean,
      ) => {
        // Arrange
        const setStepMock = jest.fn();
        isWizardParentStepSpy.mockReturnValueOnce(isParentStepValue);

        // Act
        await renderHook(() =>
          useClusterWizardResetStepsHook({
            values: {},
            wizardContextRef: {
              current: { steps, setStep: setStepMock },
            } as React.MutableRefObject<Partial<WizardContextProps> | undefined>,
            currentStep,
          }),
        );

        // Assert
        expect(isWizardParentStepSpy).toHaveBeenCalledTimes(1);
        expect(setStepMock).toHaveBeenCalledTimes(0);
      },
    ));

  describe('with steps to perform opeations to. isVisited to undefined', () =>
    it.each([
      [
        'with steps, currentStep.index lower than steps length. is hidden is not parent',
        [{ name: 'y', id: 1, index: 1, isHidden: true }],
        { name: 'x', id: 1, index: 0 },
        false,
      ],
    ])(
      '%s',
      async (
        _title: string,
        steps: ReactCore.WizardStepType[],
        currentStep: ReactCore.WizardStepType | undefined,
        isParentStepValue: boolean,
      ) => {
        // Arrange
        const setStepMock = jest.fn();
        isWizardParentStepSpy.mockReturnValueOnce(isParentStepValue);

        // Act
        await renderHook(() =>
          useClusterWizardResetStepsHook({
            values: {},
            wizardContextRef: {
              current: { steps, setStep: setStepMock },
            } as React.MutableRefObject<Partial<WizardContextProps> | undefined>,
            currentStep,
          }),
        );

        // Assert
        expect(isWizardParentStepSpy).toHaveBeenCalledTimes(1);
        expect(setStepMock).toHaveBeenCalledWith({ ...steps[0], isVisited: undefined });
      },
    ));

  describe('with steps to perform opeations to. isVisited', () =>
    it.each([
      [
        'is after changed step',
        [{ name: 'y', id: 1, index: 1, isHidden: false, isVisited: true }],
        { name: 'x', id: 1, index: 0 },
        undefined,
        undefined,
        false,
      ],
      [
        'is not after changed step',
        [
          { name: 'y', id: 1, index: 0, isHidden: false, isVisited: true },
          { name: 'y2', id: 2, index: 0, isHidden: false, isVisited: true },
        ],
        { name: 'x', id: 1, index: 1 },
        undefined,
        undefined,
        true,
      ],
      [
        'is not after changed step. additionalStepIndex but additionalCondition',
        [
          { name: 'y', id: 1, index: 0, isHidden: false, isVisited: true },
          { name: 'y2', id: 2, index: 0, isHidden: false, isVisited: true },
        ],
        { name: 'x', id: 1, index: 1 },
        1,
        undefined,
        true,
      ],
      [
        'is not after changed step. additionalCondition but additionalStepIndex',
        [
          { name: 'y', id: 1, index: 0, isHidden: false, isVisited: true },
          { name: 'y2', id: 2, index: 0, isHidden: false, isVisited: true },
        ],
        { name: 'x', id: 1, index: 1 },
        undefined,
        true,
        true,
      ],
      [
        'is not after changed step. additionalStepIndex lower than nextStep.id and additionalCondition',
        [
          { name: 'y', id: 1, index: 0, isHidden: false, isVisited: true },
          { name: 'y2', id: 2, index: 0, isHidden: false, isVisited: true },
        ],
        { name: 'x', id: 1, index: 1 },
        1,
        true,
        false,
      ],
      [
        'is not after changed step. additionalStepIndex lower than nextStep.id and not additionalCondition',
        [
          { name: 'y', id: 1, index: 0, isHidden: false, isVisited: true },
          { name: 'y2', id: 2, index: 0, isHidden: false, isVisited: true },
        ],
        { name: 'x', id: 1, index: 1 },
        1,
        false,
        true,
      ],
      [
        'is not after changed step. additionalStepIndex ge than nextStep.id and additionalCondition',
        [
          { name: 'y', id: 1, index: 0, isHidden: false, isVisited: true },
          { name: 'y2', id: 2, index: 0, isHidden: false, isVisited: true },
        ],
        { name: 'x', id: 1, index: 1 },
        3,
        true,
        true,
      ],
      [
        'is not after changed step. additionalStepIndex ge than nextStep.id and not additionalCondition',
        [
          { name: 'y', id: 1, index: 0, isHidden: false, isVisited: true },
          { name: 'y2', id: 2, index: 0, isHidden: false, isVisited: true },
        ],
        { name: 'x', id: 1, index: 1 },
        3,
        false,
        true,
      ],
    ])(
      '%s',
      async (
        _title: string,
        steps: ReactCore.WizardStepType[],
        currentStep: ReactCore.WizardStepType | undefined,
        additionalStepIndex: number | string | undefined,
        additionalCondition: boolean | undefined,
        expectedIsVisited: boolean,
      ) => {
        // Arrange
        const setStepMock = jest.fn();
        isWizardParentStepSpy.mockReturnValueOnce(false);

        // Act
        await renderHook(() =>
          useClusterWizardResetStepsHook({
            values: {},
            wizardContextRef: {
              current: { steps, setStep: setStepMock },
            } as React.MutableRefObject<Partial<WizardContextProps> | undefined>,
            currentStep,
            additionalStepIndex,
            additionalCondition,
          }),
        );

        // Assert
        expect(isWizardParentStepSpy).toHaveBeenCalledTimes(1);
        expect(setStepMock).toHaveBeenCalledWith({
          ...steps[steps.length - 1],
          isVisited: expectedIsVisited,
        });
      },
    ));
});
