import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  ExpandableSection,
  Grid,
  GridItem,
  TextContent,
  Text,
  TextVariants,
  TextList,
  TextListItem,
  TextListVariants,
  Title,
} from '@patternfly/react-core';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import { isSupportedMinorVersion, formatMinorVersion } from '~/common/helpers';
import { useOCPLatestVersion } from '~/components/releases/hooks';
import links from '../../../../../common/installLinks.mjs';

import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { ReduxFormDropdown } from '../../../../common/ReduxFormComponents';
import ExternalLink from '../../../../common/ExternalLink';
import ErrorBox from '../../../../common/ErrorBox';
import ErrorNoOCMRole from './ErrorNoOCMRole';
import InstructionCommand from '../../../../common/InstructionCommand';

// todo - WAT!?
import './AccountsRolesScreen.scss';

function AccountRolesARNsSection({
  change,
  touchARNsFields,
  selectedAWSAccountID,
  selectedInstallerRoleARN,
  rosaMaxOSVersion,
  getAWSAccountRolesARNs,
  getAWSAccountRolesARNsResponse,
  clearGetAWSAccountRolesARNsResponse,
  openOcmRoleInstructionsModal,
}) {
  const NO_ROLE_DETECTED = 'No role detected';

  const track = useAnalytics();
  const [isExpanded, setIsExpanded] = useState(true);
  const [accountRoles, setAccountRoles] = useState([]);
  const [installerRoleOptions, setInstallerRoleOptions] = useState([
    {
      name: NO_ROLE_DETECTED,
      value: NO_ROLE_DETECTED,
    },
  ]);
  const [selectedInstallerRole, setSelectedInstallerRole] = useState(NO_ROLE_DETECTED);
  const [allARNsFound, setAllARNsFound] = useState(false);
  const [hasARNsError, setHasARNsError] = useState(false);

  const hasNoTrustedRelationshipOnClusterRoleError = ({ errorDetails }) =>
    errorDetails?.length &&
    errorDetails.some((error) => error?.Error_Key === 'NoTrustedRelationshipOnClusterRole');

  useEffect(() => {
    // this is required to show any validation error messages for the 4 disabled ARNs fields
    touchARNsFields();
  }, [touchARNsFields]);

  useEffect(() => {
    clearGetAWSAccountRolesARNsResponse();
  }, [selectedAWSAccountID]);

  useEffect(() => {
    accountRoles.forEach((role) => {
      if (role.Installer === selectedInstallerRole) {
        setAllARNsFound(role.Installer && role.Support && role.ControlPlane && role.Worker);
        change('installer_role_arn', role.Installer || NO_ROLE_DETECTED);
        change('support_role_arn', role.Support || NO_ROLE_DETECTED);
        change('control_plane_role_arn', role.ControlPlane || NO_ROLE_DETECTED);
        change('worker_role_arn', role.Worker || NO_ROLE_DETECTED);
        change('rosa_max_os_version', role.version);
      }
    });
  }, [selectedInstallerRole]);

  const setSelectedInstallerRoleAndOptions = (accountRolesARNs) => {
    const installerOptions = [];
    if (accountRolesARNs.length === 0) {
      change('installer_role_arn', NO_ROLE_DETECTED);
      change('support_role_arn', NO_ROLE_DETECTED);
      change('control_plane_role_arn', NO_ROLE_DETECTED);
      change('worker_role_arn', NO_ROLE_DETECTED);
      installerOptions.push({
        name: NO_ROLE_DETECTED,
        value: NO_ROLE_DETECTED,
      });
      change('rosa_max_os_version', undefined);
      setAllARNsFound(false);
    } else {
      accountRolesARNs.forEach((role) => {
        installerOptions.push({
          name: role.Installer,
          value: role.Installer,
        });
      });
    }
    setInstallerRoleOptions(installerOptions);
    // default to currently selected, first installer role, or 'No Role Detected'
    setSelectedInstallerRole(
      selectedInstallerRoleARN || accountRolesARNs[0]?.Installer || NO_ROLE_DETECTED,
    );
  };

  const resolveARNsErrorTitle = (response) =>
    hasNoTrustedRelationshipOnClusterRoleError(response)
      ? 'Cannot detect an OCM role'
      : 'Error getting AWS account ARNs';

  const trackArnsRefreshed = (response) => {
    track(trackEvents.ARNsRefreshed, {
      customProperties: {
        error: !!response.error,
        ...(response.error && {
          error_title: resolveARNsErrorTitle(response),
          error_message: response.errorMessage || undefined, // omit empty strings
          error_code: response.errorCode,
          error_operation_id: response.operationID,
        }),
      },
    });
  };

  useEffect(() => {
    if (
      !getAWSAccountRolesARNsResponse.pending &&
      !getAWSAccountRolesARNsResponse.fulfilled &&
      !getAWSAccountRolesARNsResponse.error
    ) {
      getAWSAccountRolesARNs(selectedAWSAccountID);
    } else if (getAWSAccountRolesARNsResponse.pending) {
      setHasARNsError(false);
    } else if (getAWSAccountRolesARNsResponse.fulfilled) {
      const accountRolesARNs = get(getAWSAccountRolesARNsResponse, 'data', []);
      setSelectedInstallerRoleAndOptions(accountRolesARNs);
      setAccountRoles(accountRolesARNs);
    } else if (getAWSAccountRolesARNsResponse.error) {
      change('installer_role_arn', '');
      setSelectedInstallerRoleAndOptions([]);
      setAccountRoles([]);
      setHasARNsError(true);
    }
  }, [selectedAWSAccountID, getAWSAccountRolesARNsResponse]);

  useEffect(() => {
    if (getAWSAccountRolesARNsResponse.fulfilled || getAWSAccountRolesARNsResponse.error) {
      trackArnsRefreshed(getAWSAccountRolesARNsResponse);
    }
  }, [getAWSAccountRolesARNsResponse]);

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handInstallerRoleChange = (_, value) => {
    // changing to a new set of ARNs, which could have different
    // rosa_max_os_version, so clear the cluster_version which
    // will get a new default on next step of the wizard
    change('cluster_version', undefined);
    setSelectedInstallerRole(value);
  };

  const roleARNRequired = (value) =>
    value && value !== NO_ROLE_DETECTED ? undefined : 'ARN field is required.';

  const refreshARNs = () => {
    clearGetAWSAccountRolesARNsResponse();
    change('installer_role_arn', '');
    change('cluster_version', undefined);
    setSelectedInstallerRole('');
    getAWSAccountRolesARNs(selectedAWSAccountID);
  };

  const [latestOCPVersion, latestVersionLoaded] = useOCPLatestVersion('stable');
  const rolesOutOfDate =
    latestVersionLoaded && !isSupportedMinorVersion(latestOCPVersion, rosaMaxOSVersion);

  return (
    <>
      <GridItem />
      <GridItem>
        <Title headingLevel="h3">Account roles</Title>
      </GridItem>
      {hasARNsError && (
        <GridItem>
          <ErrorBox
            message={resolveARNsErrorTitle(getAWSAccountRolesARNsResponse)}
            response={getAWSAccountRolesARNsResponse}
          >
            {hasNoTrustedRelationshipOnClusterRoleError(getAWSAccountRolesARNsResponse) && (
              <ErrorNoOCMRole openOcmRoleInstructionsModal={openOcmRoleInstructionsModal} />
            )}
          </ErrorBox>
        </GridItem>
      )}
      {!getAWSAccountRolesARNsResponse.pending && !allARNsFound && !hasARNsError && (
        <GridItem>
          <Alert isInline variant="warning" title="Some account roles ARNs were not detected.">
            <br />
            Create the account roles using the following command in the ROSA CLI
            <InstructionCommand textAriaLabel="Copyable ROSA login command">
              rosa create account-roles
            </InstructionCommand>
            <br />
            After running the command, you may need to refresh using the{' '}
            <strong>Refresh ARNs</strong> button below to populate the ARN fields.
          </Alert>
        </GridItem>
      )}
      {getAWSAccountRolesARNsResponse.pending && (
        <GridItem>
          <div className="spinner-fit-container">
            <Spinner />
          </div>
          <div className="spinner-loading-text">Loading account roles ARNs...</div>
        </GridItem>
      )}
      {!getAWSAccountRolesARNsResponse.pending && (
        <GridItem span={12}>
          <ExpandableSection
            isExpanded={isExpanded}
            onToggle={onToggle}
            toggleText="Account roles ARNs"
          >
            <Text component={TextVariants.p}>
              The following roles were detected in your AWS account.{' '}
              <ExternalLink href={links.ROSA_AWS_IAM_RESOURCES}>
                Learn more about account roles
              </ExternalLink>
              .
            </Text>
            <br />
            <Button
              variant="secondary"
              data-test-id="refresh_arns_btn"
              onClick={() => {
                track(trackEvents.RefreshARNs);
                refreshARNs();
              }}
            >
              Refresh ARNs
            </Button>
            <br />
            <br />
            <Grid>
              <GridItem span={8}>
                <Field
                  component={ReduxFormDropdown}
                  name="installer_role_arn"
                  label="Installer role"
                  type="text"
                  options={installerRoleOptions}
                  onChange={handInstallerRoleChange}
                  isDisabled={installerRoleOptions.length <= 1}
                  validate={roleARNRequired}
                  isRequired
                  helpText=""
                  extendedHelpText={
                    <>
                      An IAM role used by the ROSA installer.
                      <br />
                      For more information see{' '}
                      <ExternalLink href={links.ROSA_AWS_IAM_ROLES}>
                        Table 1 about the installer role policy
                      </ExternalLink>
                      .
                    </>
                  }
                />
                <br />
                <Field
                  component={ReduxVerticalFormGroup}
                  name="support_role_arn"
                  label="Support role"
                  type="text"
                  validate={roleARNRequired}
                  isRequired
                  // An IAM role used by the Red Hat Site Reliability Engineering (SRE) support team.
                  extendedHelpText={
                    <>
                      An IAM role used by the Red Hat Site Reliability Engineering (SRE) support
                      team.
                      <br />
                      For more information see{' '}
                      <ExternalLink href={links.ROSA_AWS_IAM_ROLES}>
                        Table 4 about the support role policy
                      </ExternalLink>
                      .
                    </>
                  }
                  isDisabled
                />
                <br />
                <Field
                  component={ReduxVerticalFormGroup}
                  name="worker_role_arn"
                  label="Worker role"
                  type="text"
                  validate={roleARNRequired}
                  isRequired
                  extendedHelpText={
                    <>
                      An IAM role used by the ROSA compute instances.
                      <br />
                      For more information see{' '}
                      <ExternalLink href={links.ROSA_AWS_IAM_ROLES}>
                        Table 3 about the worker/compute role policy
                      </ExternalLink>
                      .
                    </>
                  }
                  isDisabled
                />
                <br />
                <Field
                  component={ReduxVerticalFormGroup}
                  name="control_plane_role_arn"
                  label="Control plane role"
                  type="text"
                  validate={roleARNRequired}
                  isRequired
                  extendedHelpText={
                    <>
                      An IAM role used by the ROSA control plane.
                      <br />
                      For more information see{' '}
                      <ExternalLink href={links.ROSA_AWS_IAM_ROLES}>
                        Table 2 about the control plane role policy
                      </ExternalLink>
                      .
                    </>
                  }
                  isDisabled
                />
              </GridItem>
              {rosaMaxOSVersion && (
                <GridItem>
                  <br />
                  <Alert
                    variant="info"
                    isInline
                    isPlain={!rolesOutOfDate}
                    title={`The selected account-wide roles are compatible with OpenShift version ${formatMinorVersion(
                      rosaMaxOSVersion,
                    )} and earlier.`}
                  >
                    {rolesOutOfDate && (
                      <TextContent>
                        <Text component={TextVariants.p} className={spacing.mtSm}>
                          <strong>
                            To update account roles to the latest OpenShift version (
                            {formatMinorVersion(latestOCPVersion)}):
                          </strong>
                        </Text>
                        <TextList component={TextListVariants.ol}>
                          <TextListItem>
                            <Text component={TextVariants.p}>
                              Download latest ({formatMinorVersion(latestOCPVersion)}){' '}
                              <Link to="/downloads#tool-ocm">ocm</Link> and{' '}
                              <Link to="/downloads#tool-rosa">rosa</Link> CLIs
                            </Text>
                          </TextListItem>
                          <TextListItem className="pf-u-mb-sm">
                            <Text component={TextVariants.p}>Recreate ARNs using</Text>
                            <Text component={TextVariants.p}>
                              <InstructionCommand textAriaLabel="Copyable ROSA create account-roles command">
                                rosa create account-roles
                              </InstructionCommand>
                            </Text>
                          </TextListItem>
                        </TextList>
                        {/*
                        // TODO restore this when we have a doc URL (see https://issues.redhat.com/browse/OSDOCS-4138)
                        <Text component={TextVariants.p}>
                          <ExternalLink href="#">
                            Learn more about account-role version compatibility
                          </ExternalLink>
                        </Text>
                        */}
                      </TextContent>
                    )}
                  </Alert>
                </GridItem>
              )}
            </Grid>
            <GridItem span={4} />
          </ExpandableSection>
        </GridItem>
      )}
    </>
  );
}

AccountRolesARNsSection.propTypes = {
  change: PropTypes.func,
  touchARNsFields: PropTypes.func,
  selectedAWSAccountID: PropTypes.string,
  selectedInstallerRoleARN: PropTypes.string,
  rosaMaxOSVersion: PropTypes.string,
  getAWSAccountRolesARNs: PropTypes.func.isRequired,
  getAWSAccountRolesARNsResponse: PropTypes.object.isRequired,
  clearGetAWSAccountRolesARNsResponse: PropTypes.func.isRequired,
  openOcmRoleInstructionsModal: PropTypes.func.isRequired,
};

export default AccountRolesARNsSection;
