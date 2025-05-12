import { indexRegions, processAWSVPCs } from '~/redux/reducers/ccsInquiriesReducer';
import { CloudRegion, CloudVpc } from '~/types/clusters_mgmt.v1';

import awsRegions from '../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/regions.json';
import vpcResponse from '../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/vpcs.json';

const vpcItems = vpcResponse.items as CloudVpc[];

describe('processAWSVPCs', () => {
  const vpcId = 'vpc-with-security-groups-one';

  it('returns the VPC items in the same order', () => {
    const result = processAWSVPCs(vpcItems);

    expect(result.items).toHaveLength(vpcItems.length);
    vpcItems.forEach((vpc, index) => {
      expect(vpc.name).toEqual(result.items[index].name);
    });
  });

  it('removes the Red Hat managed security groups', () => {
    const result = processAWSVPCs(vpcItems);

    const processedVpcWithSGs = result.items.find((vpc) => vpc.id === vpcId) as CloudVpc;

    const resultSgs = processedVpcWithSGs.aws_security_groups || [];
    expect(resultSgs.length).toEqual(5);
    resultSgs.forEach((sg) => {
      expect(sg.red_hat_managed).toBeFalsy();
    });
  });

  it('sorts the VPC security groups by their display order', () => {
    const result = processAWSVPCs(vpcItems);
    const processedVpcWithSGs = result.items.find((vpc) => vpc.id === vpcId) as CloudVpc;
    const resultSgs = processedVpcWithSGs.aws_security_groups || [];

    const expectSortOrder = [
      {
        id: 'sg-xyz',
        name: 'sg-a-name-that-should-go-first',
      },
      {
        id: 'sg-def',
        name: 'sg-def',
      },
      {
        id: 'sg-abc',
        name: 'sg-pqr',
      },
      {
        id: 'sg-123-no-name',
        name: '',
      },
      {
        id: 'sg-no-name',
        name: '',
      },
    ];
    expect(resultSgs.map((sg) => sg.id)).toEqual(expectSortOrder.map((sg) => sg.id));
  });
});

describe('indexRegions', () => {
  it('handles null items', () => {
    // Don't remember if this API may serializes empty `items` as `null` but let's be defensive.
    // See above about `as` cast.
    const data = { items: null } as unknown as { items: CloudRegion[] };
    expect(indexRegions(data)).toEqual({});
  });

  it('indexes regions correctly', () => {
    const byID = indexRegions(awsRegions);
    expect(byID[awsRegions.items[0].id]).toEqual(awsRegions.items[0]);
    expect(byID['ap-east-1']).toMatchObject({
      id: 'ap-east-1',
      ccs_only: true,
    });
  });
});
