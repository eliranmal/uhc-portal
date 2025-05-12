import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { OutlinedArrowAltCircleUpIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-arrow-alt-circle-up-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import { modalActions } from '../../../common/Modal/ModalActions';

import UpdateGraph from './UpdateGraph/UpdateGraph';

import './UpgradeStatus.scss';

function UpgradeStatus({
  clusterID,
  canEdit,
  clusterVersion,
  scheduledUpgrade,
  availableUpgrades = [],
  onCancelClick,
  upgradeGates,
  schedules,
  cluster,
  isHypershift,
  isSTSEnabled,
}) {
  const dispatch = useDispatch();
  const region = cluster?.subscription?.rh_region_id;
  const hasAvailableUpgrades = availableUpgrades.length > 0;

  const isManualUpgradeScheduled = scheduledUpgrade?.schedule_type === 'manual';

  const updateVersion = () => {
    if (scheduledUpgrade?.version) {
      return scheduledUpgrade.version;
    }

    if (!availableUpgrades || availableUpgrades.length === 0) {
      return undefined; // is up to date
    }

    return availableUpgrades[availableUpgrades.length - 1];
  };

  const upgradeState = scheduledUpgrade && scheduledUpgrade.state?.value;
  const canCancel =
    isManualUpgradeScheduled && canEdit && upgradeState !== 'started' && upgradeState !== 'delayed';

  const upgradeStateIcon = () => {
    let icon;
    let text;
    if (upgradeState === 'started' || upgradeState === 'delayed') {
      icon = <InProgressIcon class="ocm-upgrade-in-progress-icon" />;
      if (upgradeState === 'delayed') {
        text = 'Update in progress (delayed)';
      } else {
        text = 'Update in progress';
      }
    } else if (hasAvailableUpgrades) {
      icon = <OutlinedArrowAltCircleUpIcon className="ocm-upgrade-available-icon" />;
      text = 'Update available';
    } else {
      icon = <CheckCircleIcon className="ocm-cluster-up-to-date-icon" />;
      text = 'Up to date';
    }
    return (
      <>
        {icon} {text}
      </>
    );
  };

  if (!clusterVersion) {
    return (
      <EmptyState variant={EmptyStateVariant.xs}>
        <EmptyStateHeader titleText="Update status is not available" headingLevel="h4" />
        <EmptyStateBody>Update status is not available. Try again later.</EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <>
      <div>
        {upgradeStateIcon()}
        <UpdateGraph
          currentVersion={clusterVersion}
          updateVersion={updateVersion()}
          hasMore={!isManualUpgradeScheduled && availableUpgrades.length > 1}
          upgradeGates={upgradeGates}
          schedules={schedules}
          cluster={cluster}
          isHypershift={isHypershift}
          isSTSEnabled={isSTSEnabled}
        />

        {scheduledUpgrade && upgradeState !== 'started' && upgradeState !== 'pending' && (
          <>
            <div className="ocm-upgrade-status-scheduled-title">Upgrade scheduled</div>
            <DateFormat type="exact" date={Date.parse(scheduledUpgrade.next_run)} />
          </>
        )}
      </div>
      {canCancel && (
        <Button
          id="ocm-upgrade-status-cancel"
          variant="link"
          onClick={() => {
            if (onCancelClick) {
              onCancelClick();
            }
            dispatch(
              modalActions.openModal('cancel-upgrade', {
                clusterID,
                schedule: scheduledUpgrade,
                region,
              }),
            );
          }}
        >
          Cancel this update
        </Button>
      )}
    </>
  );
}

UpgradeStatus.propTypes = {
  clusterID: PropTypes.string.isRequired,
  upgradeGates: PropTypes.object,
  schedules: PropTypes.object,
  cluster: PropTypes.object,
  canEdit: PropTypes.bool,
  isHypershift: PropTypes.bool,
  isSTSEnabled: PropTypes.bool,
  clusterVersion: PropTypes.string,
  scheduledUpgrade: PropTypes.shape({
    version: PropTypes.string,
    next_run: PropTypes.string,
    state: PropTypes.shape({
      value: PropTypes.string,
    }),
    schedule_type: PropTypes.string,
  }),
  onCancelClick: PropTypes.func,
  availableUpgrades: PropTypes.arrayOf(PropTypes.string),
};

export default UpgradeStatus;
