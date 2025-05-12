import React from 'react';

import { AvailableRegionalInstance } from '~/queries/types';
import { ClusterFromSubscription } from '~/types/types';

import clusterStates from '../clusterStates';

import ProgressList from './ProgressList';

interface InstallProgressProps {
  cluster: ClusterFromSubscription;
  hasInflightErrors: boolean;
  regionalInstance?: AvailableRegionalInstance;
}

const InstallProgress = ({ cluster, hasInflightErrors, regionalInstance }: InstallProgressProps) =>
  hasInflightErrors ||
  cluster.state === clusterStates.installing ||
  cluster.state === clusterStates.pending ||
  cluster.state === clusterStates.validating ||
  cluster.state === clusterStates.waiting ||
  cluster.state === clusterStates.error ? (
    <ProgressList cluster={cluster} actionRequiredInitialOpen regionalInstance={regionalInstance} />
  ) : null;

export default InstallProgress;
