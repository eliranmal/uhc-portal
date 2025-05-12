import React from 'react';

import { Card, CardBody, CardTitle, Text, TextVariants, Title } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

import TerraformLogo from './TerraformLogo';

const WithTerraform = () => (
  <Card isFlat isFullHeight data-testid="deploy-with-terraform-card">
    <CardTitle>
      <Title headingLevel="h3" size="lg">
        <TerraformLogo className="ocm-c-wizard-get-started-terraform--card-icon " />
        {/* <DesktopIcon className="ocm-c-wizard-get-started--card-icon" /> */}
        Deploy with Terraform
      </Title>
    </CardTitle>
    <CardBody>
      <Text component={TextVariants.p} className="pf-v5-u-mb-sm">
        Create a ROSA HCP cluster using Terraform
      </Text>
      <Text component={TextVariants.p} className="pf-v5-u-mb-sm">
        Learn how to{' '}
        <ExternalLink href={links.TERRAFORM_ROSA_HCP_URL}>deploy a ROSA HCP cluster</ExternalLink>
        or{' '}
        <ExternalLink href={links.TERRAFORM_REGISTRY_ROSA_HCP}>
          visit the Terraform registry
        </ExternalLink>
      </Text>
    </CardBody>
  </Card>
);

export default WithTerraform;
