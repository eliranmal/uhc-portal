import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallGCP from '../InstallGCP';
import { version } from '../InstallTestConstants';

describe('InstallGCP', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallGCP />);

    expect(await screen.findByText('Create an OpenShift Cluster: GCP')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallGCP />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_gcp/installing-gcp-default`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_gcp/installing-gcp-user-infra`,
    );
  });
});
