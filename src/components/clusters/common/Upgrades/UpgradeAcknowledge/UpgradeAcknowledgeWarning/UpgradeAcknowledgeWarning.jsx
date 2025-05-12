import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Alert, AlertActionLink, Button, Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

import { modalActions } from '~/components/common/Modal/ModalActions';

import {
  getClusterAcks,
  getHasScheduledManual,
  getToVersionFromHelper,
  isManualUpdateSchedulingRequired,
} from '../UpgradeAcknowledgeHelpers';
import UpgradeAcknowledgeModal from '../UpgradeAcknowledgeModal';

import './UpgradeAcknowledgeWarning.scss';

const UpgradeAcknowledgeWarning = (props) => {
  const dispatch = useDispatch();
  const {
    isPlain,
    isInfo,
    showConfirm,
    isSTSEnabled,
    isHypershift,
    schedules,
    upgradeGates,
    cluster,
    showUpgradeWarning,
  } = props;

  const clusterId = cluster?.id;
  const openshiftVersion = isHypershift ? cluster?.openshift_version : cluster?.version.raw_id;
  const region = cluster?.subscription?.rh_region_id;
  const fromVersion = cluster?.version?.raw_id || null;
  const toVersion = getToVersionFromHelper(schedules, cluster);
  const isManual = !schedules?.items.some((policy) => policy.schedule_type === 'automatic');
  const getAcks = getClusterAcks(schedules, cluster, upgradeGates);
  const hasScheduledManual = getHasScheduledManual(schedules, cluster);
  const showManualUpgradeWarning = isManualUpdateSchedulingRequired(schedules, cluster);

  const handleButtonClick = () => {
    const [clusterUnmetAcks] = getAcks;
    dispatch(
      modalActions.openModal('ack-upgrade', {
        toVersion,
        fromVersion,
        unmetAcknowledgements: clusterUnmetAcks,
        clusterId,
        isHypershift,
        isSTSEnabled,
      }),
    );
  };

  const infoTitle = `Administrator acknowledgement is required before updating from ${fromVersion} to ${toVersion}`;

  if (!clusterId || !openshiftVersion) {
    return null;
  }

  const [clusterUnmetAcks, clusterMetAcks] = getAcks;

  const showConfirmMessage =
    showConfirm && clusterUnmetAcks.length === 0 && clusterMetAcks.length > 0;

  return (
    <>
      {clusterUnmetAcks.length > 0 && isManual && isInfo && !hasScheduledManual ? (
        <div
          className="ocm-upgrade-additional-versions-available"
          data-testid="infoMessageUnmetAcks"
        >
          <InfoCircleIcon /> {infoTitle}
        </div>
      ) : null}

      {clusterUnmetAcks.length > 0 && !isManual ? (
        <>
          <UpgradeAcknowledgeModal
            clusterId={clusterId}
            isHypershift={isHypershift}
            isSTSEnabled={isSTSEnabled}
            schedules={schedules}
            region={region}
          />
          <Alert
            id="upgrade-ack-alert"
            isInline
            isPlain={isPlain}
            variant="warning"
            title={infoTitle}
            data-testid="alertMessageUnmetAcks"
            className={isPlain ? '' : 'automatic-cluster-updates-alert'}
            actionLinks={
              !isPlain ? (
                <AlertActionLink onClick={() => handleButtonClick()}>
                  Provide approval
                </AlertActionLink>
              ) : null
            }
          />
          {isPlain ? (
            <Button
              variant="secondary"
              className="ocm-upgrade-approval__provide-button"
              onClick={() => handleButtonClick()}
            >
              Provide approval
            </Button>
          ) : null}
        </>
      ) : null}
      {showUpgradeWarning && showManualUpgradeWarning ? (
        <div className="ocm-upgrade-additional-versions-available" data-testid="confirmAckReceived">
          <Icon status="warning">
            <ExclamationTriangleIcon />
          </Icon>{' '}
          Your update strategy is currently set to recurring updates. Update {toVersion} is a Y
          steam update and must be individually updated.
        </div>
      ) : null}
      {showConfirmMessage ? (
        <div className="ocm-upgrade-additional-versions-available" data-testid="confirmAckReceived">
          <InfoCircleIcon />
          Administrator acknowledgement was received.
        </div>
      ) : null}
    </>
  );
};

UpgradeAcknowledgeWarning.propTypes = {
  isPlain: PropTypes.bool, // Show alert with approval button without background
  showConfirm: PropTypes.bool, // If saved acks AND no needed acks, then show info confirm message
  isInfo: PropTypes.bool, // If manual  AND  needed acks, show the alert as information text
  isSTSEnabled: PropTypes.bool,
  isHypershift: PropTypes.bool,
  schedules: PropTypes.object,
  upgradeGates: PropTypes.array,
  cluster: PropTypes.object,
  showUpgradeWarning: PropTypes.bool,
};

UpgradeAcknowledgeWarning.defaultProps = {
  isPlain: false,
  showConfirm: false,
  isInfo: false,
};

export default UpgradeAcknowledgeWarning;
