import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallPower from '../InstallPower';
import { version } from '../InstallTestConstants';

describe('InstallPower', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallPower />);

    expect(
      await screen.findByText('Create an OpenShift Cluster: IBM Power (ppc64le)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallPower />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on-premise_with_assisted_installer/installing-on-prem-assisted`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_ibm_power/installing-ibm-power`,
    );
  });
});
