import React from 'react';
import PropTypes from 'prop-types';

import {
  Divider,
  Icon,
  Label,
  PageSection,
  Split,
  SplitItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';

import { trackEvents } from '~/common/analytics';
import useAnalytics from '~/hooks/useAnalytics';

import links, { channels, tools } from '../../../common/installLinks.mjs';
import Instruction from '../../common/Instruction';
import Instructions from '../../common/Instructions';
import DownloadAndOSSelection from '../install/instructions/components/DownloadAndOSSelection';
import PullSecretSection from '../install/instructions/components/PullSecretSection';
import TokenErrorAlert from '../install/instructions/components/TokenErrorAlert';

const pendoID = window.location.pathname;
const docURL = links.OPENSHIFT_LOCAL_SUPPORT_AND_COMMUNITY_DOCS;

const LocalTab = ({ token }) => {
  const track = useAnalytics();
  return (
    <PageSection className="pf-v5-u-p-lg">
      <Split hasGutter>
        <Title headingLevel="h2">Red Hat OpenShift Local</Title>
        <SplitItem>
          <Label variant="outline">local sandbox</Label>
        </SplitItem>
      </Split>
      <TextContent>
        <Text component="p">
          Create a minimal cluster on your desktop/laptop for local development and testing.
        </Text>
        <Text component="p" className="ocm-secondary-text">
          <b>Note: </b>
          Your OpenShift Local installation won&apos;t appear in the OpenShift Cluster Manager
          unless you enable cluster monitoring and telemetry.
        </Text>
      </TextContent>
      <Divider className="pf-v5-u-mt-lg pf-v5-u-mb-xl" />
      {token.error && (
        <>
          <TokenErrorAlert token={token} />
          <div className="pf-v5-u-mb-lg" />
        </>
      )}
      <Instructions>
        <Instruction>
          <Text component="h3">Download what you need to get started</Text>
          <Text component="h4">OpenShift Local</Text>
          <DownloadAndOSSelection tool={tools.CRC} channel={channels.STABLE} pendoID={pendoID} />
          <Text component="h3">Pull secret</Text>
          <PullSecretSection token={token} pendoID={pendoID} />
        </Instruction>
        <Instruction>
          <Text component="h3">Follow the documentation to install OpenShift Local</Text>
          <Text component="p">
            Run <code>crc setup</code> to set up your host operating system for the OpenShift Local
            virtual machine.
          </Text>
          <Text component="p">
            Then, run <code>crc start</code> to create a minimal OpenShift 4 cluster on your
            computer.
          </Text>
          <Text component="p">
            <a
              href={docURL}
              rel="noreferrer noopener"
              target="_blank"
              onClick={() => {
                track(trackEvents.CRCInstallDocumentation, {
                  url: docURL,
                  path: pendoID,
                });
              }}
            >
              For more information on the OpenShift Local support and community docs click here{' '}
              <Icon size="sm">
                <ExternalLinkAltIcon color="#0066cc" />
              </Icon>
            </a>
          </Text>
        </Instruction>
      </Instructions>
    </PageSection>
  );
};

LocalTab.propTypes = {
  token: PropTypes.object.isRequired,
};

export default LocalTab;
