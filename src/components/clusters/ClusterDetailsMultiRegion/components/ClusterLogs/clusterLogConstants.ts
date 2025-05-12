import { ClusterLogLog_type as ClusterLogType } from '~/types/service_logs.v1';

const GET_CLUSTER_LOGS = 'GET_CLUSTER_LOGS';
const RESET_CLUSTER_HISTORY = 'RESET_CLUSTER_HISTORY';

const SEVERITY_TYPES: string[] = [
  'Debug',
  'Info',
  'Warning',
  'Error',
  'Major',
  'Critical',
  'Fatal',
];
const LOG_TYPES: string[] = Object.values(ClusterLogType).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: 'case' }),
);

const clusterLogConstants = {
  GET_CLUSTER_LOGS,
  SEVERITY_TYPES,
  LOG_TYPES,
  RESET_CLUSTER_HISTORY,
};

export { GET_CLUSTER_LOGS, LOG_TYPES, RESET_CLUSTER_HISTORY, SEVERITY_TYPES };
export default clusterLogConstants;
