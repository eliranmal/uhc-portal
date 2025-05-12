import React from 'react';

import * as vpcHelpers from '~/common/vpcHelpers';
import { useAWSVPCInquiry } from '~/components/clusters/common/useVPCInquiry';
import { render, screen } from '~/testUtils';
import { CloudVpc } from '~/types/clusters_mgmt.v1';

import VPCDropdown from './VPCDropdown';

const defaultProps = {
  selectedVPC: { id: '', name: '' },
  input: { name: '', value: '', onBlur: () => {}, onChange: () => {} },
  showRefresh: true,
  meta: { error: '', touched: false },
  usePrivateLink: false,
};

const vpcList = [
  {
    name: 'jaosorior-8vns4-vpc',
    red_hat_managed: false,
    id: 'vpc-046c3e3efea64c91e',
    cidr_block: '10.0.0.0/16',
    aws_subnets: [
      {
        subnet_id: 'subnet-0ef3450e32176b7a9',
        name: 'jaosorior-8vns4-public-us-east-1f',
        red_hat_managed: false,
        public: true,
        availability_zone: 'us-east-1f',
        cidr_block: '10.0.64.0/20',
      },
    ],
  },
  {
    name: 'caa-e2e-test-vpc',
    red_hat_managed: true,
    id: 'vpc-0cbe6c1d5f216cdb9',
    cidr_block: '10.0.0.0/24',
    aws_subnets: [
      {
        subnet_id: 'subnet-0fcc28e72f90f0ac4',
        name: 'caa-e2e-test-subnet',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1d',
        cidr_block: '10.0.0.0/25',
      },
      {
        subnet_id: 'subnet-04f5c843f1753f29d',
        name: 'caa-e2e-test-subnet-2',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.0.128/25',
      },
    ],
  },
  {
    name: 'zac-east-vpc',
    red_hat_managed: false,
    id: 'vpc-0867306df195ec3b3',
    cidr_block: '10.0.0.0/16',
    aws_subnets: [
      {
        subnet_id: 'subnet-0062bbe166b68eb30',
        name: 'zac-east-subnet-private1-us-east-1a',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.128.0/20',
      },
      {
        subnet_id: 'subnet-0ad2d37134f494b70',
        name: 'zac-east-subnet-public1-us-east-1a',
        red_hat_managed: false,
        public: true,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.0.0/20',
      },
    ],
  },
  {
    name: 'example-5kqtl-vpc',
    red_hat_managed: false,
    id: 'vpc-02719dc0176c44199',
    cidr_block: '10.0.0.0/16',
    aws_subnets: [
      {
        subnet_id: 'subnet-0a883dabe62e19193',
        name: 'example-5kqtl-private-us-east-1a',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.128.0/20',
      },
      {
        subnet_id: 'subnet-051a46a9f4f78faae',
        name: 'example-5kqtl-public-us-east-1a',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.0.0/20',
      },
    ],
  },
  {
    name: 'lz-p2-318-z6fst-vpc',
    red_hat_managed: false,
    id: 'vpc-099304b69dd838794',
    cidr_block: '10.0.0.0/19',
  },
];

jest.mock('~/components/clusters/common/useVPCInquiry');

describe('<VPCDropdown />', () => {
  const requestParams = {
    region: 'us-west-2',
  };

  describe('When some VPCs exist', () => {
    beforeEach(() => {
      (useAWSVPCInquiry as jest.Mock).mockImplementation(() => ({
        vpcs: {
          fulfilled: true,
          data: { items: vpcList },
        },
        requestParams,
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('shows refresh available', () => {
      render(<VPCDropdown {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled();
    });

    it('shows search in select vpc dropdown', async () => {
      const { user } = render(<VPCDropdown {...defaultProps} />);
      expect(await screen.findByText(/^select a vpc$/i)).toBeInTheDocument();
      const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
      await user.click(selectDropdown);
      expect(screen.getByPlaceholderText('Filter by VPC ID / name')).toBeInTheDocument();
    });

    it('shows the selected cloud provider region information', () => {
      render(<VPCDropdown {...defaultProps} />);

      expect(
        screen.getByText(
          'Select a VPC to install your cluster into your selected region: us-west-2',
        ),
      ).toBeInTheDocument();
    });

    it('lists only the VPCs that are not managed by Red Hat', async () => {
      const { user } = render(<VPCDropdown {...defaultProps} />);
      expect(await screen.findByText(/^select a vpc$/i)).toBeInTheDocument();

      const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
      await user.click(selectDropdown);

      // Assert
      expect(screen.getByText('jaosorior-8vns4-vpc')).toBeInTheDocument();
      expect(screen.getByText('zac-east-vpc')).toBeInTheDocument();
      expect(screen.queryByText('caa-e2e-test-vpc')).not.toBeInTheDocument();
    });

    describe('VPC description', () => {
      it('is not shown when the VPC has all necessary subnets', async () => {
        jest
          .spyOn(vpcHelpers, 'vpcHasRequiredSubnets')
          .mockImplementation((vpc: CloudVpc) => vpc.name === 'lz-p2-318-z6fst-vpc');

        const { user } = render(<VPCDropdown {...defaultProps} />);

        const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
        await user.click(selectDropdown);

        expect(screen.getByText('lz-p2-318-z6fst-vpc').nextElementSibling).toBeNull();
      });

      it('is shown as disabled when the VPC does not have all necessary subnets', async () => {
        jest
          .spyOn(vpcHelpers, 'vpcHasRequiredSubnets')
          .mockImplementation((vpc: CloudVpc) => vpc.name !== 'lz-p2-318-z6fst-vpc');

        const { user } = render(<VPCDropdown {...defaultProps} />);

        const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
        await user.click(selectDropdown);

        expect(
          screen.getByText('This VPC does not have all necessary subnets'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('When no VPCs exist', () => {
    beforeEach(() => {
      (useAWSVPCInquiry as jest.Mock).mockImplementation(() => ({
        vpcs: {
          fulfilled: true,
          data: { items: [] },
        },
        requestParams,
      }));
    });
    it('shows a message that no VPCs were found', async () => {
      render(<VPCDropdown {...defaultProps} />);
      expect(await screen.findByText(/No VPCs found/i)).toBeInTheDocument();
    });
  });
});
