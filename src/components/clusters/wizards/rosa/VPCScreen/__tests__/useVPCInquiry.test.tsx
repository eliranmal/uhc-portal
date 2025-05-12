import { renderHook } from '@testing-library/react';

import { vpcList } from '~/components/clusters/common/__tests__/vpcs.fixtures';
import * as vpcInquiries from '~/components/clusters/common/useVPCInquiry';
import { VPCResponse } from '~/redux/reducers/ccsInquiriesReducer';

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: () => ({
    data: { items: vpcList },
    fulfilled: true,
    pending: false,
    error: false,
  }),
}));

jest.mock('~/components/clusters/wizards/hooks', () => ({
  useFormState: () => ({
    values: {
      region: 'us-west-2-v2',
    },
  }),
}));

describe('useAWSVPCInquiry', () => {
  describe('when isOSD=false', () => {
    it('returns the vpcsResponse from the redux store', () => {
      const view = renderHook(() => vpcInquiries.useAWSVPCInquiry(false));
      const { vpcs } = view.result.current as { vpcs: VPCResponse };
      expect(vpcs.data.items[0].id).toEqual(vpcList[0].id);
    });
  });

  describe('when isOSD=true', () => {
    it('builds the request from the Formik (v2) state', () => {
      const view = renderHook(() => vpcInquiries.useAWSVPCInquiry(true));
      const { requestParams } = view.result.current as {
        requestParams: { region: string };
      };
      expect(requestParams.region).toEqual('us-west-2-v2');
    });

    it('returns the vpcsResponse from the redux store', () => {
      const view = renderHook(() => vpcInquiries.useAWSVPCInquiry(true));
      const { vpcs } = view.result.current as { vpcs: VPCResponse };
      expect(vpcs.data.items[0].id).toEqual(vpcList[0].id);
    });
  });
});
