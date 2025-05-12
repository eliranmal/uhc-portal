import { renderHook } from '@testing-library/react';

import { validateMaxNodes } from '~/common/validators';
import { useFeatureGate } from '~/queries/featureGates/useFetchFeatureGate';

import useValidateMaxNodesTotal from '../useValidateMaxNodesTotal';

jest.mock('~/common/validators', () => ({
  validateMaxNodes: jest.fn(),
  validatePositive: jest.fn(),
}));

jest.mock('~/queries/featureGates/useFetchFeatureGate', () => ({
  useFeatureGate: jest.fn(),
}));

describe('useValidateMaxNodesTotal', () => {
  it('should return undefined when bypassComputeNodeCountLimitClassicOsdGcpFlag is true', () => {
    (useFeatureGate as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useValidateMaxNodesTotal(10));

    const validationResult = result.current('5');
    expect(validationResult).toBeUndefined();
    expect(validateMaxNodes).not.toHaveBeenCalled();
  });

  it('should call validateMaxNodes when bypassComputeNodeCountLimitClassicOsdGcpFlag is false', () => {
    (useFeatureGate as jest.Mock).mockReturnValue(false);
    (validateMaxNodes as jest.Mock).mockReturnValue('value');

    const { result } = renderHook(() => useValidateMaxNodesTotal(10));

    const validationResult = result.current('5');
    expect(validationResult).toBe('value');
    expect(validateMaxNodes).toHaveBeenCalledWith('5', 10);
  });
});
