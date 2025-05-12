import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { InstallComponentWrapper } from './InstallWrapper';
import { AlibabaProps, ArmAWSIPIProps } from './InstallWrapperPropsData';

describe('Install generic component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Installer wrapper', () => {
    // html violations in Patternfly component
    it.skip('is accessible', async () => {
      const { container } = render(
        <InstallComponentWrapper propsData={ArmAWSIPIProps} componentChooser="ocpInstructions" />,
      );

      expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
      await checkAccessibility(container);
    });

    it('renders OCP Instructions component', async () => {
      render(
        <InstallComponentWrapper propsData={ArmAWSIPIProps} componentChooser="ocpInstructions" />,
      );

      const title = await screen.findByText('Amazon Web Services (ARM)');
      expect(title).toBeInTheDocument();
    });

    it('renders Instruction Chooser component', async () => {
      render(
        <InstallComponentWrapper propsData={AlibabaProps} componentChooser="instructionsChooser" />,
      );

      const title = await screen.findByText('Alibaba Cloud');
      expect(title).toBeInTheDocument();
    });
  });
});
