import * as clusterService from '~/services/clusterService';
import { renderHook, waitFor } from '~/testUtils';

import { useUpdateDeleteProtections } from './useUpdateDeleteProtection';

const mockGetClusterServiceForRegion = jest.spyOn(clusterService, 'getClusterServiceForRegion');
const mockedUpdateDeleteProtection = jest.fn();

describe('useArchiveCluster', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calling mutate calls updateDeleteProtection service', async () => {
    // @ts-ignore
    mockGetClusterServiceForRegion.mockReturnValue({
      updateDeleteProtection: mockedUpdateDeleteProtection,
    });
    mockedUpdateDeleteProtection.mockResolvedValue('hello world');

    const { result } = renderHook(() => useUpdateDeleteProtections());

    result.current.mutate({
      clusterID: 'myClusterID',
      region: 'myRegion',
      isProtected: true,
    });

    await waitFor(() => {
      expect(mockGetClusterServiceForRegion).toHaveBeenCalled();
    });
    expect(mockGetClusterServiceForRegion).toHaveBeenCalledWith('myRegion');
    expect(mockedUpdateDeleteProtection).toHaveBeenCalledWith('myClusterID', true);
  });
});
