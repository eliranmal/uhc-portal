import React from 'react';

import {
  CCSOneNodeRemainingQuotaList,
  CCSQuotaList,
  rhQuotaList,
} from '~/components/clusters/common/__tests__/quota.fixtures';
import { mapMachineTypesById } from '~/redux/reducers/machineTypesReducer';
import { checkAccessibility, render, screen, waitFor, within } from '~/testUtils';

import MachineTypeSelection from './MachineTypeSelection';

const baseFlavoursState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  byID: {
    // actually contains 'osd-4' key, but not supposed to peek at it until fulfilled
  },
};

const fulfilledFlavoursState = {
  ...baseFlavoursState,
  fulfilled: true,
  byID: {
    'osd-4': {
      aws: {
        compute_instance_type: 'm5.xlarge',
      },
      gcp: {
        compute_instance_type: 'custom-4-16384', // TODO not listed in machineTypes
      },
    },
  },
};

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  types: {},
  typesByID: {},
};

const organizationState = {
  fulfilled: true,
  pending: false,
};

const machineTypes = {
  aws: [
    {
      kind: 'MachineType',
      name: 'm5.xlarge - General Purpose',
      category: 'general_purpose',
      size: 'small',
      id: 'm5.xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
      memory: {
        value: 17179869184,
        unit: 'B',
      },
      cpu: {
        value: 4,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: false,
      generic_name: 'standard-4',
    },
    {
      kind: 'MachineType',
      name: 'm5.4xlarge - General Purpose',
      category: 'general_purpose',
      size: 'large',
      id: 'm5.4xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.4xlarge',
      memory: {
        value: 68719476736,
        unit: 'B',
      },
      cpu: {
        value: 16,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: false,
      generic_name: 'standard-16',
    },
    {
      kind: 'MachineType',
      name: 'm5.12xlarge - General purpose',
      category: 'general_purpose',
      size: 'xxlarge',
      id: 'm5.12xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.12xlarge',
      memory: {
        value: 206158430208,
        unit: 'B',
      },
      cpu: {
        value: 48,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: true,
      generic_name: 'standard-48',
    },
    {
      kind: 'MachineType',
      name: 'g4dn.2xlarge - Accelerated Computing (1 GPU)',
      category: 'accelerated_computing',
      size: 'medium',
      id: 'g4dn.2xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/g4dn.2xlarge',
      memory: {
        value: 34359738368,
        unit: 'B',
      },
      cpu: {
        value: 8,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: true,
      generic_name: 't4-gpu-8',
    },
  ],
};

const machineTypesByRegion = {
  aws: [
    {
      kind: 'MachineType',
      name: 'm5.xlarge - General Purpose',
      category: 'general_purpose',
      size: 'small',
      id: 'm5.xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.xlarge',
      memory: {
        value: 17179869184,
        unit: 'B',
      },
      cpu: {
        value: 4,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: false,
      generic_name: 'standard-4',
    },
    {
      kind: 'MachineType',
      name: 'm5.4xlarge - General Purpose',
      category: 'general_purpose',
      size: 'large',
      id: 'm5.4xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m5.4xlarge',
      memory: {
        value: 68719476736,
        unit: 'B',
      },
      cpu: {
        value: 16,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: false,
      generic_name: 'standard-16',
    },
    {
      kind: 'MachineType',
      name: 'm6id.xlarge - Accelerated Computing (1 GPU)',
      category: 'accelerated_computing',
      size: 'medium',
      id: 'm6id.xlarge',
      href: '/api/clusters_mgmt/v1/machine_types/m6id.xlarge',
      memory: {
        value: 34359738368,
        unit: 'B',
      },
      cpu: {
        value: 8,
        unit: 'vCPU',
      },
      cloud_provider: {
        kind: 'CloudProviderLink',
        id: 'aws',
        href: '/api/clusters_mgmt/v1/cloud_providers/aws',
      },
      ccs_only: true,
      generic_name: 't4-gpu-8',
    },
  ],
};

const fulfilledMachineState = {
  ...baseState,
  fulfilled: true,
  types: machineTypes,
  typesByID: mapMachineTypesById(machineTypes),
};

const fulfilledMachineByRegionState = {
  ...baseState,
  fulfilled: true,
  types: machineTypes,
  typesByID: mapMachineTypesById(machineTypesByRegion),
};
const unknownCategoryMachineTypes = [
  {
    kind: 'MachineType',
    name: 'foo.2xbar - Quantum Computing (1 QPU)',
    category: 'foobar_computing',
    size: 'medium',
    id: 'foo.2xbar',
    href: '/api/clusters_mgmt/v1/machine_types/foo.2xbar',
    memory: {
      value: 34359738368,
      unit: 'B',
    },
    cpu: {
      value: 8,
      unit: 'vCPU',
    },
    cloud_provider: {
      kind: 'CloudProviderLink',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
    },
    ccs_only: false,
    generic_name: 'standard-4', // reusing existing one for simplicity, need to have quota for it.
  },
  {
    kind: 'MachineType',
    name: 'foo.4xbar - Quantum Computing (2 QPU)',
    category: 'foobar_computing',
    size: 'medium',
    id: 'foo.4xbar',
    href: '/api/clusters_mgmt/v1/machine_types/foo.4xbar',
    memory: {
      value: 34359738368,
      unit: 'B',
    },
    cpu: {
      value: 16,
      unit: 'vCPU',
    },
    cloud_provider: {
      kind: 'CloudProviderLink',
      id: 'aws',
      href: '/api/clusters_mgmt/v1/cloud_providers/aws',
    },
    ccs_only: false,
    generic_name: 'standard-4', // reusing existing one for simplicity, need to have quota for it.
  },
];

const fieldOnChange = jest.fn();

const fieldProps = (initialValue) => {
  const input = {
    value: initialValue,
    onChange: fieldOnChange,
  };
  return {
    input,
    meta: {
      error: false,
      touched: false,
    },
  };
};

const forceChoiceFieldOnChange = jest.fn();
const forceChoiceFieldProps = (initialValue) => {
  const input = {
    value: initialValue,
    onChange: forceChoiceFieldOnChange,
  };
  return {
    input,
    meta: {
      error: false,
      touched: false,
    },
  };
};

describe('MachineTypeSelection', () => {
  const getDefaultFlavour = jest.fn();
  const getMachineTypes = jest.fn();
  const field = fieldProps();
  const forceChoiceField = forceChoiceFieldProps();

  const defaultProps = {
    flavours: baseFlavoursState,
    machineTypesResponse: baseState,
    machineTypesByRegion: baseState,
    machine_type: field,
    machine_type_force_choice: forceChoiceField,
    isMultiAz: false,
    quota: {},
    organization: organizationState,
    getDefaultFlavour,
    getMachineTypes,
    isBYOC: false,
    cloudProviderID: 'aws',
    isMachinePool: false,
    product: 'OSD',
    billingModel: 'standard',
    allExpanded: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('flavours are fetched on render', () => {
    render(<MachineTypeSelection {...defaultProps} />);
    expect(getDefaultFlavour).toHaveBeenCalled();
  });

  describe('with an error loading machineTypes', () => {
    const errorState = {
      ...baseState,
      error: true,
      errorMessage: 'This is an error message',
    };

    const errorProps = {
      ...defaultProps,
      machineTypesResponse: errorState,
    };
    it('displays an error alert', async () => {
      const { container } = render(<MachineTypeSelection {...errorProps} />);
      expect(within(screen.getByRole('alert')).getByText('This is an error message'));
      await checkAccessibility(container);
    });
  });

  describe('when the request is pending', () => {
    const pendingFlavoursState = {
      ...baseFlavoursState,
      pending: true,
    };

    const pendingState = {
      ...baseState,
      pending: true,
      fulfilled: false,
    };

    const pendingProps = {
      ...defaultProps,
      flavours: pendingFlavoursState,
      machineTypesResponse: pendingState,
    };

    it('renders correctly', async () => {
      const { container } = render(<MachineTypeSelection {...pendingProps} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Loading node types...')).toBeInTheDocument();
      await checkAccessibility(container);
    });
  });

  describe('when the machine types list is available', () => {
    describe('with an error loading flavours', () => {
      const errorFlavoursState = {
        ...baseFlavoursState,
        error: true,
        errorMessage: 'Out of vanilla ice cream',
      };
      const errorProps = {
        ...defaultProps,
        flavours: errorFlavoursState,
        machineTypes: fulfilledMachineState,
        machineTypesByRegion: fulfilledMachineState,
      };

      it('displays an error', async () => {
        const { container } = render(<MachineTypeSelection {...errorProps} />);

        expect(
          within(screen.getByRole('alert')).getByText(
            'You do not have enough quota to create a cluster with the minimum required worker capacity.',
            { exact: false },
          ),
        ).toBeInTheDocument();
        await checkAccessibility(container);
      });

      it('does not select default', () => {
        render(<MachineTypeSelection {...errorProps} />);
        expect(fieldOnChange).not.toHaveBeenCalled();
      });
    });

    describe('with rhinfra quota available', () => {
      const quota = rhQuotaList;

      const quotaAvailableProps = {
        ...defaultProps,
        flavours: fulfilledFlavoursState,
        machineTypesResponse: fulfilledMachineState,
        machineTypesByRegion: fulfilledMachineState,
        quota,
        isMultiAz: true,
      };

      it('selects default according to flavours API', async () => {
        render(<MachineTypeSelection {...quotaAvailableProps} />);

        await waitFor(() => expect(fieldOnChange).toBeCalledWith('m5.xlarge'));
      });

      it('does not display ccs_only machine types, only machines with quota', async () => {
        const { user } = render(<MachineTypeSelection {...quotaAvailableProps} />);

        const optionsMenu = screen.getByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        const options = screen
          .getAllByRole('treeitem')
          .map((option) => option.querySelector('.pf-v5-l-stack__item').textContent);

        expect(options).not.toContain('m5.12xlarge');
        expect(options).not.toContain('g4dn.2xlarge');
      });
    });

    describe('with rhinfra quota covering previous selection', () => {
      const quota = rhQuotaList;
      const field = fieldProps('m5.4xlarge');

      const previousSelectionProps = {
        ...defaultProps,
        flavours: fulfilledFlavoursState,
        machineTypesResponse: fulfilledMachineState,
        machineTypesByRegion: fulfilledMachineState,
        machine_type: field,
        quota,
        isMultiAz: true,
      };

      it('is accessible', async () => {
        const { container } = render(<MachineTypeSelection {...previousSelectionProps} />);
        await checkAccessibility(container);
      });

      it('keeps selection', () => {
        render(<MachineTypeSelection {...previousSelectionProps} />);
        expect(fieldOnChange).not.toHaveBeenCalled();
      });

      it('does not display ccs_only machine types, only machines with quota', async () => {
        const { user } = render(<MachineTypeSelection {...previousSelectionProps} />);
        expect(screen.queryByText('m5.xlarge', { exact: false })).not.toBeInTheDocument();

        await user.click(screen.getByLabelText('Machine type select toggle'));

        expect(screen.getByText('m5.xlarge')).toBeInTheDocument();
        expect(screen.getByText('m5.4xlarge')).toBeInTheDocument();
        expect(screen.queryByText('m5.12xlarge')).not.toBeInTheDocument();
      });
    });

    describe('with rhinfra quota not covering previous selection', () => {
      const quota = rhQuotaList;
      const field = fieldProps('m5.12xlarge');

      const previousSelectionProps = {
        ...defaultProps,
        flavours: fulfilledFlavoursState,
        machineTypesResponse: fulfilledMachineState,
        machineTypesByRegion: fulfilledMachineState,
        machine_type: field,
        quota,
        isMultiAz: true,
      };

      it('clears selection to force manual choice', async () => {
        render(<MachineTypeSelection {...previousSelectionProps} />);
        await waitFor(() => {
          expect(field.input.onChange).toHaveBeenCalledWith('');
        });
        expect(forceChoiceFieldOnChange).toHaveBeenCalledWith(true);
      });

      it('does not display ccs_only machine types, only machines with quota', async () => {
        const { user } = render(<MachineTypeSelection {...previousSelectionProps} />);

        const optionsMenu = screen.getByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        const options = screen
          .getAllByRole('treeitem')
          .map((option) => option.querySelector('.pf-v5-l-stack__item').textContent);

        expect(options).not.toContain('m5.12xlarge');
        expect(options).not.toContain('g4dn.2xlarge');
      });
    });

    describe('byoc with sufficient byoc quota available', () => {
      const quota = CCSQuotaList;
      const field = fieldProps('m6id.xlarge');
      const byocProps = {
        ...defaultProps,
        flavours: fulfilledFlavoursState,
        machineTypesResponse: fulfilledMachineState,
        machineTypesByRegion: fulfilledMachineByRegionState,
        quota,
        isMultiAz: true,
        isBYOC: true,
      };

      it('selects default according to flavours API', async () => {
        render(<MachineTypeSelection {...byocProps} />);

        await waitFor(() => expect(fieldOnChange).toHaveBeenCalledWith('m5.xlarge'));
      });

      it('displays only machine types with quota', async () => {
        const { user } = render(<MachineTypeSelection {...byocProps} />);

        const optionsMenu = screen.getByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        expect(await screen.findByText('m5.xlarge', { exact: false })).toBeInTheDocument();
      });

      it('keeps selection from machineTypesByRegion', async () => {
        render(<MachineTypeSelection {...byocProps} machine_type={field} />);
        expect(forceChoiceFieldOnChange).toHaveBeenCalledWith(true);
      });
    });

    describe('byoc lacking enough byoc node quota', () => {
      const quota = CCSOneNodeRemainingQuotaList;

      const byocProps = {
        ...defaultProps,
        flavours: fulfilledFlavoursState,
        machineTypesResponse: fulfilledMachineState,
        machineTypesByRegion: fulfilledMachineState,
        quota,
        isMultiAz: true,
        isBYOC: true,
      };

      it('displays an alert', () => {
        render(<MachineTypeSelection {...byocProps} />);

        expect(
          within(screen.getByRole('alert')).getByText(
            'You do not have enough quota to create a cluster with the minimum required worker capacity.',
            { exact: false },
          ),
        ).toBeInTheDocument();
      });

      it('does not select default', () => {
        render(<MachineTypeSelection {...byocProps} />);
        expect(fieldOnChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the machine types list contains unknown categories', () => {
    const moreTypes = {
      aws: [...machineTypes.aws, ...unknownCategoryMachineTypes],
    };
    const state = {
      ...baseState,
      fulfilled: true,
      types: moreTypes,
      typesByID: mapMachineTypesById(moreTypes),
    };
    const quota = CCSQuotaList;

    const unknownCategoryProps = {
      ...defaultProps,
      machineTypesResponse: state,
      machineTypesByRegion: state,
      flavours: fulfilledFlavoursState,
      isMultiAz: true,
      isBYOC: true,
      quota,
    };

    describe('byoc with sufficient byoc quota available', () => {
      it('selects default according to flavours API', async () => {
        render(<MachineTypeSelection {...unknownCategoryProps} />);

        await waitFor(() => expect(fieldOnChange).toHaveBeenCalledWith('m5.xlarge'));
      });

      it('displays only machine types with quota from known categories', async () => {
        const { user } = render(<MachineTypeSelection {...unknownCategoryProps} />);

        const optionsMenu = await screen.findByLabelText('Machine type select toggle');
        await user.click(optionsMenu);

        const options = screen
          .getAllByRole('treeitem')
          .map((option) => option.querySelector('.pf-v5-l-stack__item').textContent);

        expect(options).toContain('m5.xlarge');
        expect(options).not.toContain('foo.2xbar');
      });
    });
  });
});
