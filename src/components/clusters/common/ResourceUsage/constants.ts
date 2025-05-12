import clusterStates from '../clusterStates';

const metricsStatusMessages = {
  [clusterStates.installing]:
    'This cluster is installing so some data might not be available. This may take a few minutes.',
  [clusterStates.pending]:
    'This cluster is installing so some data might not be available. This may take a few minutes.',
  [clusterStates.validating]:
    'This cluster is installing so some data might not be available. This may take a few minutes.',
  [clusterStates.waiting]: 'This cluster requires user action before installation can start.',
  [clusterStates.error]: 'An error occured',
  [clusterStates.uninstalling]:
    'This cluster is being deleted so some data might not be available.',
  [clusterStates.stale]: 'No metrics sent during the last 24 hours.',
  [clusterStates.unknown]: 'The cluster currently does not have any metrics data. Try again later.',
  archived: 'The cluster has been archived and does not have any metrics data.',
  default: 'The cluster currently does not have any metrics data. Try again later.',
};

const clusterDetailConsts = {
  metricsStatusMessages,
};

export { clusterDetailConsts, metricsStatusMessages };
