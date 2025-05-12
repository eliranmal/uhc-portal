import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallOSP from '../InstallOSP';
import { version } from '../InstallTestConstants';

describe('InstallOSP', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallOSP />);

    expect(await screen.findByText('Create an OpenShift Cluster: OpenStack')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallOSP />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_openstack/installing-openstack-installer-custom`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_openstack/installing-openstack-user`,
    );
  });
});
