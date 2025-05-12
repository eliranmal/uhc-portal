import { CloudVpc } from '~/types/clusters_mgmt.v1';

export const vpcList = [
  {
    name: 'jaosorior-8vns4-vpc',
    red_hat_managed: true,
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
    red_hat_managed: false,
    id: 'vpc-0cbe6c1d5f216cdb9',
    cidr_block: '10.0.0.0/24',
    aws_subnets: [
      {
        subnet_id: 'subnet-0fcc28e72f90f0ac4',
        name: 'caa-e2e-test-private-subnet',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1d',
        cidr_block: '10.0.0.0/25',
      },
      {
        subnet_id: 'subnet-04f5c843f1753f29d',
        name: 'caa-e2e-test-private-subnet-2',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.0.128/25',
      },
      {
        subnet_id: 'subnet-071863ea8dfeb4786',
        name: 'caa-e2e-test-public-subnet-2',
        red_hat_managed: false,
        public: true,
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
] as CloudVpc[];
