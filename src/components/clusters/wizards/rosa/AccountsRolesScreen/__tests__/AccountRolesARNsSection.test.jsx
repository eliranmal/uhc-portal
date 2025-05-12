import React from 'react';
import { Formik } from 'formik';

import { ROSA_HOSTED_CLI_MIN_VERSION } from '~/components/clusters/wizards/rosa/rosaConstants';
import { HCP_USE_UNMANAGED } from '~/queries/featureGates/featureConstants';
import { checkAccessibility, mockUseFeatureGate, render, screen } from '~/testUtils';

import { initialValues } from '../../constants';
import AccountRolesARNsSection from '../AccountRolesARNsSection/AccountRolesARNsSection';

const latestOCPVersion = '4.13.3';
const latestVersionLoaded = '4.13.5';

jest.mock('~/hooks/useAnalytics', () => jest.fn(() => jest.fn()));
jest.mock('~/components/releases/hooks', () => ({
  useOCPLatestVersion: () => [latestOCPVersion, latestVersionLoaded],
}));

const buildTestComponent = (children, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
    }}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

const accountRolesList = [
  {
    prefix: 'myManagedRoles',
    managedPolicies: true,
    hcpManagedPolicies: true,
    version: '4.13.0',
    Installer: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Worker-Role',
  },
  {
    prefix: 'myUnManagedRoles',
    managedPolicies: false,
    hcpManagedPolicies: false,
    version: '4.13.0',
    ControlPlane: 'arn:aws:iam::123456789012:role/myUnManagedRoles-ControlPlane-Role',
    Installer: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Worker-Role',
  },
  {
    prefix: 'bothRoles',
    managedPolicies: true,
    hcpManagedPolicies: true,
    version: '4.13.0',
    Installer: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Worker-Role',
  },
  {
    prefix: 'bothRoles',
    managedPolicies: false,
    hcpManagedPolicies: false,
    version: '4.13.0',
    ControlPlane: 'arn:aws:iam::123456789012:role/bothRoles-ControlPlane-Role',
    Installer: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
    Support: 'arn:aws:iam::123456789012:role/bothRoles-Support-Role',
    Worker: 'arn:aws:iam::123456789012:role/bothRoles-Worker-Role',
  },
];

const isRendered = async () => expect(await screen.findByText('Account roles')).toBeInTheDocument();

describe('<AccountRolesARNsSection />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
  const props = {
    selectedAWSAccountID: '',
    selectedInstallerRoleARN: '',
    rosaMaxOSVersion: '4.13.1',
    getAWSAccountRolesARNs: jest.fn(),
    getAWSAccountRolesARNsResponse: {
      fulfilled: true,
      error: false,
      pending: false,
      data: accountRolesList,
    },
    clearGetAWSAccountRolesARNsResponse: jest.fn(),
    isHypershiftSelected: true,
    onAccountChanged: jest.fn(),
  };

  it('is accessible', async () => {
    const { container } = render(buildTestComponent(<AccountRolesARNsSection {...props} />));

    await checkAccessibility(container);
    await isRendered();
  });

  it('Shows only unmanaged policy roles for non hypershift cluster', async () => {
    const newProps = { ...props, isHypershiftSelected: false };
    const { user } = render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
    await isRendered();

    // expand installer drop-down
    await user.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
      }),
    ).not.toBeInTheDocument();
  });

  it('Shows only managed policy roles for hypershift cluster and feature flag is false', async () => {
    mockUseFeatureGate([[HCP_USE_UNMANAGED, false]]);

    const newProps = { ...props, isHypershiftSelected: true };
    const { user } = render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
    await isRendered();

    // expand installer drop-down
    await user.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();
  });

  it('Shows only both managed and unmanaged policy roles for hypershift cluster and feature flag is true', async () => {
    mockUseFeatureGate([[HCP_USE_UNMANAGED, true]]);
    const newProps = { ...props, isHypershiftSelected: true };
    const { user } = render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
    await isRendered();

    // expand installer drop-down
    await user.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myUnManagedRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/myManagedRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: 'arn:aws:iam::123456789012:role/bothRoles-HCP-ROSA-Installer-Role',
      }),
    ).toBeInTheDocument();
  });

  describe('default installer role', () => {
    const ManagedOpenShiftInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/ManagedOpenShift-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Support-Role',
      Worker: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Worker-Role',
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'ManagedOpenShift',
      version: '4.13',
    };

    const nonManagedCompleteInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Support-Role',
      Worker: 'arn:aws:iam::000000000006:role/nonManagedComplete-1-Worker-Role',
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'nonManagedComplete-1',
      version: '4.13',
    };
    const nonManagedCompleteInstallerRole2 = {
      ControlPlane: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Support-Role',
      Worker: 'arn:aws:iam::000000000006:role/nonManagedComplete-2-Worker-Role',
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'nonManagedComplete-2',
      version: '4.13',
    };
    const testManagedInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/test-managed-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/test-managed-Installer-Role',
      Support: 'arn:aws:iam::000000000006:role/test-managed-Support-Role',
      hcpManagedPolicies: true,
      isAdmin: false,
      managedPolicies: true,
      prefix: 'test-managed',
      version: '4.13',
    };

    const incompleteNonManagedInstallerRole = {
      ControlPlane: 'arn:aws:iam::000000000006:role/incomplete-1-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/incomplete-1-Installer-Role',
      Support: undefined,
      Worker: undefined,
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'incomplete-1',
      version: '4.13',
    };
    const incompleteNonManagedInstallerRole2 = {
      ControlPlane: 'arn:aws:iam::000000000006:role/incomplete-2-ControlPlane-Role',
      Installer: 'arn:aws:iam::000000000006:role/incomplete-2-Installer-Role',
      Support: undefined,
      Worker: undefined,
      hcpManagedPolicies: false,
      isAdmin: false,
      managedPolicies: false,
      prefix: 'incomplete-1',
      version: '4.13',
    };

    // Note: These tests work because on mount, the Installer arn drop down only shows the selected version

    it('defaults to IAM role with prefix -ManagedOpenShift', async () => {
      mockUseFeatureGate([[HCP_USE_UNMANAGED, true]]);

      const roleList = [
        nonManagedCompleteInstallerRole,
        ManagedOpenShiftInstallerRole, // This is the first "-ManagedOpenShift" role
        nonManagedCompleteInstallerRole2,
        testManagedInstallerRole,
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
      await isRendered();

      expect(screen.getByText(ManagedOpenShiftInstallerRole.Installer)).toBeInTheDocument();
    });

    it('defaults to first managed policy role if no -ManagedOpenShift prefixed role exists', async () => {
      mockUseFeatureGate([[HCP_USE_UNMANAGED, true]]);

      const roleList = [
        incompleteNonManagedInstallerRole,
        nonManagedCompleteInstallerRole,
        testManagedInstallerRole, // This is the first  managed policy
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
      await isRendered();

      expect(screen.getByText(testManagedInstallerRole.Installer)).toBeInTheDocument();
    });

    it('defaults to first complete role set if no -ManagedOpenShift prefix or managed policy role exists', async () => {
      mockUseFeatureGate([[HCP_USE_UNMANAGED, true]]);

      const roleList = [
        incompleteNonManagedInstallerRole,
        nonManagedCompleteInstallerRole, // This is the first complete set
        nonManagedCompleteInstallerRole2,
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
      await isRendered();

      expect(screen.getByText(nonManagedCompleteInstallerRole.Installer)).toBeInTheDocument();
    });

    it('defaults to first incomplete role set if no -ManagedOpenshift prefix, managed policy, or complete role set exists', async () => {
      mockUseFeatureGate([[HCP_USE_UNMANAGED, true]]);

      const roleList = [
        incompleteNonManagedInstallerRole, // this is the first
        incompleteNonManagedInstallerRole2,
      ];
      const newProps = {
        ...props,
        isHypershiftSelected: true,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: roleList,
        },
      };
      render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
      await isRendered();

      expect(screen.getByText(incompleteNonManagedInstallerRole.Installer)).toBeInTheDocument();
    });
  });

  describe('ROSA CLI requirement message', () => {
    const rosaCLIMessage = `You must use ROSA CLI version ${ROSA_HOSTED_CLI_MIN_VERSION} or above.`;

    const getIncompleteRoleSets = ({ isHypershift }) =>
      accountRolesList.map((role) => {
        const compatibleRoleSets = isHypershift
          ? ['myManagedRoles']
          : ['bothRoles', 'myUnManagedRoles'];
        return compatibleRoleSets.includes(role.prefix) ? { ...role, Support: undefined } : role;
      });

    it('is shown when not all ARNs are detected and Hypershift has been selected', async () => {
      const testProps = {
        ...props,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: getIncompleteRoleSets({ isHypershift: true }),
        },
      };
      render(buildTestComponent(<AccountRolesARNsSection {...testProps} />));
      await isRendered();

      expect(screen.getByText(rosaCLIMessage)).toBeInTheDocument();
    });

    it('is not shown when not all ARNs are detected and ROSA classic has been selected', async () => {
      const newProps = {
        ...props,
        getAWSAccountRolesARNsResponse: {
          fulfilled: true,
          error: false,
          pending: false,
          data: getIncompleteRoleSets({ isHypershift: false }),
        },
        isHypershiftSelected: false,
      };
      render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
      await isRendered();

      expect(screen.queryByText(rosaCLIMessage)).not.toBeInTheDocument();
      expect(screen.getByText('Some account roles ARNs were not detected')).toBeInTheDocument();
    });

    it('shows "Cannot detect an OCM role" error message', async () => {
      const newProps = {
        ...props,
        getAWSAccountRolesARNsResponse: {
          fulfilled: false,
          error: true,
          pending: false,
          errorCode: 400,
          internalErrorCode: 'CLUSTERS-MGMT-400',
          errorMessage:
            "CLUSTERS-MGMT-400:\nFailed to assume role with ARN 'arn:aws:iam::000000000002:role/ManagedOpenShift-OCM-Role-15212158': operation error STS: AssumeRole, https response error StatusCode: 403, RequestID: 40314369-b5e1-4d1a-94f1-5014b7419dea, api error AccessDenied: User: arn:aws:sts::644306948063:assumed-role/RH-Managed-OpenShift-Installer/OCM is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::000000000002:role/ManagedOpenShift-OCM-Role-15212158",
        },
        isHypershiftSelected: false,
      };
      render(buildTestComponent(<AccountRolesARNsSection {...newProps} />));
      await isRendered();

      expect(screen.queryByText(rosaCLIMessage)).not.toBeInTheDocument();
      expect(screen.getByText('Cannot detect an OCM role')).toBeInTheDocument();
      expect(screen.getByText('create the required role')).toBeInTheDocument();
    });
  });
});
