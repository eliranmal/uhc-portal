import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallArmBareMetal from '../InstallArmBareMetal';
import { version } from '../InstallTestConstants';

describe('ARM Bare Metal install', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallArmBareMetal />);

    expect(screen.getByText('ARM Bare Metal')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallArmBareMetal />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on-premise_with_assisted_installer/installing-on-prem-assisted`,
    );
    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_bare_metal/installer-provisioned-infrastructure#ipi-install-overview`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_bare_metal/user-provisioned-infrastructure#installing-bare-metal`,
    );
  });
});
