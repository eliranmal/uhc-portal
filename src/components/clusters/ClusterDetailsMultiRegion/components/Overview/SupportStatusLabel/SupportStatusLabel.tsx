import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Skeleton } from '@patternfly/react-core';

import { getSupportStatus } from '~/redux/actions/supportStatusActions';
import { useGlobalState } from '~/redux/hooks';

import SupportStatus from '../../../../../common/SupportStatus';

import './SupportStatusLabel.scss';

type SupportStatusLabelProps = {
  clusterVersion: string;
};

const SupportStatusLabel = ({ clusterVersion }: SupportStatusLabelProps) => {
  const supportStatus = useGlobalState((state) => state.supportStatus) ?? {};
  const supportedVersionRegex = useMemo(() => /^[4-6]\.\d{1,3}(\.\d{1,3})?$/, []);
  const status = useMemo(
    () => supportStatus.supportStatus?.[clusterVersion.split('.', 2).join('.')],
    [clusterVersion, supportStatus.supportStatus],
  );
  const shouldHideComponent = useMemo(
    () =>
      !clusterVersion ||
      clusterVersion === 'N/A' ||
      supportStatus.error ||
      !status ||
      !supportedVersionRegex.test(clusterVersion),
    [clusterVersion, status, supportStatus.error, supportedVersionRegex],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!supportStatus.fulfilled && !supportStatus.pending) {
      dispatch(getSupportStatus());
    }
  }, [dispatch, supportStatus.fulfilled, supportStatus.pending]);

  if (supportStatus.pending) {
    return <Skeleton fontSize="sm" className="inline-skeleton" screenreaderText="Loading..." />;
  }

  return shouldHideComponent ? <>N/A</> : <SupportStatus status={status} />;
};

export default SupportStatusLabel;
