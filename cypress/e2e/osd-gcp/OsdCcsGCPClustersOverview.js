import 'cypress-each';
import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';
const clusterDetails = require('../../fixtures/osd-gcp/OsdCcsGCPClusterCreate.json');
const clusterProfiles = [
  'osd-ccs-gcp-public-singlezone-serviceaccount',
  'osd-ccs-gcp-public-multizone-serviceaccount',
  'osd-ccs-gcp-private-multizone-serviceaccount',
  'osd-ccs-gcp-public-multizone-wif',
  'osd-ccs-gcp-private-multizone-wif',
];

describe(
  'OSD CCS GCP - Overview tab properties',
  { tags: ['day2', 'osd', 'ccs', 'gcp', 'overview'] },
  () => {
    describe.each(clusterProfiles)(
      'OSD CCS GCP - Overview tab properties for the profile :  %s',
      (clusterProfile) => {
        let clusterProperties = clusterDetails[clusterProfile]['day1-profile'];
        let clusterName = clusterDetails[clusterProfile]['day1-profile'].ClusterName;

        before(() => {
          cy.visit('/cluster-list');
          ClusterListPage.waitForDataReady();
        });

        it(`Open ${clusterName} cluster`, () => {
          ClusterListPage.filterTxtField().should('be.visible').click();
          ClusterListPage.filterTxtField().clear().type(clusterName);
          ClusterListPage.waitForDataReady();
          ClusterListPage.openClusterDefinition(clusterName);
        });

        it(`Checks on overview tab : ${clusterName} cluster`, () => {
          ClusterDetailsPage.waitForInstallerScreenToLoad();
          ClusterDetailsPage.clusterNameTitle().contains(clusterName);
          ClusterDetailsPage.clusterTypeLabelValue()
            .scrollIntoView()
            .contains(clusterProperties.Type);
          if (clusterProperties.hasOwnProperty('DomainPrefix')) {
            ClusterDetailsPage.clusterDomainPrefixLabelValue()
              .scrollIntoView()
              .contains(clusterProperties.DomainPrefix);
          }
          ClusterDetailsPage.clusterRegionLabelValue()
            .scrollIntoView()
            .contains(clusterProperties.Region.split(',')[0]);
          ClusterDetailsPage.clusterAvailabilityLabelValue()
            .scrollIntoView()
            .contains(clusterProperties.Availability);
          ClusterDetailsPage.clusterSubscriptionBillingModelValue().contains(
            clusterProperties.SubscriptionBillingModel,
          );
          ClusterDetailsPage.clusterInfrastructureBillingModelValue().contains(
            clusterProperties.InfrastructureType,
          );
          if (clusterProperties.MachinePools.hasOwnProperty('Autoscaling')) {
            if (clusterProperties.MachinePools.Autoscaling.includes('Enabled')) {
              cy.contains(`Min: ${3 * parseInt(clusterProperties.MachinePools.MinimumNodeCount)}`);
              cy.contains(`Max: ${3 * parseInt(clusterProperties.MachinePools.MaximumNodeCount)}`);
            } else {
              ClusterDetailsPage.clusterComputeNodeCountValue()
                .scrollIntoView()
                .contains(
                  `${clusterProperties.MachinePools.NodeCount} / ${clusterProperties.MachinePools.NodeCount}`,
                );
            }
          }
          ClusterDetailsPage.clusterAutoScalingStatus().contains(
            clusterProperties.ClusterAutoscaling,
          );
          ClusterDetailsPage.clusterSecureBootSupportForShieldedVMsValue()
            .scrollIntoView()
            .contains(clusterProperties.SecureBootSupportForShieldedVMs);
          ClusterDetailsPage.clusterMachineCIDRLabelValue()
            .scrollIntoView()
            .contains(clusterProperties.MachineCIDR);
          ClusterDetailsPage.clusterServiceCIDRLabelValue()
            .scrollIntoView()
            .contains(clusterProperties.ServiceCIDR);
          ClusterDetailsPage.clusterPodCIDRLabelValue()
            .scrollIntoView()
            .contains(clusterProperties.PodCIDR);
          ClusterDetailsPage.clusterHostPrefixLabelValue()
            .scrollIntoView()
            .contains(clusterProperties.HostPrefix.replace('/', ''));

          ClusterDetailsPage.clusterTotalMemoryValue().should('be.exist');
          ClusterDetailsPage.clusterTotalvCPUValue().should('be.exist');
        });
      },
    );
  },
);
