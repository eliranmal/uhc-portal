import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallAzure from '../InstallAzure';
import { version } from '../InstallTestConstants';

describe('InstallAzure', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallAzure />);

    expect(await screen.findByText('Create an OpenShift Cluster: Azure')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallAzure />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_azure/installer-provisioned-infrastructure#installation-launching-installer_installing-azure-default`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_azure/user-provisioned-infrastructure#installing-azure-user-infra`,
    );
  });
});
