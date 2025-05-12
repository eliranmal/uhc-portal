import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Alert, AlertActionLink, Spinner } from '@patternfly/react-core';
import ArrowCircleUpIcon from '@patternfly/react-icons/dist/esm/icons/arrow-circle-up-icon';

import { useEditSchedule } from '~/queries/ClusterDetailsQueries/ClusterSettingsTab/useEditSchedule';

import links from '../../../../../common/installLinks.mjs';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';
import ExternalLink from '../../../../common/ExternalLink';
import { setAutomaticUpgradePolicy } from '../clusterUpgradeActions';
import { getHasUnMetClusterAcks } from '../UpgradeAcknowledge/UpgradeAcknowledgeHelpers';

import {
  getEnableMinorVersionUpgrades,
  isNextMinorVersionAvailableHelper,
} from './MinorVersionUpgradeAlertHelpers';

const actionLink = (onChange, isCurrentlyEnabled) => (
  <AlertActionLink onClick={() => onChange(!isCurrentlyEnabled)}>
    {isCurrentlyEnabled
      ? 'Disallow this minor version update'
      : 'Allow the next minor version update'}
  </AlertActionLink>
);

const MinorVersionUpgradeAlert = ({
  clusterId,
  isHypershift,
  schedules,
  cluster,
  upgradeGates,
}) => {
  const dispatch = useDispatch();
  const { mutateAsync: editScheduleMutate } = useEditSchedule(clusterId, isHypershift);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const isAutomatic = schedules?.items?.some((policy) => policy.schedule_type === 'automatic');
  const hasUnmetUpgradeAcknowledge = getHasUnMetClusterAcks(schedules, cluster, upgradeGates);
  const isMinorVersionUpgradesEnabled = getEnableMinorVersionUpgrades(schedules);
  const automaticUpgradePolicyId = schedules?.items?.find(
    (item) => item.schedule_type === 'automatic',
  )?.id;
  const isNextMinorVersionAvailable = isNextMinorVersionAvailableHelper(cluster);
  const isRosa = cluster?.subscription?.plan.type === normalizedProducts.ROSA;
  const isSTSEnabled = cluster?.aws?.sts?.enabled;

  if (
    !isAutomatic ||
    hasUnmetUpgradeAcknowledge ||
    !automaticUpgradePolicyId ||
    !clusterId ||
    !isNextMinorVersionAvailable ||
    isSTSEnabled
  ) {
    return null;
  }

  const onChangeAcknowledge = async (isEnable) => {
    setLoading(true);
    setError(null);

    try {
      const response = await editScheduleMutate(
        {
          policyID: automaticUpgradePolicyId,
          schedule: { enable_minor_version_upgrades: isEnable },
        },
        {
          onSuccess: () => {
            // Because this response can be quick, adding loading to prevent a double click
            setTimeout(() => {
              dispatch(setAutomaticUpgradePolicy(response.data));
              setLoading(false);
            }, 500);
          },
        },
      );
    } catch (err) {
      setError(err.response.data.reason || err.response.data);
    }
  };

  return error ? (
    <Alert
      variant="danger"
      className="automatic-cluster-updates-alert"
      isInline
      title={error}
      role="alert"
      data-testid="alert-error"
    />
  ) : (
    <Alert
      isExpandable
      isInline
      className="automatic-cluster-updates-alert"
      customIcon={<ArrowCircleUpIcon />}
      title={
        isMinorVersionUpgradesEnabled
          ? 'Next minor version update allowed'
          : 'New minor version available'
      }
      actionLinks={
        loading ? (
          <Spinner size="sm" aria-label="Setting minor version update status" />
        ) : (
          actionLink(onChangeAcknowledge, isMinorVersionUpgradesEnabled)
        )
      }
      data-testid="alert-success"
    >
      {isMinorVersionUpgradesEnabled ? (
        <p data-testid="minorVersionUpgradeAlertDisableMessage">
          Your cluster will be updated to the newest minor version at the time you selected. Minor
          releases can include new Kubernetes versions or operating system capabilities, improved
          automation on IaaS providers, and other expanded features.
        </p>
      ) : (
        <p data-testid="minorVersionUpgradeAlertEnableMessage">
          Allow your cluster to be updated to the newest minor version at the time you selected.{' '}
          <ExternalLink href={isRosa ? links.ROSA_UPGRADES : links.OSD_UPGRADES}>
            Learn more about updates
          </ExternalLink>
        </p>
      )}
    </Alert>
  );
};

MinorVersionUpgradeAlert.propTypes = {
  isHypershift: PropTypes.bool,
  clusterId: PropTypes.string,
  schedules: PropTypes.object,
  cluster: PropTypes.object,
  upgradeGates: PropTypes.array,
};

export default MinorVersionUpgradeAlert;
