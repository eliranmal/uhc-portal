import React, { ReactNode } from 'react';

import { BreadcrumbPath } from '~/components/common/Breadcrumbs';

export type ProviderSpecificType = {
  abi?: string[] | ReactNode[];
  ai?: string[] | ReactNode[];
  upi?: string[] | ReactNode[];
  ipi?: string[] | ReactNode[];
};

export type InstallCommonType = {
  appPageTitle: string;
  providerTitle: string;
  breadCrumbsPaths: BreadcrumbPath[];
};

export type InstructionChooserProps = InstallCommonType & {
  name: string;
  aiPageLink?: string;
  aiLearnMoreLink?: string;
  hideIPI?: boolean;
  ipiPageLink?: string;
  ipiLearnMoreLink?: string;
  hideUPI?: boolean;
  upiPageLink?: string;
  upiLearnMoreLink?: string;
  agentBasedPageLink?: string;
  agentBasedLearnMoreLink?: string;
  providerSpecificFeatures: ProviderSpecificType;
  recommend?: 'ai' | 'ipi';
};

export type OCPInstructionProps = InstallCommonType & {
  customizations?: string;
  cloudProviderId: string;
  instructionsMapping: any;
  isUPI?: boolean;
  installationTypeId?: string;
  showPreReleaseDocs?: boolean;
};

export type ReleaseInstructionsProps = InstallCommonType & {
  installer: string;
};

export type InstallComponentProps =
  | { componentChooser: 'instructionsChooser'; propsData: InstructionChooserProps }
  | { componentChooser: 'ocpInstructions'; propsData: OCPInstructionProps }
  | { componentChooser: 'releaseInstructions'; propsData: ReleaseInstructionsProps };

export type Routes = {
  path: string;
  element: React.JSX.Element;
};
