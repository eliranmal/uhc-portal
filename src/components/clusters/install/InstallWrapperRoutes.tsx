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
} from './InstallWrapperPropsData';

// Example of generic install component usage
export const routesData: Routes[] = [
  {
    path: '/install/alibaba',
    element: <InstallComponentWrapper instructionChooserProps={AlibabaProps} instructionChooser />,
  },
  {
    path: '/install/aws/arm',
    element: <InstallComponentWrapper instructionChooserProps={ArmAwsProps} instructionChooser />,
  },
  {
    path: '/install/aws/arm/installer-provisioned',
    element: <InstallComponentWrapper ocpInstructionProps={ArmAWSIPIProps} />,
  },
  {
    path: '/install/aws/arm/user-provisioned',
    element: <InstallComponentWrapper ocpInstructionProps={ArmAWSUPIProps} />,
  },
  {
    path: '/install/azure/arm/installer-provisioned',
    element: <InstallComponentWrapper ocpInstructionProps={ArmAzureIPIProps} />,
  },
  {
    path: '/install/arm',
    element: (
      <InstallComponentWrapper instructionChooserProps={ArmBareMetalProps} instructionChooser />
    ),
  },
  {
    path: '/install/arm/agent-based',
    element: <InstallComponentWrapper ocpInstructionProps={ArmBareMetalABIProps} />,
  },
  {
    path: '/install/arm/installer-provisioned',
    element: <InstallComponentWrapper ocpInstructionProps={ArmBareMetalIPIProps} />,
  },
  {
    path: '/install/arm/user-provisioned',
    element: <InstallComponentWrapper ocpInstructionProps={ArmBareMetalUPIProps} />,
  },
];
