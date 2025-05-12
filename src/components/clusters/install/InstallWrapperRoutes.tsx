import React from 'react';

import { Routes } from './models/types';
import { InstallComponentWrapper } from './InstallWrapper';
import {
  AlibabaProps,
  ArmAWSIPIProps,
  ArmAwsProps,
  ArmAWSUPIProps,
  ArmAzureIPIProps,
  ArmBareMetalABIProps,
  ArmBareMetalIPIProps,
  ArmBareMetalProps,
  ArmBareMetalUPIProps,
  ArmPreReleaseProps,
  ASHIPIProps,
  ASHUPIProps,
  AWSIPIProps,
  AWSUPIProps,
  AzureIPIProps,
  AzureProps,
  AzureStackHubProps,
  AzureUPIProps,
  BareMetalABIProps,
  BareMetalIPIProps,
  BareMetalProps,
  BareMetalUPIProps,
  GCPIPIProps,
  GCPProps,
  GCPUPIProps,
  IBMCloudProps,
  IBMZABIProps,
  IBMZPreReleaseProps,
  IBMZProps,
  IBMZUPIProps,
  MultiAWSIPIProps,
  MultiAzureIPIProps,
  MultiBareMetalUPIProps,
  MultiPreReleaseProps,
  NutanixIPIProps,
  NutanixProps,
  OpenStackIPIProps,
  OpenStackProps,
  OpenStackUPIProps,
  PlatformAgnosticABI,
  PlatformAgnosticProps,
  PlatformAgnosticUPI,
} from './InstallWrapperPropsData';

// Example of generic install component usage
export const routesData: Routes[] = [
  {
    path: '/install/alibaba',
    element: (
      <InstallComponentWrapper propsData={AlibabaProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/aws/arm',
    element: (
      <InstallComponentWrapper propsData={ArmAwsProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/aws/arm/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={ArmAWSIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/arm/pre-release',
    element: (
      <InstallComponentWrapper
        propsData={ArmPreReleaseProps}
        componentChooser="releaseInstructions"
      />
    ),
  },
  {
    path: '/install/azure-stack-hub/installer-provisioned',
    element: <InstallComponentWrapper propsData={ASHIPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/azure-stack-hub/user-provisioned',
    element: <InstallComponentWrapper propsData={ASHUPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/aws/installer-provisioned',
    element: <InstallComponentWrapper propsData={AWSIPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/aws/user-provisioned',
    element: <InstallComponentWrapper propsData={AWSUPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/aws/arm/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={ArmAWSUPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/azure/arm/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={ArmAzureIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/arm',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalProps}
        componentChooser="instructionsChooser"
      />
    ),
  },
  {
    path: '/install/arm/agent-based',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalABIProps}
        componentChooser="ocpInstructions"
      />
    ),
  },
  {
    path: '/install/arm/installer-provisioned',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalIPIProps}
        componentChooser="ocpInstructions"
      />
    ),
  },
  {
    path: '/install/arm/user-provisioned',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalUPIProps}
        componentChooser="ocpInstructions"
      />
    ),
  },
  {
    path: '/install/aws/multi/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={MultiAWSIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/azure/multi/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={MultiAzureIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/metal/multi',
    element: (
      <InstallComponentWrapper
        propsData={MultiBareMetalUPIProps}
        componentChooser="ocpInstructions"
      />
    ),
  },
  {
    path: '/install/multi/pre-release',
    element: (
      <InstallComponentWrapper
        propsData={MultiPreReleaseProps}
        componentChooser="releaseInstructions"
      />
    ),
  },
  {
    path: '/install/gcp',
    element: (
      <InstallComponentWrapper propsData={GCPProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/gcp/installer-provisioned',
    element: <InstallComponentWrapper propsData={GCPIPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/gcp/user-provisioned',
    element: <InstallComponentWrapper propsData={GCPUPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/ibm-cloud',
    element: (
      <InstallComponentWrapper propsData={IBMCloudProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/ibmz',
    element: (
      <InstallComponentWrapper propsData={IBMZProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/ibmz/agent-based',
    element: (
      <InstallComponentWrapper propsData={IBMZABIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/ibmz/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={IBMZUPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/ibmz/pre-release',
    element: (
      <InstallComponentWrapper
        propsData={IBMZPreReleaseProps}
        componentChooser="releaseInstructions"
      />
    ),
  },
  {
    path: '/install/nutanix',
    element: (
      <InstallComponentWrapper propsData={NutanixProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/nutanix/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={NutanixIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/openstack',
    element: (
      <InstallComponentWrapper propsData={OpenStackProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/openstack/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={OpenStackUPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/openstack/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={OpenStackIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/platform-agnostic',
    element: (
      <InstallComponentWrapper
        propsData={PlatformAgnosticProps}
        componentChooser="instructionsChooser"
      />
    ),
  },
  {
    path: '/install/platform-agnostic/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={PlatformAgnosticUPI} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/platform-agnostic/agent-based',
    element: (
      <InstallComponentWrapper propsData={PlatformAgnosticABI} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/azure',
    element: (
      <InstallComponentWrapper propsData={AzureProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/azure/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={AzureIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/azure/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={AzureUPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/azure-stack-hub',
    element: (
      <InstallComponentWrapper
        propsData={AzureStackHubProps}
        componentChooser="instructionsChooser"
      />
    ),
  },
  {
    path: '/install/metal/agent-based',
    element: (
      <InstallComponentWrapper propsData={BareMetalABIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/metal/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={BareMetalIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/metal/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={BareMetalUPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/metal',
    element: (
      <InstallComponentWrapper propsData={BareMetalProps} componentChooser="instructionsChooser" />
    ),
  },
];
