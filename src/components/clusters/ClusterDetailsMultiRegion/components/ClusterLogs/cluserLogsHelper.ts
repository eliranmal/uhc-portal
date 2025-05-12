import { ErrorDetail } from '~/types/types';

export type ClusterLogsErrorType = {
  pending?: boolean;
  fulfilled?: false;
  error?: true;
  errorCode?: number;
  internalErrorCode?: string;
  operationID?: string;
  errorMessage?: string | undefined;
  errorDetails?: ErrorDetail[];
};
