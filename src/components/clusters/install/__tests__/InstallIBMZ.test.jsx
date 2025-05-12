import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallIBMZ from '../InstallIBMZ';
import { version } from '../InstallTestConstants';

describe('InstallIBMZ', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallIBMZ />);

    expect(
      await screen.findByText('Create an OpenShift Cluster: IBM Z (s390x)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallIBMZ />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on-premise_with_assisted_installer/installing-on-prem-assisted`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_ibm_z_and_ibm_linuxone/user-provisioned-infrastructure#installing-ibm-z-reqs`,
    );
  });
});
