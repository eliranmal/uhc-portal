import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallPlatformAgnostic from '../InstallPlatformAgnostic';
import { version } from '../InstallTestConstants';

describe('Platform agnostic install', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallPlatformAgnostic />);

    expect(
      await screen.findByText('Create an OpenShift Cluster: Platform agnostic (x86_64)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallPlatformAgnostic />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on-premise_with_assisted_installer/installing-on-prem-assisted`,
    );

    expect(
      screen.getByRole('link', { name: /Learn more about local agent-based/ }),
    ).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_any_platform/installing-platform-agnostic`,
    );
  });
});
