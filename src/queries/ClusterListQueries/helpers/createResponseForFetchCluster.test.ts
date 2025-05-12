import { ErrorResponse, formatClusterListError } from './createResponseForFetchCluster';

describe('createResponseForFetchClusters', () => {
  describe('formatClusterListError', () => {
    it('returns null if no response.error', () => {});

    it('returns null if no response.error.response or response.error.message', () => {});

    it('returns a formatted error', () => {
      const error = {
        response: { data: { reason: 'This is custom error', operation_id: '1234abc' } },
      } as unknown as ErrorResponse;
      const response = { error };

      const region = 'myRegion';

      const expected = {
        operation_id: '1234abc',
        reason: 'This is custom error',
        region: 'myRegion',
      };

      expect(formatClusterListError(response, region)).toEqual(expected);
    });

    it('returns a formatted error when operation data is missing', () => {
      const error = {
        message: 'This is custom error',
      } as unknown as ErrorResponse;
      const response = { error };

      const region = 'myRegion';

      const expected = {
        operation_id: undefined,
        reason: 'This is custom error',
        region: 'myRegion',
      };

      expect(formatClusterListError(response, region)).toEqual(expected);
    });

    it('returns a formatted error when region is missing', () => {
      const error = {
        response: { data: { reason: 'This is custom error', operation_id: '1234abc' } },
      } as unknown as ErrorResponse;
      const response = { error };

      const expected = {
        operation_id: '1234abc',
        reason: 'This is custom error',
        region: undefined,
      };

      expect(formatClusterListError(response)).toEqual(expected);
    });
  });
});
