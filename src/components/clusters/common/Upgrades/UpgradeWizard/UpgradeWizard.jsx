import React from 'react';
import { useDispatch } from 'react-redux';

import { Spinner, Title } from '@patternfly/react-core';
import { Wizard as WizardDeprecated } from '@patternfly/react-core/deprecated';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import { useFetchUpgradeGatesFromApi } from '~/queries/ClusterDetailsQueries/useFetchUpgadeGatesFromApi';

import {
  refetchSchedules,
  useGetSchedules,
} from '../../../../../queries/ClusterDetailsQueries/ClusterSettingsTab/useGetSchedules';
import { usePostClusterGateAgreementAcknowledgeModal } from '../../../../../queries/ClusterDetailsQueries/ClusterSettingsTab/usePostClusterGateAgreement';
import { usePostSchedule } from '../../../../../queries/ClusterDetailsQueries/ClusterSettingsTab/usePostSchedule';
import {
  invalidateClusterDetailsQueries,
  useFetchClusterDetails,
} from '../../../../../queries/ClusterDetailsQueries/useFetchClusterDetails';
import { useGlobalState } from '../../../../../redux/hooks/useGlobalState';
import { modalActions } from '../../../../common/Modal/ModalActions';
import modals from '../../../../common/Modal/modals';
import { isHypershiftCluster } from '../../clusterStates';
import { getClusterUnMetClusterAcks } from '../UpgradeAcknowledge/UpgradeAcknowledgeHelpers';
import UpgradeAcknowledgeStep from '../UpgradeAcknowledge/UpgradeAcknowledgeStep';

import FinishedStep from './FinishedStep';
import UpgradeTimeSelection from './UpgradeTimeSelection';
import VersionSelectionGrid from './VersionSelectionGrid';

import './UpgradeWizard.scss';

const UpgradeWizard = () => {
  const dispatch = useDispatch();
  const [selectedVersion, setSelectedVersion] = React.useState(undefined);
  const [upgradeTimestamp, setUpgradeTimestamp] = React.useState(undefined);
  const [requireAcknowledgement, setRequireAcknowledgement] = React.useState(undefined);
  const [acknowledged, setAchnowledged] = React.useState(false);
  const [scheduleType, setScheduleType] = React.useState('now');
  const subscriptionID = useGlobalState((state) => state.modal.data.subscriptionID);
  const clusterName = useGlobalState((state) => state.modal.data.clusterName);

  const {
    cluster,
    isLoading: isClusterDetailsLoading,
    isSuccess: isClusterDetailsSuccess,
  } = useFetchClusterDetails(subscriptionID);

  const clusterID = cluster?.id;
  const region = cluster?.subscription?.rh_region_id;
  const isHypershift = isHypershiftCluster(cluster);

  const { data: schedules } = useGetSchedules(clusterID, isHypershift, region);
  const { data: upgradeGates } = useFetchUpgradeGatesFromApi(cluster?.managed, region);

  const getUnMetClusterAcknowledgements = (toVersion) =>
    getClusterUnMetClusterAcks(schedules, cluster, upgradeGates, toVersion);

  const { mutateAsync: postClusterGateAgreementMutate } =
    usePostClusterGateAgreementAcknowledgeModal(clusterID, region);
  const {
    mutate: postScheduleMutate,
    isError: isPostScheduleError,
    error: postScheduleError,
    isPending: isPostSchedulePending,
  } = usePostSchedule(clusterID, isHypershift, region);

  const isPending =
    (isClusterDetailsLoading && !isClusterDetailsSuccess) ||
    cluster?.subscription?.id !== subscriptionID;

  const gotAllDetails =
    selectedVersion &&
    (upgradeTimestamp || scheduleType === 'now') &&
    ((requireAcknowledgement && acknowledged) || !requireAcknowledgement);

  const close = () => {
    refetchSchedules();
    invalidateClusterDetailsQueries();
    setSelectedVersion(undefined);
    setUpgradeTimestamp(undefined);
    setScheduleType('now');
    dispatch(modalActions.closeModal());
  };

  const selectVersion = (version) => {
    const requireAcknowledgement = getUnMetClusterAcknowledgements(version).length > 0;
    setSelectedVersion(version);
    setRequireAcknowledgement(requireAcknowledgement);
  };

  const setSchedule = ({ timestamp, type }) => {
    setUpgradeTimestamp(timestamp);
    setScheduleType(type);
  };

  const onNext = (newStep) => {
    const MINUTES_IN_MS = 1000 * 60;
    if (newStep.id === 'finish') {
      const nextRun =
        scheduleType === 'now'
          ? new Date(new Date().getTime() + 6 * MINUTES_IN_MS).toISOString()
          : upgradeTimestamp;

      let error = null;
      let promises = null;
      const upgradeGateIds = getUnMetClusterAcknowledgements(selectedVersion).map(
        (upgradeGate) => upgradeGate.id,
      );

      if (!error) {
        promises = postClusterGateAgreementMutate(upgradeGateIds, {
          onError: (e) => {
            error = e;
          },
        });
      }

      promises.then(() => {
        if (!error) {
          const schedule = {
            schedule_type: 'manual',
            upgrade_type: isHypershiftCluster(cluster) ? 'ControlPlane' : 'OSD',
            next_run: nextRun,
            version: selectedVersion,
          };
          postScheduleMutate(schedule);
        }
      });
    }
  };

  const steps = [
    {
      id: 'select-version',
      name: 'Select version',
      component: isPending ? (
        <div className="pf-v5-u-text-align-center">
          <Spinner size="lg" aria-label="Loading..." />
        </div>
      ) : (
        <VersionSelectionGrid
          availableUpgrades={cluster?.version?.available_upgrades}
          clusterVersion={cluster?.openshift_version || cluster?.version?.id}
          clusterChannel={cluster?.version.channel_group}
          selected={selectedVersion}
          onSelect={selectVersion}
          getUnMetClusterAcknowledgements={getUnMetClusterAcknowledgements}
        />
      ),
      enableNext: !!selectedVersion,
    },
    ...(selectedVersion && requireAcknowledgement
      ? [
          {
            id: 'acknowledge_upgrade',
            name: 'Administrator acknowledgement',
            component: (
              <UpgradeAcknowledgeStep
                confirmed={(isConfirmed) => {
                  setAchnowledged(isConfirmed);
                }}
                unmetAcknowledgements={getUnMetClusterAcknowledgements(selectedVersion)}
                fromVersion={cluster?.openshift_version}
                toVersion={selectedVersion}
                initiallyConfirmed={acknowledged}
              />
            ),
            canJumpTo: !!selectedVersion,
            enableNext: gotAllDetails,
          },
        ]
      : []),
    {
      id: 'schedule-upgrade',
      name: 'Schedule update',
      component: (
        <UpgradeTimeSelection
          onSet={setSchedule}
          timestamp={upgradeTimestamp}
          type={scheduleType}
        />
      ),
      canJumpTo: !!selectedVersion && (!requireAcknowledgement || acknowledged),
      enableNext: gotAllDetails,
    },
    {
      id: 'confirmation',
      name: 'Confirmation',
      component: (
        <>
          <Title className="wizard-step-title" size="lg" headingLevel="h3">
            Confirmation of your update
          </Title>
          <dl className="wizard-step-body cluster-upgrade-dl">
            <div>
              <dt>Version</dt>
              <dd>
                {cluster?.openshift_version} &rarr; {selectedVersion}
              </dd>
            </div>
            {requireAcknowledgement ? (
              <div>
                <dt>Administrator acknowledgement</dt>
                <dd>{acknowledged ? 'Approved' : 'Not approved'}</dd>
              </div>
            ) : null}

            <dt>Scheduled</dt>
            <dd>
              {scheduleType === 'now' ? (
                'Within the next hour'
              ) : (
                <dl>
                  <dt>UTC</dt>
                  <dd>
                    <DateFormat type="exact" date={new Date(upgradeTimestamp)} />
                  </dd>
                  <div>
                    <dt>Local time</dt>
                    <dd>{new Date(upgradeTimestamp).toString()}</dd>
                  </div>
                </dl>
              )}
            </dd>
          </dl>
        </>
      ),
      nextButtonText: 'Confirm update',
      canJumpTo: gotAllDetails,
    },
    {
      id: 'finish',
      name: 'Finish',
      component: (
        <FinishedStep
          scheduleType={scheduleType}
          upgradeTimestamp={upgradeTimestamp}
          postScheduleError={postScheduleError}
          isPostScheduleError={isPostScheduleError}
          isPostSchedulePending={isPostSchedulePending}
          close={close}
        />
      ),
      isFinishedStep: true,
    },
  ];

  return (
    <WizardDeprecated
      title="Update cluster"
      className="ocm-upgrade-wizard"
      description={clusterName}
      isOpen
      steps={steps}
      onNext={onNext}
      onClose={close}
    />
  );
};

UpgradeWizard.propTypes = {};

UpgradeWizard.modalName = modals.UPGRADE_WIZARD;

export default UpgradeWizard;
