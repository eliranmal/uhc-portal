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
import { useDispatch } from 'react-redux';
import { To } from 'react-router-dom';

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  List,
  ListItem,
  Skeleton,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { Link } from '~/common/routing';
import { CLI_SSO_AUTHORIZATION } from '~/queries/featureGates/featureConstants';
import { useFeatureGate } from '~/queries/featureGates/useFetchFeatureGate';
import { setOfflineToken } from '~/redux/actions/rosaActions';
import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { getRefreshToken, isRestrictedEnv } from '~/restrictedEnv';
import { Chrome } from '~/types/types';

import links, { channels, tools } from '../../common/installLinks.mjs';
import DownloadAndOSSelection from '../clusters/install/instructions/components/DownloadAndOSSelection';
import ExternalLink from '../common/ExternalLink';
import OfflineTokensAlert from '../common/OfflineTokensAlert';
import SupportLevelBadge, { DEV_PREVIEW } from '../common/SupportLevelBadge';

import LeadingInfo from './LeadingInfo';
import RevokeTokensInstructions from './RevokeTokensInstructions';
import SSOLoginInstructions from './SSOLogin';
import TokenBox from './TokenBox';
import { loadOfflineToken } from './TokenUtils';

import './Instructions.scss';

const defaultDocsLink = (
  <ExternalLink href={links.OCM_CLI_DOCS} noIcon>
    read more about setting up the ocm CLI
  </ExternalLink>
);

type Props = {
  blockedByTerms?: boolean;
  commandName?: string;
  commandTool?: string;
  docsLink?: React.ReactNode;
  show?: boolean;
  showPath?: To;
  SSOLogin: boolean;
  isRosa: boolean;
};

const Instructions = (props: Props) => {
  const {
    show,
    showPath = '',
    commandName = 'ocm',
    commandTool = tools.OCM,
    docsLink = defaultDocsLink,
    blockedByTerms,
    SSOLogin,
    isRosa,
  } = props;
  const offlineToken = useGlobalState((state) => state.rosaReducer.offlineToken);
  const dispatch = useDispatch();
  const chrome = useChrome() as Chrome;
  const showDeprecationMessage = useFeatureGate(CLI_SSO_AUTHORIZATION) && !SSOLogin;
  const restrictedEnv = isRestrictedEnv();
  const [token, setToken] = React.useState<string>('');

  React.useEffect(() => {
    if (!SSOLogin) {
      if (restrictedEnv) {
        getRefreshToken(chrome).then((refreshToken) => setToken(refreshToken));
      } else if (offlineToken) {
        setToken(offlineToken as string);
      }
    }
  }, [chrome, restrictedEnv, offlineToken, SSOLogin]);
  React.useEffect(() => {
    if (!SSOLogin) {
      // After requesting token, we might need to reload page doing stronger auth;
      // after that we want the token to show, but we just loaded.
      if (!blockedByTerms && show && !offlineToken) {
        // eslint-disable-next-line no-console
        console.log('Tokens: componentDidMount, props =', props);
        loadOfflineToken(
          (tokenOrError, errorReason) => {
            dispatch(setOfflineToken(errorReason || tokenOrError));
          },
          window.location.origin,
          chrome,
        );
      }
    }
    // No dependencies because this effect should only be run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (SSOLogin) {
    return (
      <SSOLoginInstructions isRosa={isRosa} commandName={commandName} commandTool={commandTool} />
    );
  }

  const ocmLoginCommand = `ocm login --token="${token}" ${restrictedEnv ? '--url https://api.***REMOVED***.com --token-url https://sso.***REMOVED***.com/realms/redhat-external/protocol/openid-connect/token --client-id console-dot' : ''}`;

  return (
    <Stack hasGutter>
      <StackItem>
        <Card className="ocm-c-api-token__card">
          {!restrictedEnv && showDeprecationMessage ? (
            <CardTitle>
              <OfflineTokensAlert />
            </CardTitle>
          ) : null}
          <CardTitle>
            <Title headingLevel="h2">
              {`Connect with ${restrictedEnv ? 'refresh' : 'offline'} tokens`}
            </Title>
          </CardTitle>
          <CardBody className="ocm-c-api-token__card--body">
            <TextContent>
              <LeadingInfo isRosa={isRosa} SSOLogin={false} />
            </TextContent>
            {show || token ? (
              <>
                <TokenBox token={token} />
                <TextContent className="pf-v5-u-mt-lg">
                  <Title headingLevel="h3">Using your token in the command line</Title>
                  <List component="ol">
                    <ListItem>
                      Download and install the <code>{commandName}</code> command-line tool:{' '}
                      {commandTool === tools.OCM && <SupportLevelBadge {...DEV_PREVIEW} />}
                      <Text component="p" />
                      <DownloadAndOSSelection tool={commandTool} channel={channels.STABLE} />
                      <Text component="p" />
                    </ListItem>
                    <ListItem>
                      Copy and paste the authentication command in your terminal:
                      <Text component="p" />
                      {offlineToken == null && !restrictedEnv ? (
                        <Skeleton fontSize="md" screenreaderText="Loading..." />
                      ) : (
                        <TokenBox
                          token={token}
                          command={ocmLoginCommand}
                          showCommandOnError
                          showInstructionsOnError={false}
                        />
                      )}
                    </ListItem>
                  </List>

                  <Title headingLevel="h3">
                    {`Need help connecting with your ${restrictedEnv ? 'refresh' : 'offline'} token?`}
                  </Title>
                  <Text component="p">
                    Run <code>{commandName} login --help</code> for in-terminal guidance, or{' '}
                    {docsLink} for more information about setting up the <code>{commandName}</code>{' '}
                    CLI.
                  </Text>
                </TextContent>
              </>
            ) : (
              <Link to={showPath}>
                <Button
                  variant="primary"
                  className="pf-v5-u-mt-md"
                  data-testid="load-token-btn"
                  onClick={() =>
                    loadOfflineToken(
                      (tokenOrError, errorReason) => {
                        dispatch(setOfflineToken(errorReason || tokenOrError));
                      },
                      window.location.origin,
                      chrome,
                    )
                  }
                >
                  Load token
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      </StackItem>
      {!restrictedEnv && (
        <StackItem>
          <Card className="ocm-c-api-token__card">
            <CardTitle>
              <Title headingLevel="h2">Revoke previous tokens</Title>
            </CardTitle>
            <CardBody className="ocm-c-api-token__card--body">
              <RevokeTokensInstructions />
            </CardBody>
          </Card>
        </StackItem>
      )}
    </Stack>
  );
};

export default Instructions;
