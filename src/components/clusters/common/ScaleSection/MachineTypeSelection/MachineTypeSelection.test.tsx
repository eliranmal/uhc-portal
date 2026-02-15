import React from 'react';
import { Formik } from 'formik';

import {
  CCSOneNodeRemainingQuotaList,
  CCSQuotaList,
  rhQuotaList,
} from '~/components/clusters/common/__tests__/quota.fixtures';
import { useGlobalState } from '~/redux/hooks';
import { mapMachineTypesById } from '~/redux/reducers/machineTypesReducer';
import { checkAccessibility, render, screen, within } from '~/testUtils';

import {
  baseFlavoursState,
  emptyMachineTypesResponse,
  errorFlavoursState,
  errorState,
  fulfilledFlavoursState,
  fulfilledMachineByRegionState,
  machineTypes,
  machineTypesResponse,
  organizationState,
  pendingFlavoursState,
  pendingState,
  unknownCategoryMachineTypes,
} from './fixtures';
import { MachineTypeSelection, MachineTypeSelectionProps } from './MachineTypeSelection';

const buildTestComponent = (children: React.ReactNode) => (
  <Formik initialValues={{}} onSubmit={jest.fn()}>
    {children}
  </Formik>
);

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));
const useGlobalStateMock = useGlobalState as jest.Mock;

const defaultProps: MachineTypeSelectionProps = {
  fieldId: 'machine_type',
  machineTypesResponse: emptyMachineTypesResponse,
  isMultiAz: false,
  isBYOC: false,
  cloudProviderID: 'aws',
  isMachinePool: false,
  productId: 'OSD',
  billingModel: 'standard',
  allExpanded: true,
  inModal: false,
};

const quotaAvailableProps: MachineTypeSelectionProps = {
  ...defaultProps,
  machineTypesResponse,
  isMultiAz: true,
};

const previousSelectionProps: MachineTypeSelectionProps = {
  ...defaultProps,
  machineTypesResponse,
  isMultiAz: true,
};

const byocProps: MachineTypeSelectionProps = {
  ...defaultProps,
  machineTypesResponse,
  isMultiAz: true,
  isBYOC: true,
};

describe('MachineTypeSelection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the machine types list is available', () => {
    describe('byoc with sufficient byoc quota available', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      // Arrange
      beforeEach(() => {
        useGlobalStateMock.mockReturnValue({
          flavours: fulfilledFlavoursState,
          machineTypesByRegion: fulfilledMachineByRegionState,
          organization: organizationState,
          quota: CCSQuotaList,
        });
      });

      it('displays only machine types with quota', async () => {
        // Act
        const { user } = render(buildTestComponent(<MachineTypeSelection {...byocProps} />));

        // Assert
        const optionsMenu = screen.getByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        expect(
          await screen.findByText('m5.xlarge - 4 vCPU 16 GiB RAM', { exact: false }),
        ).toBeInTheDocument();
      });
    });

    describe('with an error loading flavours', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        flavours: { ...errorFlavoursState, error: true },
        machineTypesByRegion: fulfilledMachineByRegionState,
        organization: organizationState,
      });

      it('displays "Not enough quota" error', async () => {
        // Act
        const { container } = render(
          buildTestComponent(<MachineTypeSelection {...defaultProps} />),
        );

        // Assert
        expect(
          within(screen.getByRole('alert')).getByText(
            'You do not have enough quota to create a cluster with the minimum required worker capacity.',
            { exact: false },
          ),
        ).toBeInTheDocument();
        await checkAccessibility(container);
      });
    });

    describe('with rhinfra quota available', () => {
      it('does not display ccs_only machine types, only machines with quota', async () => {
        // Arrange
        useGlobalStateMock.mockReturnValue({
          flavours: fulfilledFlavoursState,
          machineTypesByRegion: fulfilledMachineByRegionState,
          organization: organizationState,
          quota: rhQuotaList,
        });

        // Act
        const { user } = render(
          buildTestComponent(<MachineTypeSelection {...quotaAvailableProps} />),
        );

        // Assert
        const optionsMenu = screen.getByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        const options = screen
          .getAllByRole('treeitem')
          .map((option) => option.querySelector('.pf-v6-l-stack__item')?.textContent);

        expect(options).not.toContain('m5.12xlarge');
        expect(options).not.toContain('g4dn.2xlarge');
      });
    });

    describe('with rhinfra quota covering previous selection', () => {
      it('is accessible', async () => {
        // Act
        const { container } = render(
          buildTestComponent(<MachineTypeSelection {...previousSelectionProps} />),
        );
        await checkAccessibility(container);
      });

      it('does not display ccs_only machine types, only machines with quota', async () => {
        // Arrange
        useGlobalStateMock.mockReturnValue({
          flavours: baseFlavoursState,
          machineTypesByRegion: fulfilledMachineByRegionState,
          organization: organizationState,
          quota: rhQuotaList,
        });

        // Act
        const { user } = render(
          buildTestComponent(<MachineTypeSelection {...previousSelectionProps} />),
        );

        // Assert
        expect(screen.queryByText('m5.xlarge', { exact: false })).not.toBeInTheDocument();

        await user.click(screen.getByLabelText('Machine type select toggle'));

        expect(screen.getByText('m5.xlarge')).toBeInTheDocument();
        expect(screen.getByText('m5.4xlarge')).toBeInTheDocument();
        expect(screen.queryByText('m5.12xlarge')).not.toBeInTheDocument();
      });
    });

    describe('with rhinfra quota not covering previous selection', () => {
      it('does not display ccs_only machine types, only machines with quota', async () => {
        // Arrange
        useGlobalStateMock.mockReturnValue({
          flavours: fulfilledFlavoursState,
          machineTypesByRegion: fulfilledMachineByRegionState,
          organization: organizationState,
          quota: rhQuotaList,
        });

        // Act
        const { user } = render(
          buildTestComponent(<MachineTypeSelection {...previousSelectionProps} />),
        );

        // Assert
        const optionsMenu = screen.getByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        const options = screen
          .getAllByRole('treeitem')
          .map((option) => option.querySelector('.pf-v6-l-stack__item')?.textContent);

        expect(options).not.toContain('m5.12xlarge');
        expect(options).not.toContain('g4dn.2xlarge');
      });
    });

    describe('byoc lacking enough byoc node quota', () => {
      it('displays an alert', () => {
        // Arrange
        useGlobalStateMock.mockReturnValue({
          flavours: fulfilledFlavoursState,
          machineTypesByRegion: fulfilledMachineByRegionState,
          organization: organizationState,
          quota: CCSOneNodeRemainingQuotaList,
        });

        // Act
        render(buildTestComponent(<MachineTypeSelection {...byocProps} />));

        // Assert
        expect(
          within(screen.getByRole('alert')).getByText(
            'You do not have enough quota to create a cluster with the minimum required worker capacity.',
            { exact: false },
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('with an error loading machineTypes', () => {
    // todo - make this test pass by fixing the component.
    //        MachineTypeSelection stopped supporting showing an error message on fetch errors
    //        when the component was updated to accept the response `data` struct from react-query,
    //        instead of the whole response status that redux provided (including its `error` prop).
    //        see the fallback return value of the component (`return (activeMachineTypes as ErrorState)?.error ? ...`),
    //        which references the now missing `error` prop when `activeMachineTypes` is assigned with `machineTypesResponse`,
    //        and so never gets called.
    //        to fix this, we should propagate the error state from react-query's hook return value (i.e. `isError`)
    //        into the component as a new prop, and use it in place of the current `error` prop.
    it.skip('displays an error alert', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        flavours: fulfilledFlavoursState,
        machineTypesByRegion: errorState,
        organization: organizationState,
      });

      // Act
      render(buildTestComponent(<MachineTypeSelection {...defaultProps} />));

      // Assert
      expect(within(screen.getByRole('alert')).getByText('This is an error message'));
    });

    it('is accessible', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        flavours: fulfilledFlavoursState,
        machineTypesByRegion: errorState,
        organization: organizationState,
      });

      // Act
      const { container } = render(buildTestComponent(<MachineTypeSelection {...defaultProps} />));

      // Assert
      await checkAccessibility(container);
    });
  });

  describe('when the machine types list contains unknown categories', () => {
    // Arrange
    const moreTypes = {
      aws: [...(machineTypes?.aws ?? []), ...unknownCategoryMachineTypes],
    };

    const unknownCategoryProps = {
      ...defaultProps,
      machineTypesResponse: {
        types: moreTypes,
        typesByID: mapMachineTypesById(moreTypes),
      },
      isMultiAz: true,
      isBYOC: true,
    };

    describe('byoc with sufficient byoc quota available', () => {
      it('displays only machine types with quota from known categories', async () => {
        // Arrange
        useGlobalStateMock.mockReturnValue({
          flavours: fulfilledFlavoursState,
          machineTypesByRegion: fulfilledMachineByRegionState,
          organization: organizationState,
          quota: CCSQuotaList,
        });

        // Act
        const { user } = render(
          buildTestComponent(<MachineTypeSelection {...unknownCategoryProps} />),
        );

        // Assert
        const optionsMenu = await screen.findByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        const options = screen
          .getAllByRole('treeitem')
          .map((option) => option.querySelector('.pf-v6-l-stack__item')?.textContent);

        expect(options).toContain('m5.xlarge');
        expect(options).not.toContain('foo.2xbar');
      });
    });
  });

  describe('when the request is pending', () => {
    it('renders correctly', () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        flavours: pendingFlavoursState,
        machineTypesByRegion: pendingState,
        organization: organizationState,
      });

      // Act
      render(buildTestComponent(<MachineTypeSelection {...defaultProps} />));

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Loading node types...')).toBeInTheDocument();
    });

    it('is accessible', async () => {
      // Arrange
      useGlobalStateMock.mockReturnValue({
        flavours: pendingFlavoursState,
        machineTypesByRegion: pendingState,
        organization: organizationState,
      });

      // Act
      const { container } = render(buildTestComponent(<MachineTypeSelection {...defaultProps} />));

      // Assert
      await checkAccessibility(container);
    });
  });
});
