import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { InstallComponentWrapper } from './InstallWrapper';
import { AlibabaProps, ArmAWSIPIProps } from './InstallWrapperPropsData';

const GenericWrapperProps = {
  instructionChooserProps: AlibabaProps,
  ocpInstructionProps: ArmAWSIPIProps,
};

describe('Install generic component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Installer wrapper', () => {
    it.skip('is accessible', async () => {
      const { container } = render(<InstallComponentWrapper {...GenericWrapperProps} />);

      expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
      await checkAccessibility(container);
    });

    it('renders OCP Instructions component', async () => {
      render(<InstallComponentWrapper {...GenericWrapperProps} />);

      const title = await screen.findByText('Amazon Web Services (ARM)');
      expect(title).toBeInTheDocument();
    });

    it('renders Instruction Chooser component', async () => {
      const updatedGenericWrapperProps = {
        ...GenericWrapperProps,
        instructionChooser: true,
      };
      render(<InstallComponentWrapper {...updatedGenericWrapperProps} />);

      const title = await screen.findByText('Alibaba Cloud');
      expect(title).toBeInTheDocument();
    });
  });
});
