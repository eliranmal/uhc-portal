import React from 'react';
import PropTypes from 'prop-types';

import { ProgressStep, ProgressStepper, Spinner } from '@patternfly/react-core';
import UnknownIcon from '@patternfly/react-icons/dist/esm/icons/unknown-icon';

import { InflightCheckState } from '~/types/clusters_mgmt.v1/enums';

import clusterStates, {
  getInflightChecks,
  hasInflightEgressErrors,
  isOSD,
  isOSDGCPPendingOnHostProject,
  isOSDGCPWaitingForRolesOnHostProject,
  isROSA,
  isWaitingForOIDCProviderOrOperatorRolesMode,
  isWaitingROSAManualMode,
} from '../clusterStates';

import ActionRequiredLink from './ActionRequiredLink';

import './ProgressList.scss';

function ProgressList({ cluster, actionRequiredInitialOpen, regionalInstance }) {
  const isROSACluster = isROSA(cluster);
  const isOSDCluster = isOSD(cluster);
  const isOSDGCPPending = isOSDGCPPendingOnHostProject(cluster);
  const isOSDGCPWaiting = isOSDGCPWaitingForRolesOnHostProject(cluster);
  const isWaitingAndROSAManual = isWaitingROSAManualMode(cluster);
  const isWaitingForOIDCProviderOrOperatorRoles =
    isWaitingForOIDCProviderOrOperatorRolesMode(cluster);

  // helper variables for isPending
  const isPendingState = cluster.state === clusterStates.pending;
  const isWaitingState = cluster.state === clusterStates.waiting;
  const isValidating = cluster.state === clusterStates.validating;
  const isAutoMode = cluster?.aws?.sts?.auto_mode;
  const hasOIDCConfig = cluster?.aws?.sts?.oidc_config?.id;
  const doesNotHaveStatusMessage =
    !cluster?.status.description ||
    cluster?.status.description === 'Waiting for OIDC configuration';

  const isWaiting = isWaitingState && (isAutoMode || (hasOIDCConfig && doesNotHaveStatusMessage));

  const getProgressData = () => {
    const pending = { variant: 'pending' };
    const inProcess = { variant: 'info', icon: <Spinner size="sm" />, isCurrent: true };
    const completed = { variant: 'success', text: 'Completed' };
    const warning = { variant: 'warning', text: 'Validation failed' };
    const failed = { variant: 'danger', text: 'Failed' };
    const unknown = { icon: <UnknownIcon className="icon-space-right" />, text: 'Unknown' };

    // Only OSD--User action to add roles to a dynamically generated service account in order for this cluster to use a shared VPC
    // ROSA this is already created
    if (
      isOSDCluster &&
      (cluster.state === clusterStates.waiting || isOSDGCPPending || isOSDGCPWaiting)
    ) {
      const accountSetup = isOSDGCPWaiting
        ? {
            text: 'Waiting for permissions',
            variant: 'warning',
          }
        : {
            text: 'Preparing account',
            ...inProcess,
          };
      return {
        awsAccountSetup: accountSetup,
        DNSSetup: pending,
        networkSettings: pending,
        clusterInstallation: pending,
      };
    }

    // Only ROSA -- Prompt user to run CLI to create OIDC and User roles
    const inflightChecks = getInflightChecks(cluster);
    const hasInflightErrors = hasInflightEgressErrors(cluster);
    if (isROSACluster) {
      if (isWaitingForOIDCProviderOrOperatorRoles) {
        // Show link to Action required modal for creation of ROSA operator roles and
        // OIDC provider via oidc_config.id.
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            variant: 'warning',
            text: <ActionRequiredLink cluster={cluster} regionalInstance={regionalInstance} />,
            isCurrent: true,
          },
          networkSettings: pending,
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
      if (isWaitingAndROSAManual) {
        // Show link to Action required modal for manual creation of ROSA operator roles and
        // OIDC provider.
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            variant: 'warning',
            text: (
              <ActionRequiredLink
                cluster={cluster}
                initiallyOpen={actionRequiredInitialOpen}
                regionalInstance={regionalInstance}
              />
            ),
            isCurrent: true,
          },
          networkSettings: pending,
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
      // OIDC and operator roles are created at the waiting state
      if (isWaiting) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: {
            text: 'Waiting',
            ...inProcess,
          },
          networkSettings: pending,
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
    }

    // Both--validating and pending
    if (isROSACluster || isOSDCluster) {
      if (
        isPendingState ||
        isValidating ||
        inflightChecks.some((check) => check.state === InflightCheckState.running)
      ) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: completed,
          networkSettings: {
            text: 'Validating',
            ...inProcess,
          },
          DNSSetup: pending,
          clusterInstallation: pending,
        };
      }
    }

    // first steps completed
    const networkSettings = hasInflightErrors ? warning : completed;
    if (cluster.state === clusterStates.installing) {
      if (!cluster.status.dns_ready) {
        return {
          awsAccountSetup: completed,
          oidcAndOperatorRolesSetup: completed,
          networkSettings,
          DNSSetup: inProcess,
          clusterInstallation: pending,
        };
      }
      // second step completed
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        networkSettings,
        DNSSetup: completed,
        clusterInstallation: {
          text: 'Installing cluster',
          ...inProcess,
        },
      };
    }
    if (cluster.state === clusterStates.error || cluster.state === clusterStates.ready) {
      return {
        awsAccountSetup: completed,
        oidcAndOperatorRolesSetup: completed,
        DNSSetup: completed,
        networkSettings,
        clusterInstallation: cluster.state === clusterStates.error ? failed : completed,
      };
    }
    return {
      awsAccountSetup: unknown,
      oidcAndOperatorRolesSetup: unknown,
      DNSSetup: unknown,
      networkSettings: unknown,
      clusterInstallation: unknown,
    };
  };

  const progressData = getProgressData();

  return (
    <ProgressStepper>
      <ProgressStep
        variant={progressData.awsAccountSetup.variant}
        icon={progressData.awsAccountSetup.icon}
        isCurrent={progressData.awsAccountSetup.isCurrent}
        description={progressData.awsAccountSetup.text}
        id="awsAccountSetup"
        data-testid="account-setup-title"
        titleId="awsAccountSetup-title"
      >
        Account setup
      </ProgressStep>
      {isROSACluster && (
        <ProgressStep
          variant={progressData.oidcAndOperatorRolesSetup.variant}
          icon={progressData.oidcAndOperatorRolesSetup.icon}
          isCurrent={progressData.oidcAndOperatorRolesSetup.isCurrent}
          description={progressData.oidcAndOperatorRolesSetup.text}
          id="oidcAndOperatorRolesSetup"
          titleId="oidcAndOperatorRoles-title"
        >
          OIDC and operator roles
        </ProgressStep>
      )}
      {(isROSACluster || isOSDCluster) && (
        <ProgressStep
          variant={progressData.networkSettings.variant}
          icon={progressData.networkSettings.icon}
          isCurrent={progressData.networkSettings.isCurrent}
          description={progressData.networkSettings.text}
          id="networkSettings"
          titleId="networkSettings-title"
        >
          Network settings
        </ProgressStep>
      )}
      <ProgressStep
        variant={progressData.DNSSetup.variant}
        icon={progressData.DNSSetup.icon}
        isCurrent={progressData.DNSSetup.isCurrent}
        description={progressData.DNSSetup.text}
        id="DNSSetup"
        titleId="DNSSetup-title"
      >
        DNS setup
      </ProgressStep>
      <ProgressStep
        variant={progressData.clusterInstallation.variant}
        icon={progressData.clusterInstallation.icon}
        isCurrent={progressData.clusterInstallation.isCurrent}
        description={progressData.clusterInstallation.text}
        id="clusterInstallation"
        titleId="clusterInstallation-title"
      >
        Cluster installation
      </ProgressStep>
    </ProgressStepper>
  );
}

ProgressList.propTypes = {
  cluster: PropTypes.object.isRequired,
  actionRequiredInitialOpen: PropTypes.bool,
  regionalInstance: PropTypes.shape({
    environment: PropTypes.string,
    id: PropTypes.string,
    isDefault: PropTypes.bool,
    url: PropTypes.string,
  }),
};

export default ProgressList;
