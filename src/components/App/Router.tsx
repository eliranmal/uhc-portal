/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useEffect } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { Navigate, ocmBaseName } from '~/common/routing';
import ClusterDetailsClusterOrExternalIdMR from '~/components/clusters/ClusterDetailsMultiRegion/ClusterDetailsClusterOrExternalId';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/queries/featureGates/featureConstants';
import { useFeatureGate } from '~/queries/featureGates/useFetchFeatureGate';
import { isRestrictedEnv } from '~/restrictedEnv';
import apiRequest from '~/services/apiRequest';

import { normalizedProducts } from '../../common/subscriptionTypes';
import AIRootApp from '../AIComponents/AIRootApp';
import CLILoginPage from '../CLILoginPage/CLILoginPage';
import ArchivedClusterListMultiRegion from '../clusters/ArchivedClusterListMultiRegion';
import ClusterDetailsSubscriptionIdMultiRegion from '../clusters/ClusterDetailsMultiRegion/ClusterDetailsSubscriptionIdMultiRegion';
import AccessRequestNavigate from '../clusters/ClusterDetailsMultiRegion/components/AccessRequest/components/AccessRequestNavigate';
import IdentityProviderPageMultiregion from '../clusters/ClusterDetailsMultiRegion/components/IdentityProvidersPage/index';
import ClusterListMultiRegion from '../clusters/ClusterListMultiRegion';
import CreateClusterPage from '../clusters/CreateClusterPage';
import GovCloudPage from '../clusters/GovCloud/GovCloudPage';
import InsightsAdvisorRedirector from '../clusters/InsightsAdvisorRedirector';
import ConnectedInstallArmPreRelease from '../clusters/install/InstallArmPreRelease';
import InstallASH from '../clusters/install/InstallASH';
import ConnectedInstallASHIPI from '../clusters/install/InstallASHIPI';
import ConnectedInstallASHUPI from '../clusters/install/InstallASHUPI';
import InstallAWS from '../clusters/install/InstallAWS';
import ConnectedInstallAWSIPI from '../clusters/install/InstallAWSIPI';
import ConnectedInstallAWSUPI from '../clusters/install/InstallAWSUPI';
import InstallAzure from '../clusters/install/InstallAzure';
import ConnectedInstallAzureIPI from '../clusters/install/InstallAzureIPI';
import ConnectedInstallAzureUPI from '../clusters/install/InstallAzureUPI';
import InstallBareMetal from '../clusters/install/InstallBareMetal';
import InstallBMABI from '../clusters/install/InstallBareMetalABI';
import InstallBMIPI from '../clusters/install/InstallBareMetalIPI';
import InstallBMUPI from '../clusters/install/InstallBareMetalUPI';
import InstallGCP from '../clusters/install/InstallGCP';
import ConnectedInstallGCPIPI from '../clusters/install/InstallGCPIPI';
import ConnectedInstallGCPUPI from '../clusters/install/InstallGCPUPI';
import ConnectedInstallIBMCloud from '../clusters/install/InstallIBMCloud';
import InstallIBMZ from '../clusters/install/InstallIBMZ';
import ConnectedInstallIBMZABI from '../clusters/install/InstallIBMZABI';
import ConnectedInstallIBMZPreRelease from '../clusters/install/InstallIBMZPreRelease';
import ConnectedInstallIBMZUPI from '../clusters/install/InstallIBMZUPI';
import ConnectedInstallMultiAWSIPI from '../clusters/install/InstallMultiAWSIPI';
import ConnectedInstallMultiAzureIPI from '../clusters/install/InstallMultiAzureIPI';
import InstallMultiBMUPI from '../clusters/install/InstallMultiBareMetalUPI';
import ConnectedInstallMultiPreRelease from '../clusters/install/InstallMultiPreRelease';
import InstallNutanix from '../clusters/install/InstallNutanix';
import ConnectedInstallNutanixIPI from '../clusters/install/InstallNutanixIPI';
import InstallOracleCloud from '../clusters/install/InstallOracleCloud';
import InstallOSP from '../clusters/install/InstallOSP';
import ConnectedInstallOSPIPI from '../clusters/install/InstallOSPIPI';
import ConnectedInstallOSPUPI from '../clusters/install/InstallOSPUPI';
import InstallPlatformAgnostic from '../clusters/install/InstallPlatformAgnostic';
import ConnectedInstallPlatformAgnosticABI from '../clusters/install/InstallPlatformAgnosticABI';
import ConnectedInstallPlatformAgnosticUPI from '../clusters/install/InstallPlatformAgnosticUPI';
import InstallPower from '../clusters/install/InstallPower';
import ConnectedInstallPowerABI from '../clusters/install/InstallPowerABI';
import ConnectedInstallPowerPreRelease from '../clusters/install/InstallPowerPreRelease';
import ConnectedInstallPowerUPI from '../clusters/install/InstallPowerUPI';
import InstallPowerVSIPI from '../clusters/install/InstallPowerVirtualServerIPI';
import ConnectedInstallPreRelease from '../clusters/install/InstallPreRelease';
import ConnectedInstallPullSecret from '../clusters/install/InstallPullSecret';
import ConnectedInstallPullSecretAzure from '../clusters/install/InstallPullSecretAzure';
import InstallVSphere from '../clusters/install/InstallVSphere';
import ConnectedInstallVSphereABI from '../clusters/install/InstallVSphereABI';
import ConnectedInstallVSphereIPI from '../clusters/install/InstallVSphereIPI';
import ConnectedInstallVSphereUPI from '../clusters/install/InstallVSphereUPI';
import { InstallRouteMap } from '../clusters/install/InstallWrapper';
import { routesData } from '../clusters/install/InstallWrapperRoutes';
import RegisterCluster from '../clusters/RegisterCluster';
import { CreateOsdWizard } from '../clusters/wizards/osd';
import CreateROSAWizard from '../clusters/wizards/rosa';
import GetStartedWithROSA from '../clusters/wizards/rosa/CreateRosaGetStarted';
import EntitlementConfig from '../common/EntitlementConfig/index';
import TermsGuard from '../common/TermsGuard';
import Dashboard from '../dashboard';
import DownloadsPage from '../downloads/DownloadsPage';
import Overview from '../overview';
import Quota from '../quota';
import Releases from '../releases';
import RosaHandsOnPage from '../RosaHandsOn/RosaHandsOnPage';
import { ServicePage } from '../services/servicePage/ServicePage';

import ApiError from './ApiError';
import { AppPage } from './AppPage';
import NotFoundError from './NotFoundError';
import { is404, metadataByRoute } from './routeMetadata';

interface RouterProps {
  planType: string;
  clusterId: string;
  externalClusterId: string;
}

const Router: React.FC<RouterProps> = ({ planType, clusterId, externalClusterId }) => {
  const { pathname, search } = useLocation();

  const {
    segment: { setPageMetadata },
  } = useChrome();

  const isHypershiftWizardEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);

  // For testing purposes, show which major features are enabled/disabled
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.info(
      '---------------Features---------------\n',
      `HYPERSHIFT_WIZARD_FEATURE: ${isHypershiftWizardEnabled ? 'Enabled' : 'Disabled'}\n`,
      '-------------------------------------',
    );
  }, [isHypershiftWizardEnabled]);

  useEffect(() => {
    setPageMetadata({
      ...metadataByRoute(pathname.replace(ocmBaseName, ''), planType, clusterId, externalClusterId),
      ...(is404() ? { title: '404 Not Found' } : {}),
    });
  }, [pathname, planType, clusterId, externalClusterId, setPageMetadata]);

  return (
    <ApiError apiRequest={apiRequest}>
      <Routes>
        {/*
              IMPORTANT!
              When adding new routes, make sure to add the route both here and in Router.test.jsx,
              to ensure the route is tested.
            */}
        <Route
          path="/install/osp/installer-provisioned"
          element={<Navigate replace to="/install/openstack/installer-provisioned" />}
        />
        <Route
          path="/install/crc/installer-provisioned"
          element={<Navigate replace to="/create/local" />}
        />
        <Route path="/token/moa" element={<Navigate replace to="/token/rosa" />} />
        <Route path="/insights" element={<Navigate replace to="/dashboard" />} />
        <Route path="/subscriptions" element={<Navigate replace to="/quota" />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        {/* Each token page has 2 routes with distinct paths, to remember that user wanted
                to see it during page reload that may be needed for elevated auth. */}
        <Route
          path="/token/rosa/show"
          element={
            <TermsGuard gobackPath="/">
              <AppPage>
                <CLILoginPage showToken isRosa />
                <EntitlementConfig />
              </AppPage>
            </TermsGuard>
          }
        />
        <Route
          path="/token/rosa"
          element={
            <TermsGuard gobackPath="/">
              <AppPage>
                <CLILoginPage showToken={false} showPath="/token/rosa/show" isRosa />
                <EntitlementConfig />
              </AppPage>
            </TermsGuard>
          }
        />
        {InstallRouteMap(routesData)}
        <Route path="/token/show" element={<CLILoginPage showToken />} />
        <Route path="/token" element={<CLILoginPage showToken={false} showPath="/token/show" />} />
        <Route path="/install/arm/pre-release" element={<ConnectedInstallArmPreRelease />} />
        <Route path="/install/aws/installer-provisioned" element={<ConnectedInstallAWSIPI />} />
        <Route path="/install/aws/user-provisioned" element={<ConnectedInstallAWSUPI />} />
        <Route
          path="/install/aws/multi/installer-provisioned"
          element={<ConnectedInstallMultiAWSIPI />}
        />
        <Route path="/install/aws" element={<InstallAWS />} />
        <Route path="/install/gcp/installer-provisioned" element={<ConnectedInstallGCPIPI />} />
        <Route path="/install/gcp/user-provisioned" element={<ConnectedInstallGCPUPI />} />
        <Route path="/install/gcp" element={<InstallGCP />} />
        <Route path="/install/nutanix" element={<InstallNutanix />} />
        <Route
          path="/install/nutanix/installer-provisioned"
          element={<ConnectedInstallNutanixIPI />}
        />
        <Route
          path="/install/openstack/installer-provisioned"
          element={<ConnectedInstallOSPIPI />}
        />
        <Route path="/install/openstack/user-provisioned" element={<ConnectedInstallOSPUPI />} />
        <Route path="/install/openstack" element={<InstallOSP />} />
        <Route
          path="/install/azure/multi/installer-provisioned"
          element={<ConnectedInstallMultiAzureIPI />}
        />
        <Route path="/install/azure/installer-provisioned" element={<ConnectedInstallAzureIPI />} />
        <Route path="/install/azure/user-provisioned" element={<ConnectedInstallAzureUPI />} />
        <Route path="/install/azure" element={<InstallAzure />} />
        <Route
          path="/install/azure-stack-hub/installer-provisioned"
          element={<ConnectedInstallASHIPI />}
        />
        <Route
          path="/install/azure-stack-hub/user-provisioned"
          element={<ConnectedInstallASHUPI />}
        />
        <Route path="/install/azure-stack-hub" element={<InstallASH />} />
        <Route path="/install/metal/user-provisioned" element={<InstallBMUPI />} />
        <Route path="/install/metal/installer-provisioned" element={<InstallBMIPI />} />
        <Route path="/install/metal/agent-based" element={<InstallBMABI />} />
        <Route path="/install/metal/multi" element={<InstallMultiBMUPI />} />
        <Route path="/install/metal" element={<InstallBareMetal />} />
        <Route path="/install/multi/pre-release" element={<ConnectedInstallMultiPreRelease />} />
        <Route path="/install/vsphere" element={<InstallVSphere />} />
        <Route path="/install/vsphere/agent-based" element={<ConnectedInstallVSphereABI />} />
        <Route path="/install/vsphere/user-provisioned" element={<ConnectedInstallVSphereUPI />} />
        <Route
          path="/install/vsphere/installer-provisioned"
          element={<ConnectedInstallVSphereIPI />}
        />
        <Route path="/install/ibm-cloud" element={<ConnectedInstallIBMCloud />} />
        <Route path="/install/ibmz/user-provisioned" element={<ConnectedInstallIBMZUPI />} />
        <Route path="/install/ibmz/pre-release" element={<ConnectedInstallIBMZPreRelease />} />
        <Route path="/install/ibmz/agent-based" element={<ConnectedInstallIBMZABI />} />
        <Route path="/install/ibmz" element={<InstallIBMZ />} />
        <Route path="/install/power/user-provisioned" element={<ConnectedInstallPowerUPI />} />
        <Route path="/install/power/pre-release" element={<ConnectedInstallPowerPreRelease />} />
        <Route path="/install/power/agent-based" element={<ConnectedInstallPowerABI />} />
        <Route path="/install/power" element={<InstallPower />} />
        <Route path="/install/powervs/installer-provisioned" element={<InstallPowerVSIPI />} />
        <Route
          path="/install/platform-agnostic/agent-based"
          element={<ConnectedInstallPlatformAgnosticABI />}
        />
        <Route
          path="/install/platform-agnostic/user-provisioned"
          element={<ConnectedInstallPlatformAgnosticUPI />}
        />
        <Route path="/install/platform-agnostic" element={<InstallPlatformAgnostic />} />
        <Route path="/install/pre-release" element={<ConnectedInstallPreRelease />} />
        <Route path="/install/pull-secret" element={<ConnectedInstallPullSecret />} />
        <Route
          path="/install/azure/aro-provisioned"
          element={<ConnectedInstallPullSecretAzure />}
        />
        <Route path="/install/oracle-cloud" element={<InstallOracleCloud />} />
        <Route path="/install" element={<Navigate replace to="/create" />} />
        <Route path="/create/osd/aws" element={<Navigate replace to="/create/osd" />} />
        <Route path="/create/osd/gcp" element={<Navigate replace to="/create/osd" />} />
        <Route path="/create/osdtrial/aws" element={<Navigate replace to="/create/osdtrial" />} />
        <Route path="/create/osdtrial/gcp" element={<Navigate replace to="/create/osdtrial" />} />
        <Route
          path="/create/osdtrial"
          element={
            <TermsGuard gobackPath="/create">
              <CreateOsdWizard product={normalizedProducts.OSDTrial} />
            </TermsGuard>
          }
        />
        <Route
          path="/create/osd"
          element={
            <TermsGuard gobackPath="/create">
              <CreateOsdWizard />
            </TermsGuard>
          }
        />
        <Route path="/create/cloud" element={<CreateClusterPage activeTab="cloud" />} />
        <Route path="/create/datacenter" element={<CreateClusterPage activeTab="datacenter" />} />
        <Route path="/create/local" element={<CreateClusterPage activeTab="local" />} />
        <Route
          path="/create/rosa/welcome"
          element={<Navigate replace to="/create/rosa/getstarted" />}
        />
        <Route
          path="/create/rosa/getstarted"
          element={
            <TermsGuard gobackPath="/create">
              <GetStartedWithROSA />
            </TermsGuard>
          }
        />
        <Route path="/create/rosa/govcloud" element={<GovCloudPage />} />
        <Route
          path="/create/rosa/wizard"
          element={
            <TermsGuard gobackPath="/create">
              <CreateROSAWizard />
            </TermsGuard>
          }
        />
        <Route path="/create/rosa/wizard" element={<CreateROSAWizard />} />
        <Route path="/create" element={<CreateClusterPage activeTab="" />} />
        <Route
          path="/details/s/:id/insights/:reportId/:errorKey"
          element={<InsightsAdvisorRedirector />}
        />
        <Route
          path="/details/s/:id/add-idp/:idpTypeName"
          element={<IdentityProviderPageMultiregion />}
        />
        <Route
          path="/details/s/:id/edit-idp/:idpName"
          element={<IdentityProviderPageMultiregion isEditForm />}
        />
        {/* WARNING! The "/details/s/:id" route is used by catchpoint tests which determine
        'Operational' or 'Major Outage' status for "OpenShift Cluster Manager" on the
        'http:///status.redhat.com' site. If this route is changed, then the related catchpoint
        tests must be updated. For more info. see: https://issues.redhat.com/browse/OCMUI-2398 */}
        <Route path="/details/s/:id" element={<ClusterDetailsSubscriptionIdMultiRegion />} />
        <Route
          path="/details/:id/insights/:reportId/:errorKey"
          element={<InsightsAdvisorRedirector />}
        />
        <Route path="/details/:id" element={<ClusterDetailsClusterOrExternalIdMR />} />
        <Route path="/register" element={<RegisterCluster />} />
        <Route path="/quota/resource-limits" element={<Quota marketplace />} />
        <Route path="/quota" element={<Quota />} />
        <Route path="/archived" element={<ArchivedClusterListMultiRegion getMultiRegion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview/rosa/hands-on" element={<RosaHandsOnPage />} />
        <Route path="/overview/rosa" element={<ServicePage serviceName="ROSA" />} />
        <Route path="/overview/osd" element={<ServicePage serviceName="OSD" />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/releases" element={<Releases />} />
        <Route path="/assisted-installer/*" element={<AIRootApp />} />
        {/* TODO: remove these redirects once links from trials and demo system emails are updated */}
        <Route
          path="/services/rosa/demo"
          element={<Navigate replace to={`/overview/rosa/hands-on/${search}`} />}
        />
        <Route
          path="/services/rosa"
          element={<Navigate replace to={`/overview/rosa${search}`} />}
        />
        <Route
          path="/access-request/:id"
          element={!isRestrictedEnv() ? <AccessRequestNavigate /> : <NotFoundError />}
        />
        {/* WARNING! The "/cluster-list" route is used by catchpoint tests which determine
        'Operational' or 'Major Outage' status for "OpenShift Cluster Manager" on the
        'http:///status.redhat.com' site. If this route is changed, then the related catchpoint
        tests must be updated. For more info. see: https://issues.redhat.com/browse/OCMUI-2398 */}
        <Route path="/cluster-list" element={<ClusterListMultiRegion getMultiRegion />} />
        <Route
          path="/"
          element={<Navigate replace to={isRestrictedEnv() ? '/cluster-list' : '/overview'} />}
        />
        {/* catch all */}
        <Route path="*" element={<NotFoundError />} />
      </Routes>
    </ApiError>
  );
};

type RouterState = {
  clusters: any;
};
const mapStateToProps = (state: RouterState) => {
  const { cluster } = state.clusters.details;
  return {
    planType: get(cluster, 'subscription.plan.type', normalizedProducts.UNKNOWN),
    clusterId: get(cluster, 'subscription.cluster_id'),
    externalClusterId: get(cluster, 'subscription.external_cluster_id'),
  };
};

export default connect(mapStateToProps)(Router);
