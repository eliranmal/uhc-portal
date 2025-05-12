import React from 'react';

import links, { tools } from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';

import instructionsMapping from './instructions/instructionsMapping';
import { InstructionChooserProps } from './models/types';

const AlibabaCloudPropsLinks = (
  <>
    For&nbsp;
    <ExternalLink href={links.INSTALL_GENERIC_NON_TESTED_PLATFORMS} stopClickPropagation>
      non-tested platforms
    </ExternalLink>
  </>
);

// Example of props data for generic install component
export const AlibabaProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Alibaba Cloud',
  providerTitle: 'Alibaba Cloud',
  name: 'alibaba-cloud',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Alibaba Cloud' },
  ],
  aiPageLink: '/assisted-installer/clusters/~new',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  hideIPI: true,
  ipiPageLink: '',
  hideUPI: true,
  upiPageLink: '',
  agentBasedPageLink: '/install/platform-agnostic/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  providerSpecificFeatures: {
    abi: [AlibabaCloudPropsLinks, 'For air-gapped/restricted networks'],
    ai: [AlibabaCloudPropsLinks],
    upi: [AlibabaCloudPropsLinks],
  },
};

export const ArmAwsProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS (ARM)',
  providerTitle: 'AWS (ARM)',
  providerSpecificFeatures: {
    ipi: ['Hosts controlled with AWS Provider'],
  },
  ipiPageLink: '/install/aws/arm/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_AWSIPI_LEARN_MORE,
  upiPageLink: '/install/aws/arm/user-provisioned',
  upiLearnMoreLink: links.INSTALL_AWSUPI_GETTING_STARTED,
  name: 'aws',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services (ARM)' },
  ],
};

export const ArmAWSIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS Installer-Provisioned ARM Infrastructure',
  providerTitle: instructionsMapping.aws.arm.ipi.title,
  customizations: instructionsMapping.aws.customizations,
  cloudProviderId: 'aws',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services (ARM)', path: '/install/aws/arm' },
    { label: 'Installer-provisioned infrastructure' },
  ],
  instructionsMapping: instructionsMapping.aws.arm.ipi,
};

export const ArmAWSUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS User-Provisioned ARM Infrastructure',
  providerTitle: instructionsMapping.aws.arm.upi.title,
  cloudProviderId: 'aws',
  isUPI: true,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services (ARM)', path: '/install/aws/arm' },
    { label: 'User-provisioned infrastructure' },
  ],
  instructionsMapping: instructionsMapping.aws.arm.upi,
};

export const ArmAzureIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Installer-Provisioned ARM Infrastructure',
  providerTitle: instructionsMapping.azure.arm.ipi.title,
  customizations: instructionsMapping.azure.customizations,
  cloudProviderId: 'azure',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure (ARM)' /* , path: '/install/azure' */ },
    /* { label: 'Installer-provisioned infrastructure' }, */
  ],
  instructionsMapping: instructionsMapping.azure.arm.ipi,
};

export const ArmBareMetalProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal',
  providerTitle: 'ARM Bare Metal',
  name: 'arm',
  ipiPageLink: '/install/arm/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_BAREMETAL_IPI_LEARN_MORE,
  upiPageLink: '/install/arm/user-provisioned',
  upiLearnMoreLink: links.INSTALL_BAREMETAL_UPI_GETTING_STARTED,
  aiPageLink: '/assisted-installer/clusters/~new?useArm=true',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  agentBasedPageLink: '/install/arm/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  providerSpecificFeatures: {
    abi: ['For air-gapped/restricted networks'],
    ipi: [
      'Hosts controlled with baseboard management controller (BMC)',
      'For air-gapped/restricted networks',
    ],
    upi: ['For air-gapped/restricted networks'],
  },
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal' },
  ],
};

export const ArmBareMetalABIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal Agent-based installer',
  providerTitle: instructionsMapping.baremetal.arm.abi.title,
  cloudProviderId: 'baremetal',
  installationTypeId: 'local-agent-based',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal', path: '/install/arm' },
    { label: 'Local Agent-based' },
  ],
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.arm.abi,
};

export const ArmBareMetalIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.baremetal.arm.ipi.title,
  cloudProviderId: 'baremetal',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal', path: '/install/arm' },
    { label: 'Installer-provisioned infrastructure' },
  ],
  instructionsMapping: instructionsMapping.baremetal.arm.ipi,
};

export const ArmBareMetalUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | ARM Bare Metal User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.baremetal.arm.upi.title,
  cloudProviderId: 'baremetal',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Bare Metal', path: '/install/arm' },
    { label: 'User-provisioned infrastructure' },
  ],
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.arm.upi,
};

export const ASHIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.ash.ipi.title,
  cloudProviderId: 'ash',
  customizations: instructionsMapping.ash.customizations,
  instructionsMapping: instructionsMapping.ash.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure Stack Hub', path: '/install/azure-stack-hub' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const ASHUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.ash.upi.title,
  cloudProviderId: 'ash',
  isUPI: true,
  instructionsMapping: instructionsMapping.ash.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure Stack Hub', path: '/install/azure-stack-hub' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const ArmPreReleaseProps = {
  appPageTitle: 'Install OpenShift 4 | ARM | Experimental Developer Preview Builds',
  providerTitle: 'Install OpenShift Container Platform 4 on ARM',
  installer: tools.ARMINSTALLER,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'ARM Pre-Release Builds' },
  ],
};

export const AWSIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.aws.x86.ipi.title,
  cloudProviderId: 'aws',
  customizations: instructionsMapping.aws.customizations,
  instructionsMapping: instructionsMapping.aws.x86.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services', path: '/install/aws' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const AWSUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.aws.x86.upi.title,
  cloudProviderId: 'aws',
  isUPI: true,
  instructionsMapping: instructionsMapping.aws.x86.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Amazon Web Services', path: '/install/aws' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const MultiAWSIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | AWS with Multi-Architecture Compute Machines',
  providerTitle: instructionsMapping.aws.multi.ipi.title,
  cloudProviderId: 'aws',
  instructionsMapping: instructionsMapping.aws.multi.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'AWS (multi-architecture)' },
  ],
};

export const MultiAzureIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure with Multi-Architecture Compute Machines',
  providerTitle: instructionsMapping.azure.multi.ipi.title,
  cloudProviderId: 'azure',
  instructionsMapping: instructionsMapping.azure.multi.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure (multi-architecture)' },
  ],
};

export const MultiBareMetalUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Baremetal with Multi-Architecture Compute Machines',
  providerTitle: instructionsMapping.baremetal.multi.upi.title,
  cloudProviderId: 'baremetal',
  showPreReleaseDocs: true,
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.multi.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Baremetal (multi-architecture)' },
  ],
};

export const MultiPreReleaseProps = {
  appPageTitle:
    'Install OpenShift 4 | Multi-architecture clusters | Experimental Developer Preview Builds',
  providerTitle: 'Install OpenShift with multi-architecture compute machines',
  installer: tools.MULTIINSTALLER,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    {
      label: 'Multi-architecture clusters' /* , path: '/install/multi/installer-provisioned' */,
    },
    { label: 'Pre-Release Builds' },
  ],
};

export const AzureProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure',
  providerTitle: 'Azure',
  ipiPageLink: '/install/azure/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_AZUREIPI_GETTING_STARTED,
  upiPageLink: '/install/azure/user-provisioned',
  upiLearnMoreLink: links.INSTALL_AZUREUPI_GETTING_STARTED,
  providerSpecificFeatures: {
    ipi: ['Hosts controlled with Azure Provider'],
  },
  name: 'azure',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure' },
  ],
};

export const AzureIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.azure.x86.ipi.title,
  cloudProviderId: 'azure',
  customizations: instructionsMapping.azure.customizations,
  instructionsMapping: instructionsMapping.azure.x86.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure', path: '/install/azure' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const AzureUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.azure.x86.upi.title,
  cloudProviderId: 'azure',
  isUPI: true,
  instructionsMapping: instructionsMapping.azure.x86.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure', path: '/install/azure' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const AzureStackHubProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Azure Stack Hub',
  providerTitle: 'Azure Stack Hub',
  ipiPageLink: '/install/azure-stack-hub/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_ASHIPI_GETTING_STARTED,
  upiPageLink: '/install/azure-stack-hub/user-provisioned',
  upiLearnMoreLink: links.INSTALL_ASHUPI_GETTING_STARTED,
  providerSpecificFeatures: {
    ipi: ['Hosts controlled with Azure Provider'],
  },
  name: 'azure-stack-hub',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Microsoft Azure Stack Hub' },
  ],
};

export const BareMetalABIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal Agent-based installer',
  providerTitle: instructionsMapping.baremetal.x86.abi.title,
  cloudProviderId: 'baremetal',
  installationTypeId: 'local-agent-based',
  instructionsMapping: instructionsMapping.baremetal.x86.abi,
  isUPI: true,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Bare Metal', path: '/install/metal' },
    { label: 'Local Agent-based' },
  ],
};

export const BareMetalIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.baremetal.x86.ipi.title,
  cloudProviderId: 'baremetal',
  instructionsMapping: instructionsMapping.baremetal.x86.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Bare Metal', path: '/install/metal' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const BareMetalUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.baremetal.x86.upi.title,
  cloudProviderId: 'baremetal',
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.x86.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Bare Metal', path: '/install/metal' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const BareMetalProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Bare Metal',
  providerTitle: 'Bare Metal',
  aiPageLink: '/assisted-installer/clusters/~new',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  ipiPageLink: '/install/metal/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_BAREMETAL_IPI_LEARN_MORE,
  upiPageLink: '/install/metal/user-provisioned',
  upiLearnMoreLink: links.INSTALL_BAREMETAL_UPI_GETTING_STARTED,
  agentBasedPageLink: '/install/metal/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  providerSpecificFeatures: {
    abi: ['For air-gapped/restricted networks'],
    ipi: [
      'Hosts controlled with baseboard management controller (BMC)',
      'For air-gapped/restricted networks',
    ],
    upi: ['For air-gapped/restricted networks'],
  },
  name: 'metal',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Bare Metal' },
  ],
};

export const GCPProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP',
  providerTitle: 'GCP',
  ipiPageLink: '/install/gcp/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_GCPIPI_LEARN_MORE,
  upiPageLink: '/install/gcp/user-provisioned',
  upiLearnMoreLink: links.INSTALL_GCPUPI_GETTING_STARTED,
  providerSpecificFeatures: {
    ipi: ['Hosts controlled with Google Cloud Provider'],
  },
  name: 'gcp',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Google Cloud Platform' },
  ],
};

export const GCPIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.gcp.ipi.title,
  cloudProviderId: 'gcp',
  instructionsMapping: instructionsMapping.gcp.ipi,
  customizations: instructionsMapping.gcp.customizations,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Google Cloud Platform', path: '/install/gcp' },
  ],
};

export const NutanixProps: InstructionChooserProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Nutanix AOS',
  providerTitle: 'Nutanix AOS',
  aiPageLink: '/assisted-installer/clusters/~new',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  ipiPageLink: '/install/nutanix/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_NUTANIXIPI_GETTING_STARTED,
  upiPageLink: '',
  agentBasedPageLink: '',
  hideUPI: true,
  recommend: 'ipi',
  providerSpecificFeatures: {
    ipi: [
      'Hosts controlled with Nutanix AOS Cloud Provider',
      'For connected or air-gapped/restricted networks',
    ],
  },
  name: 'nutanix',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Nutanix AOS' },
  ],
};

export const NutanixIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | Nutanix AOS Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.nutanix.ipi.title,
  cloudProviderId: 'nutanix',
  instructionsMapping: instructionsMapping.nutanix.ipi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Nutanix AOS', path: '/install/nutanix' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

export const GCPUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | GCP User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.gcp.upi.title,
  cloudProviderId: 'gcp',
  isUPI: true,
  instructionsMapping: instructionsMapping.gcp.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Google Cloud Platform', path: '/install/gcp' },
  ],
};

export const OpenStackProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | OpenStack',
  providerTitle: 'OpenStack',
  ipiPageLink: '/install/openstack/installer-provisioned',
  ipiLearnMoreLink: links.INSTALL_OSPIPI_GETTING_STARTED,
  upiPageLink: '/install/openstack/user-provisioned',
  upiLearnMoreLink: links.INSTALL_OSPUPI_GETTING_STARTED,
  providerSpecificFeatures: {
    ipi: ['Hosts controlled with OpenStack Provider'],
  },
  name: 'openstack',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Red Hat OpenStack Platform' },
  ],
};

export const OpenStackUPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | OpenStack User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.openstack.upi.title,
  cloudProviderId: 'openstack',
  isUPI: true,
  instructionsMapping: instructionsMapping.openstack.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Red Hat OpenStack Platform', path: '/install/openstack' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const IBMCloudProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Cloud',
  providerTitle: instructionsMapping.ibmCloud.title,
  cloudProviderId: 'ibmCloud',
  instructionsMapping: instructionsMapping.ibmCloud,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Cloud' },
  ],
};

export const IBMZProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Z (s390x)',
  providerTitle: 'IBM Z (s390x)',
  aiPageLink: '/assisted-installer/clusters/~new',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  upiPageLink: '/install/ibmz/user-provisioned',
  upiLearnMoreLink: links.INSTALL_IBMZ_UPI_GETTING_STARTED,
  agentBasedPageLink: '/install/ibmz/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  hideIPI: true,
  providerSpecificFeatures: {
    abi: ['For connected or air-gapped/restricted networks'],
    ipi: [
      'Hosts controlled with Ibmz Cloud Provider',
      'For connected or air-gapped/restricted networks',
    ],
    upi: ['For connected or air-gapped/restricted networks'],
  },
  name: 'Ibmz',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z (s390x)' },
  ],
};

export const IBMZABIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Z (s390x) Agent-based installer',
  providerTitle: instructionsMapping.baremetal.s390x.abi.title,
  cloudProviderId: 'baremetal',
  instructionsMapping: instructionsMapping.baremetal.s390x.abi,
  installationTypeId: 'local-agent-based',
  customizations: instructionsMapping.baremetal.s390x.customizations,
  isUPI: true,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z (s390x)', path: '/install/ibmz' },
    { label: 'Local Agent-based' },
  ],
};

export const IBMZUPIProps = {
  appPageTitle: 'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | IBM Z (s390x)',
  providerTitle: instructionsMapping.baremetal.s390x.upi.title,
  cloudProviderId: 'baremetal',
  isUPI: true,
  instructionsMapping: instructionsMapping.baremetal.s390x.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z (s390x)', path: '/install/ibmz' },
    { label: 'User-provisioned infrastructure' },
  ],
};

export const IBMZPreReleaseProps = {
  appPageTitle: 'Install OpenShift 4 | IBM Z | Experimental Developer Preview Builds',
  providerTitle: 'Install OpenShift on IBM Z with user-provisioned infrastructure',
  installer: tools.IBMZINSTALLER,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'IBM Z', path: '/install/ibmz/user-provisioned' },
    { label: 'Pre-Release Builds' },
  ],
};

export const OpenStackIPIProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | OpenStack Installer-Provisioned Infrastructure',
  providerTitle: instructionsMapping.openstack.ipi.title,
  cloudProviderId: 'openstack',
  instructionsMapping: instructionsMapping.openstack.ipi,
  customizations: instructionsMapping.openstack.customizations,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Red Hat OpenStack Platform', path: '/install/openstack' },
    { label: 'Installer-provisioned infrastructure' },
  ],
};

const nonTestedPlatformsLink = (
  <>
    For&nbsp;
    <ExternalLink href={links.INSTALL_GENERIC_NON_TESTED_PLATFORMS} stopClickPropagation>
      non-tested platforms
    </ExternalLink>
  </>
);

export const PlatformAgnosticProps = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | x86_64 User-Provisioned Infrastructure',
  providerTitle: 'Platform agnostic (x86_64)',
  aiPageLink: '/assisted-installer/clusters/~new',
  aiLearnMoreLink: links.INSTALL_ASSISTED_LEARN_MORE,
  hideIPI: true,
  upiPageLink: '/install/platform-agnostic/user-provisioned',
  upiLearnMoreLink: links.INSTALL_GENERIC_GETTING_STARTED,
  agentBasedPageLink: '/install/platform-agnostic/agent-based',
  agentBasedLearnMoreLink: links.INSTALL_AGENT_LEARN_MORE,
  providerSpecificFeatures: {
    abi: [nonTestedPlatformsLink, 'For air-gapped/restricted networks'],
    ai: [nonTestedPlatformsLink],
    upi: [nonTestedPlatformsLink],
  },
  name: 'platform-agnostic',
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Platform agnostic (x86_64)' },
  ],
};

export const PlatformAgnosticUPI = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | x86_64 User-Provisioned Infrastructure',
  providerTitle: instructionsMapping.generic.upi.title,
  cloudProviderId: 'generic',
  isUPI: true,
  instructionsMapping: instructionsMapping.generic.upi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Platform agnostic (x86_64)', path: '/install/platform-agnostic' },
    { label: 'x86_64 User-provisioned infrastructure' },
  ],
};

export const PlatformAgnosticABI = {
  appPageTitle:
    'Install OpenShift 4 | Red Hat OpenShift Cluster Manager | x86_64 Agent-based installer',
  providerTitle: instructionsMapping.generic.abi.title,
  cloudProviderId: 'generic',
  installationTypeId: 'local-agent-based',
  isUPI: true,
  instructionsMapping: instructionsMapping.generic.abi,
  breadCrumbsPaths: [
    { label: 'Cluster List' },
    { label: 'Cluster Type', path: '/create' },
    { label: 'Platform agnostic (x86_64)', path: '/install/platform-agnostic' },
    { label: 'Local Agent-based' },
  ],
};
