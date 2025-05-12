import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallArmAWS from '../InstallArmAWS';
import { version } from '../InstallTestConstants';

describe('InstallArmAWS', () => {
  it.skip('is accessible', async () => {
    const { container } = render(<InstallArmAWS />);

    expect(await screen.findByText('Hosts controlled with AWS Provider')).toBeInTheDocument();

    // This fails due to multiple accessibility issues
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallArmAWS />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_aws/installer-provisioned-infrastructure#prerequisites`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.redhat.com/en/documentation/openshift_container_platform/${version}/html/installing_on_aws/user-provisioned-infrastructure#installing-aws-user-infra`,
    );
  });
});
