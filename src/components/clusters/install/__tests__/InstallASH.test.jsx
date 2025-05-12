import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallASH from '../InstallASH';
import { version } from '../InstallTestConstants';

describe('InstallASH', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallASH />);

    expect(
      await screen.findByText('Create an OpenShift Cluster: Azure Stack Hub'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallASH />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_azure_stack_hub/installer-provisioned-infrastructure#ash-preparing-to-install-ipi`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_azure_stack_hub/user-provisioned-infrastructure#installing-azure-stack-hub-user-infra`,
    );
  });
});
