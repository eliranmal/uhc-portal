/*
Copyright (c) 2019 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// This component shows to the user the OpenID refresh token, so that she can
// copy it and use it with command line utitilites like `curl` or OCM.

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import {
  PageSection,
  Button,
  Card,
  CardBody,
  CardTitle,
  ClipboardCopy,
  List,
  ListItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import links, { tools, channels } from '../../common/installLinks.mjs';
import Breadcrumbs from '../common/Breadcrumbs';
import ExternalLink from '../common/ExternalLink';
import DevPreviewBadge from '../common/DevPreviewBadge';
import DownloadAndOSSelection from '../clusters/install/instructions/components/DownloadAndOSSelection';
import './Tokens.scss';
import InstructionCommand from '../common/InstructionCommand';
import { doOffline, loadOfflineToken } from './TokenUtils';

/**
 * Generates a box for containing the value of a token.
 */
const tokenBox = ({
  token,
  command = '',
  textAriaLabel = 'Copyable token',
  className = 'ocm-c-api-token-limit-width',
  limitWidth = true,
  ...props
}) =>
  token === null ? (
    <>
      <div className="pf-u-mb-xs">
        <Spinner size="sm" className="progressing-icon" />
        <span>Loading token, this might take a minute</span>
      </div>
      <Skeleton size="md" />
    </>
  ) : (
    <InstructionCommand
      className={className}
      textAriaLabel={textAriaLabel}
      limitWidth={limitWidth}
      {...props}
    >
      {command || token}
    </InstructionCommand>
  );

/**
 * Generates a text box for login snippet of code for the given token.
 */
const snippetBox = (token, commandName) =>
  token === null ? (
    <Skeleton size="md" />
  ) : (
    <Text component="pre">
      <ClipboardCopy
        isReadOnly
        className="ocm-c-api-token-limit-width"
        variant="expansion"
        textAriaLabel="Copyable command"
      >
        {`${commandName} login --token="${token}"`}
      </ClipboardCopy>
    </Text>
  );

const manageTokensCard = (show) => (
  <Card className="ocm-c-api-token__card">
    <CardTitle>
      <Title headingLevel="h2">Revoke previous tokens</Title>
    </CardTitle>
    <CardBody className="ocm-c-api-token__card--body">
      <TextContent>
        <Text>To manage and revoke previous tokens:</Text>

        <List component="ol">
          <ListItem>
            Navigate to the{' '}
            <ExternalLink href="https://sso.redhat.com/auth/realms/redhat-external/account/applications">
              <b>offline API token management</b>
            </ExternalLink>{' '}
            page.
          </ListItem>
          <ListItem>
            Locate the <b>cloud-services</b> application.
          </ListItem>
          <ListItem>
            Select <b>Revoke grant</b>.
          </ListItem>
        </List>

        <Text>
          Refresh tokens will stop working immediately after you revoke them, but existing access
          tokens may take up to 15 minutes to expire.
        </Text>

        {show ? (
          <Text>
            To display a copyable version of your token, select the <b>Load token</b> button.
          </Text>
        ) : (
          <Text>Refreshing this page will generate a new token.</Text>
        )}
      </TextContent>
    </CardBody>
  </Card>
);

const leadingInfo = () => (
  <>
    <Text component="p">
      Red Hat OpenShift Cluster Manager is a managed service that makes it easy for you to use
      OpenShift without needing to install or upgrade your own OpenShift (Kubernetes) cluster.
    </Text>
    <Title headingLevel="h3">Your API token</Title>
    <Text component="p">
      Use this API token to authenticate against your Red Hat OpenShift Cluster Manager account.
    </Text>
  </>
);

const docsLink = () => (
  <ExternalLink href={links.OCM_CLI_DOCS} noIcon>
    read more about setting up the ocm CLI
  </ExternalLink>
);

class Tokens extends React.Component {
  // Should title or breadcrumbs differ for TokensROSA?
  // Maybe but but both pages show same API token, only instructions differ,
  // so should NOT say things like "rosa token" vs "ocm-cli token".
  pageTitle = 'OpenShift Cluster Manager API Token';

  windowTitle = 'API Token | OpenShift Cluster Manager';

  // After requesting token, we might need to reload page doing stronger auth;
  // after that we want the token to show, but we just loaded.
  componentDidMount() {
    document.title = this.windowTitle;
    const { blockedByTerms, show, offlineToken } = this.props;
    if (!blockedByTerms && show && (!offlineToken || offlineToken instanceof Error)) {
      // eslint-disable-next-line no-console
      console.log('Tokens: componentDidMount, props =', this.props);
      loadOfflineToken(this.onError);
    }
  }

  onError = (reason) => {
    const { setOfflineToken } = this.props;
    if (reason === 'not available') {
      // eslint-disable-next-line no-console
      console.log('Tokens: getOfflineToken failed => "not available", running doOffline()');
      doOffline((token) => {
        setOfflineToken(token);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('Tokens: getOfflineToken failed =>', reason);
      setOfflineToken(reason);
    }
  };

  tokenDetails() {
    const { offlineToken, commandName, commandTool, docsLink } = this.props;
    return (
      <>
        {tokenBox({ token: offlineToken, limitWidth: false })}

        <Title headingLevel="h3">Using your token in the command line</Title>
        <List component="ol">
          <ListItem>
            Download and install the <code>{commandName}</code> command-line tool:{' '}
            {commandTool === tools.OCM && <DevPreviewBadge />}
            <Text component="p" />
            <DownloadAndOSSelection tool={commandTool} channel={channels.STABLE} />
            <Text component="p" />
          </ListItem>
          <ListItem>
            Copy and paste the authentication command in your terminal:
            <Text component="p" />
            {snippetBox(offlineToken, commandName)}
          </ListItem>
        </List>

        <Title headingLevel="h3">Need help connecting with your offline token?</Title>
        <Text component="p">
          Run <code>{commandName} login --help</code> for in-terminal guidance, or {docsLink()} for
          more information about setting up the <code>{commandName}</code> CLI.
        </Text>
      </>
    );
  }

  buttonOrTokenDetails() {
    const { show, showPath, offlineToken } = this.props;
    return show || (offlineToken && !(offlineToken instanceof Error)) ? (
      this.tokenDetails()
    ) : (
      <Link to={showPath}>
        <Button variant="primary" data-test-id="load-token-btn" onClick={() => loadOfflineToken(this.onError)}>
          Load token
        </Button>
      </Link>
    );
  }

  render() {
    const { leadingInfo } = this.props;
    const header = (
      <PageHeader>
        <Breadcrumbs
          path={[{ label: 'Downloads', path: '/downloads' }, { label: this.pageTitle }]}
        />
        <PageHeaderTitle title={this.pageTitle} />
      </PageHeader>
    );

    return (
      <>
        {header}
        <PageSection>
          <Stack hasGutter>
            <StackItem>
              <Card className="ocm-c-api-token__card">
                <CardTitle>
                  <Title headingLevel="h2">Connect with offline tokens</Title>
                </CardTitle>
                <CardBody className="ocm-c-api-token__card--body">
                  <TextContent>
                    {leadingInfo()}
                    {this.buttonOrTokenDetails()}
                  </TextContent>
                </CardBody>
              </Card>
            </StackItem>

            <StackItem>{manageTokensCard()}</StackItem>
          </Stack>
        </PageSection>
      </>
    );
  }
}
Tokens.defaultProps = {
  blockedByTerms: false,
  commandName: 'ocm',
  commandTool: tools.OCM,
  leadingInfo,
  docsLink,
};
Tokens.propTypes = {
  blockedByTerms: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  showPath: PropTypes.string,
  commandName: PropTypes.string,
  commandTool: PropTypes.string,
  leadingInfo: PropTypes.func,
  docsLink: PropTypes.func,
  offlineToken: PropTypes.string,
  setOfflineToken: PropTypes.func,
};

export { snippetBox, tokenBox, manageTokensCard };

export default Tokens;
