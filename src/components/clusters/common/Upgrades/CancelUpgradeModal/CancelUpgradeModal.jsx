import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Form } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import { useDeleteSchedule } from '~/queries/ClusterDetailsQueries/ClusterSettingsTab/useDeleteSchedule';
import { refetchSchedules } from '~/queries/ClusterDetailsQueries/ClusterSettingsTab/useGetSchedules';
import { invalidateClusterDetailsQueries } from '~/queries/ClusterDetailsQueries/useFetchClusterDetails';
import { useGlobalState } from '~/redux/hooks/useGlobalState';

import ErrorBox from '../../../../common/ErrorBox';
import Modal from '../../../../common/Modal/Modal';
import { closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

const CancelUpgradeModal = ({ isHypershift }) => {
  const dispatch = useDispatch();
  const isOpen = useGlobalState((state) => shouldShowModal(state, 'cancel-upgrade'));
  const { clusterID, region, schedule } = useGlobalState((state) => state.modal.data);

  const {
    isPending: isDeleteSchedulePending,
    isError: isDeleteScheduleError,
    error: deleteScheduleError,
    mutate: deleteScheduleMutate,
    reset: resetDeleteSchedules,
    isSuccess: isDeleteSchedulesSuccess,
  } = useDeleteSchedule(clusterID, isHypershift, region);

  const close = () => {
    resetDeleteSchedules();
    dispatch(closeModal());
  };

  React.useEffect(() => {
    if (!isDeleteSchedulePending && isDeleteSchedulesSuccess) {
      close();
    }
    // Infinite loop when add close
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [isDeleteSchedulesSuccess, isDeleteSchedulePending]);

  const deleteScheduleFunc = () => {
    deleteScheduleMutate(schedule.id, {
      onSuccess: () => {
        invalidateClusterDetailsQueries();
        refetchSchedules();
      },
    });
  };

  const error = isDeleteScheduleError ? (
    <ErrorBox message="Error cancelling update" response={deleteScheduleError} />
  ) : null;

  return (
    isOpen && (
      <Modal
        title="Cancel update"
        onClose={close}
        primaryText="Cancel this update"
        secondaryText="Close"
        onPrimaryClick={deleteScheduleFunc}
        isPending={isDeleteSchedulePending}
        onSecondaryClick={close}
      >
        <>
          {error}
          <Form onSubmit={deleteScheduleFunc}>
            <p>
              This update to version {schedule.version} is scheduled for{' '}
              <DateFormat type="exact" date={Date.parse(schedule.next_run)} />.{' '}
            </p>
          </Form>
        </>
      </Modal>
    )
  );
};

CancelUpgradeModal.propTypes = {
  isHypershift: PropTypes.bool.isRequired,
};

export default CancelUpgradeModal;
