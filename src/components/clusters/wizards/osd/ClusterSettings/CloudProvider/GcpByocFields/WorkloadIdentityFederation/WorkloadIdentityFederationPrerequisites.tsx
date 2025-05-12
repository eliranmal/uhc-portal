import React from 'react';

import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { Link } from '~/common/routing';
import ExternalLink from '~/components/common/ExternalLink';

const WorkloadIdentityFederationPrerequisites = () => (
  <div>
    <TextContent>
      <Text component={TextVariants.p} className="ocm-secondary-text">
        To provision your cluster, you must:
      </Text>

      <ul>
        <li>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            To use short-lived credentials,{' '}
            <Link to="/downloads" target="_blank">
              download
            </Link>{' '}
            and authenticate to the <code>ocm</code> CLI.
          </Text>
        </li>
        <li>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            <ExternalLink noIcon href={links.OSD_CCS_GCP_WIF_GCLOUD_CLI}>
              Download
            </ExternalLink>{' '}
            the <code>gcloud</code> CLI and use the{' '}
            <ExternalLink noIcon href={links.OSD_CCS_GCP_WIF_GCLOUD_CREDENTIALS}>
              Application Default Credentials{' '}
            </ExternalLink>{' '}
            to authenticate.
          </Text>
        </li>
        <li>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            Check your{' '}
            <ExternalLink noIcon href={links.OSD_CCS_GCP_LIMITS}>
              cluster resource requirements
            </ExternalLink>{' '}
            to make sure your Google Cloud account has the necessary resource quotas and limits to
            support the size cluster you want.
          </Text>
        </li>
        <li>
          <Text component={TextVariants.p} className="ocm-secondary-text">
            Optional: You have Enhanced Support from GCP. To prevent conflicts, make sure your
            project has no other provisioned resources before you provision OSD.{' '}
            <ExternalLink noIcon href={links.OSD_CCS_GCP}>
              Learn more
            </ExternalLink>
            .
          </Text>
        </li>
      </ul>
    </TextContent>
  </div>
);

export { WorkloadIdentityFederationPrerequisites };
