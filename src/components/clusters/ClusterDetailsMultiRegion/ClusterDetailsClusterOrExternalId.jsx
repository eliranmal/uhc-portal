import React from 'react';
import { useLocation } from 'react-router-dom';

import ClusterDetailsRedirector from '~/components/clusters/ClusterDetailsRedirectorMultiRegion';

import InsightsAdvisorRedirector from '../InsightsAdvisorRedirector';

const ClusterDetailsClusterOrExternalId = (props) => {
  const location = useLocation();

  /* This guarantees that the old links to OCM will redirect to OCP Advisor
       instead of the deprecated Insights Advisor tab */
  if (location.hash === '#insights') {
    // Redirect to OCP Advisor (OpenShift Insights)
    return <InsightsAdvisorRedirector {...props} />;
  }

  return <ClusterDetailsRedirector {...props} />;
};

export default ClusterDetailsClusterOrExternalId;
