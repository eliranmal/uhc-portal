import * as React from 'react';

import { mockRestrictedEnv, render, screen } from '../../../../../../../testUtils';

import VPCDetailsCard from './VPCDetailsCard';

describe('<VPCDetailsCard />', () => {
  const defaultProps = {
    cluster: {
      aws: {
        subnet_ids: ['subnet-05281fa2678b6d8cd', 'subnet-03f3654ffc25369ac'],
      },
    },
  };

  describe('in default environment', () => {
    it('renders footer', async () => {
      render(<VPCDetailsCard {...defaultProps} />);
      expect(screen.queryByText('Edit cluster-wide proxy')).toBeInTheDocument();
    });
  });

  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    beforeAll(() => {
      isRestrictedEnv.mockReturnValue(true);
    });
    afterAll(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('does not render footer', async () => {
      render(<VPCDetailsCard {...defaultProps} />);
      expect(screen.queryByText('Edit cluster-wide proxy')).not.toBeInTheDocument();
    });
  });

  describe('When Private Service Connect Subnet is provided', () => {
    const props = {
      cluster: {
        gcp_network: 'gcpNetwork',
        gcp: {
          private_service_connect: {
            service_attachment_subnet: 'gcpPrivateServiceConnect',
          },
        },
      },
    };

    it('renders Private Service Connect Subnet', async () => {
      render(<VPCDetailsCard {...props} />);
      expect(screen.queryByText('Private Service Connect Subnet')).toBeInTheDocument();
      expect(screen.queryByText('gcpPrivateServiceConnect')).toBeInTheDocument();
    });
  });
});
