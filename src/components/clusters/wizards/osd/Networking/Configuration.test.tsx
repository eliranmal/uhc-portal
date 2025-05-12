import React from 'react';
import { Formik, FormikValues } from 'formik';

import { PRIVATE_SERVICE_CONNECT } from '~/queries/featureGates/featureConstants';
import { mockUseFeatureGate, render, screen, waitFor } from '~/testUtils';

import { GCPAuthType } from '../ClusterSettings/CloudProvider/types';
import { FieldId, initialValues } from '../constants';

import { Configuration } from './Configuration';
import { ClusterPrivacyType } from './constants';

const prepareComponent = (customValues?: FormikValues) => (
  <Formik
    initialValues={{
      ...initialValues,
      [FieldId.ClusterVersion]: { raw_id: '4.17.0' },
      ...customValues,
    }}
    onSubmit={() => {}}
  >
    {(props) => (
      <>
        <Configuration />
        <button type="submit" onClick={() => props.handleSubmit()}>
          Submit
        </button>
      </>
    )}
  </Formik>
);

describe('<Configuration /> using Serivce Account', () => {
  describe('<Configuration /> with Public selected', () => {
    it('renders correctly with default fields', () => {
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.External,
          [FieldId.GcpAuthType]: GCPAuthType.ServiceAccounts,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
    });

    it('do not render PSC option for public', () => {
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.External,
          [FieldId.GcpAuthType]: GCPAuthType.ServiceAccounts,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).not.toBeInTheDocument();
    });
  });
  describe('<Configuration /> using Service Account with Private selected', () => {
    it('does render Private service connect checkbox option for private', () => {
      mockUseFeatureGate([[PRIVATE_SERVICE_CONNECT, true]]);
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.Internal,
          [FieldId.GcpAuthType]: GCPAuthType.ServiceAccounts,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).toBeInTheDocument();
    });
    it('does not render Private service connect checkbox if feature flag is off', () => {
      mockUseFeatureGate([[PRIVATE_SERVICE_CONNECT, false]]);
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.Internal,
          [FieldId.GcpAuthType]: GCPAuthType.ServiceAccounts,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).not.toBeInTheDocument();
    });
    it('does render Private service connect checkbox and it is checked', () => {
      mockUseFeatureGate([[PRIVATE_SERVICE_CONNECT, true]]);
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.Internal,
          [FieldId.GcpAuthType]: GCPAuthType.ServiceAccounts,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
          [FieldId.PrivateServiceConnect]: true,
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', {
          name: 'Use Private Service Connect',
        }),
      ).toBeChecked();
    });
  });
});

describe('<Configuration /> using WIF', () => {
  describe('<Configuration /> using WIF with Public selected', () => {
    it('renders correctly with default fields', () => {
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.External,
          [FieldId.GcpAuthType]: GCPAuthType.WorkloadIdentityFederation,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
    });
    it('do not render PSC option for public', () => {
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.External,
          [FieldId.GcpAuthType]: GCPAuthType.WorkloadIdentityFederation,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).not.toBeInTheDocument();
    });
  });
  describe('<Configuration /> using WIF with Private selected', () => {
    it('does render Private service connect checkbox option for private', async () => {
      mockUseFeatureGate([[PRIVATE_SERVICE_CONNECT, true]]);
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.Internal,
          [FieldId.GcpAuthType]: GCPAuthType.WorkloadIdentityFederation,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      await waitFor(() => {
        expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      });
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).toBeInTheDocument();
    });
    it('does not render Private service connect checkbox if feature flag is off', () => {
      mockUseFeatureGate([[PRIVATE_SERVICE_CONNECT, false]]);
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.Internal,
          [FieldId.GcpAuthType]: GCPAuthType.WorkloadIdentityFederation,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
        }),
      );
      expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).not.toBeInTheDocument();
    });
    it('does render Private service connect checkbox, it is checked, and it is disabled', async () => {
      mockUseFeatureGate([[PRIVATE_SERVICE_CONNECT, true]]);
      render(
        prepareComponent({
          [FieldId.ClusterPrivacy]: ClusterPrivacyType.Internal,
          [FieldId.GcpAuthType]: GCPAuthType.WorkloadIdentityFederation,
          [FieldId.Byoc]: 'true',
          [FieldId.CloudProvider]: 'gcp',
          [FieldId.PrivateServiceConnect]: true,
        }),
      );
      await waitFor(() => {
        expect(screen.queryByText('Install into an existing VPC')).toBeInTheDocument();
      });
      expect(screen.queryByText('Configure a cluster-wide proxy')).toBeInTheDocument();
      expect(screen.queryByText('Use Private Service Connect')).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', {
          name: 'Use Private Service Connect',
        }),
      ).toBeChecked();
      expect(
        screen.getByRole('checkbox', {
          name: 'Use Private Service Connect',
        }),
      ).toBeDisabled();
    });
  });
});
