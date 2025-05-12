import React from 'react';

import { LearnMoreOSDCard } from '../common/LearnMoreOSDCard';
import { TryRosaCard } from '../common/TryRosaCard';

export interface GetStartedSection {
  title: string;
  bodyContent: string;
  linkComponentURL: string;
  learnMore: React.JSX.Element;
  createClusterBtnTitle: string;
}

export const osdGetStartedSectionData: GetStartedSection = {
  title: 'Create an OpenShift Dedicated cluster',
  bodyContent:
    'Focus on what matters. We’ll manage and maintain the cluster hosted on Google Cloud for you.',
  linkComponentURL: '/create/osd',
  createClusterBtnTitle: 'Create cluster',
  learnMore: <LearnMoreOSDCard />,
};

export const rosaGetStartedSectionData: GetStartedSection = {
  title: 'Create a ROSA cluster',
  bodyContent:
    "Get back to focusing on your application when you build a ROSA cluster. We'll manage and maintain the cluster for you.",
  linkComponentURL: '/create/rosa/getstarted',
  createClusterBtnTitle: 'Begin setup',
  learnMore: <TryRosaCard />,
};
