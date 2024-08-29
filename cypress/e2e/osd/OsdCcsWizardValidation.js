import CreateOSDWizardPage from '../../pageobjects/CreateOSDWizard.page';
import { Clusters } from '../../fixtures/osd/OsdWizardValidation.json';
import { ClustersValidation } from '../../fixtures/osd/OsdWizardValidation.json';

const QE_GCP = Cypress.env('QE_GCP_OSDCCSADMIN_JSON');
const awsAccountID = Cypress.env('QE_AWS_ID');
const awsAccessKey = Cypress.env('QE_AWS_ACCESS_KEY_ID');
const awsSecretKey = Cypress.env('QE_AWS_ACCESS_KEY_SECRET');

describe('OSD Wizard validation tests(OCP-54134,OCP-73204)', { tags: ['smoke'] }, () => {
  beforeEach(() => {
    if (Cypress.currentTest.title.match(/Launch OSD.*cluster wizard/g)) {
      cy.visit('/create');
    }
  });
  Clusters.forEach((clusterProperties) => {
    let isCCSCluster = clusterProperties.InfrastructureType.includes('Red Hat') ? false : true;
    it(`Launch OSD - ${clusterProperties.CloudProvider}-${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType} cluster wizard`, () => {
      CreateOSDWizardPage.osdCreateClusterButton().click();
      CreateOSDWizardPage.isCreateOSDPage();
    });

    it(`OSD wizard -  ${clusterProperties.CloudProvider}-${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType} : Billing model`, () => {
      CreateOSDWizardPage.isBillingModelScreen();
      CreateOSDWizardPage.selectSubscriptionType(clusterProperties.SubscriptionType);
      CreateOSDWizardPage.selectInfrastructureType(clusterProperties.InfrastructureType);
      CreateOSDWizardPage.wizardNextButton().click();
    });

    it(`OSD wizard - ${clusterProperties.CloudProvider}-${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType} : Cluster Settings- Cloud provider -field validations`, () => {
      CreateOSDWizardPage.isCloudProviderSelectionScreen();
      CreateOSDWizardPage.selectCloudProvider(clusterProperties.CloudProvider);
      if (isCCSCluster) {
        CreateOSDWizardPage.wizardNextButton().click();
        CreateOSDWizardPage.isTextContainsInPage(
          ClustersValidation.ClusterSettings.CloudProvider.Common.AcknowledgementUncheckedError,
        );
        CreateOSDWizardPage.acknowlegePrerequisitesCheckbox().check();

        if (clusterProperties.CloudProvider.includes('GCP')) {
          if (clusterProperties.AuthenticationType.includes('ServiceAccount')) {
            CreateOSDWizardPage.wizardNextButton().click();
            CreateOSDWizardPage.isTextContainsInPage(
              ClustersValidation.ClusterSettings.CloudProvider.GCP.EmptyGCPServiceJSONFieldError,
            );
            CreateOSDWizardPage.uploadGCPServiceAccountJSON(
              ClustersValidation.ClusterSettings.CloudProvider.GCP
                .InvalidFormatGCPServiceJSONValues,
            );
            CreateOSDWizardPage.wizardNextButton().click();
            CreateOSDWizardPage.isTextContainsInPage(
              ClustersValidation.ClusterSettings.CloudProvider.GCP
                .InvalidFormatGCPServiceJSONFieldError,
            );
            CreateOSDWizardPage.uploadGCPServiceAccountJSON(
              ClustersValidation.ClusterSettings.CloudProvider.GCP.InvalidGCPServiceJSONValues,
            );
            CreateOSDWizardPage.wizardNextButton().click();
            CreateOSDWizardPage.isTextContainsInPage(
              ClustersValidation.ClusterSettings.CloudProvider.GCP.InvalidGCPServiceJSONFieldError,
            );
            CreateOSDWizardPage.uploadGCPServiceAccountJSON(JSON.stringify(QE_GCP));
          } else {
            CreateOSDWizardPage.workloadIdentityFederationButton().click();
            CreateOSDWizardPage.wizardNextButton().click();
            CreateOSDWizardPage.isTextContainsInPage(
              ClustersValidation.ClusterSettings.CloudProvider.GCP.NoWIFConfigSelectionError,
            );
            CreateOSDWizardPage.isTextContainsInPage(
              ClustersValidation.ClusterSettings.CloudProvider.Common.AcknowledgementUncheckedError,
            );
            CreateOSDWizardPage.gcpWIFCommandInput().should(
              'have.value',
              ClustersValidation.ClusterSettings.CloudProvider.GCP.WIFCommandValue,
            );
            CreateOSDWizardPage.acknowlegePrerequisitesCheckbox().check();
            CreateOSDWizardPage.selectWorkloadIdentityConfiguration(
              Cypress.env('QE_GCP_WIF_CONFIG'),
            );
          }
        } else {
          CreateOSDWizardPage.awsSecretKeyInput().type(awsSecretKey);
          CreateOSDWizardPage.wizardNextButton().click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.CloudProvider.AWS.EmptyAWSAccountIdError,
          );
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.CloudProvider.AWS.EmptyAWSAccessKeyError,
          );
          CreateOSDWizardPage.awsAccessKeyInput().type(awsAccessKey);
          CreateOSDWizardPage.awsAccessKeyInput().clear();
          CreateOSDWizardPage.wizardNextButton().click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.CloudProvider.AWS.EmptyAWSSecretKeyError,
          );
          CreateOSDWizardPage.awsAccountIDInput()
            .clear()
            .type(
              ClustersValidation.ClusterSettings.CloudProvider.AWS.InValidAWSAccountIdValues[0],
            );
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.CloudProvider.AWS.InValidAWSAccountIdError,
          );
          CreateOSDWizardPage.wizardNextButton().click();
          CreateOSDWizardPage.awsAccountIDInput()
            .clear()
            .type(
              ClustersValidation.ClusterSettings.CloudProvider.AWS.InValidAWSAccountIdValues[1],
            );
          CreateOSDWizardPage.wizardNextButton().click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.CloudProvider.AWS.InValidAWSAccountIdError,
          );
          CreateOSDWizardPage.awsAccountIDInput().clear().type(awsAccountID);
          CreateOSDWizardPage.awsAccessKeyInput().clear().type(awsAccessKey);
          CreateOSDWizardPage.awsSecretKeyInput().clear().type(awsSecretKey);
        }
      }
      CreateOSDWizardPage.wizardNextButton().click();
    });
    it(`OSD wizard - ${clusterProperties.CloudProvider}-${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType} : Cluster Settings - Cluster details- field validations`, () => {
      CreateOSDWizardPage.isClusterDetailsScreen();
      cy.get(CreateOSDWizardPage.clusterNameInput)
        .scrollIntoView()
        .type(ClustersValidation.ClusterSettings.Details.Common.InvalidClusterNamesValues[0]);
      CreateOSDWizardPage.closePopoverDialogs();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Details.Common.InvalidClusterNamesErrors[0],
      );
      cy.get(CreateOSDWizardPage.clusterNameInput)
        .scrollIntoView()
        .type('{selectAll}')
        .type(ClustersValidation.ClusterSettings.Details.Common.InvalidClusterNamesValues[1]);
      CreateOSDWizardPage.closePopoverDialogs();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Details.Common.InvalidClusterNamesErrors[1],
      );
      cy.get(CreateOSDWizardPage.clusterNameInput)
        .scrollIntoView()
        .type('{selectAll}')
        .type(ClustersValidation.ClusterSettings.Details.Common.InvalidClusterNamesValues[2]);
      CreateOSDWizardPage.closePopoverDialogs();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Details.Common.InvalidClusterNamesErrors[2],
      );
      CreateOSDWizardPage.createCustomDomainPrefixCheckbox().scrollIntoView().check();
      CreateOSDWizardPage.domainPrefixInput()
        .scrollIntoView()
        .type('{selectAll}')
        .type(ClustersValidation.ClusterSettings.Details.Common.InvalidDomainPrefixValues[0]);
      CreateOSDWizardPage.closePopoverDialogs();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Details.Common.InvalidDomainPrefixErrors[0],
      );
      CreateOSDWizardPage.domainPrefixInput()
        .scrollIntoView()
        .type('{selectAll}')
        .type(ClustersValidation.ClusterSettings.Details.Common.InvalidDomainPrefixValues[1]);
      CreateOSDWizardPage.closePopoverDialogs();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Details.Common.InvalidDomainPrefixErrors[1],
      );
      CreateOSDWizardPage.domainPrefixInput()
        .scrollIntoView()
        .type('{selectAll}')
        .type(ClustersValidation.ClusterSettings.Details.Common.InvalidDomainPrefixValues[2]);
      CreateOSDWizardPage.closePopoverDialogs();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Details.Common.InvalidDomainPrefixErrors[2],
      );
      CreateOSDWizardPage.createCustomDomainPrefixCheckbox().uncheck();
      CreateOSDWizardPage.selectAvailabilityZone('Single Zone');
      if (clusterProperties.CloudProvider.includes('GCP')) {
        CreateOSDWizardPage.enableSecureBootSupportForSchieldedVMs(true);
      } else {
        if (isCCSCluster) {
          CreateOSDWizardPage.advancedEncryptionLink().click();
          CreateOSDWizardPage.useCustomKMSKeyRadio().check();
          CreateOSDWizardPage.wizardNextButton().click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.Details.AWS.KeyARNs.EmptyValueError,
          );
          CreateOSDWizardPage.keyArnInput()
            .clear()
            .type(ClustersValidation.ClusterSettings.Details.AWS.KeyARNs.WrongFormatValue);
          CreateOSDWizardPage.wizardNextButton().click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.Details.AWS.KeyARNs.WrongFormatError,
          );
          CreateOSDWizardPage.keyArnInput()
            .clear()
            .type(ClustersValidation.ClusterSettings.Details.AWS.KeyARNs.WrongFormatWithWhitespace);
          CreateOSDWizardPage.wizardNextButton().click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.ClusterSettings.Details.AWS.KeyARNs.WrongFormatWithWhitespaceError,
          );
          CreateOSDWizardPage.useDefaultKMSKeyRadio().check();
        }
      }
      cy.get(CreateOSDWizardPage.clusterNameInput).clear().type('wizardvalid');
      CreateOSDWizardPage.wizardNextButton().click();
    });
    it(`OSD wizard - ${clusterProperties.CloudProvider} -${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType} : Cluster Settings - Machinepool(nodes) field validations`, () => {
      CreateOSDWizardPage.isMachinePoolScreen();
      CreateOSDWizardPage.enableAutoScaling();
      CreateOSDWizardPage.setMinimumNodeCount('0');
      let machinePoolProperties =
        isCCSCluster === true
          ? ClustersValidation.ClusterSettings.Machinepool.NodeCount.CCS
          : ClustersValidation.ClusterSettings.Machinepool.NodeCount.NonCCS;
      CreateOSDWizardPage.isTextContainsInPage(machinePoolProperties.SingleZone.LowerLimitError);
      CreateOSDWizardPage.setMinimumNodeCount('200');
      CreateOSDWizardPage.isTextContainsInPage(machinePoolProperties.SingleZone.UpperLimitError);
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.SingleZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.setMinimumNodeCount(isCCSCluster === true ? '2' : '4');
      CreateOSDWizardPage.setMaximumNodeCount('200');
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.SingleZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.setMaximumNodeCount('0');
      CreateOSDWizardPage.isTextContainsInPage(machinePoolProperties.SingleZone.LowerLimitError);
      CreateOSDWizardPage.setMaximumNodeCount(isCCSCluster === true ? '2' : '4');
      CreateOSDWizardPage.minimumNodeCountPlusButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.SingleZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.maximumNodeCountPlusButton().click();
      CreateOSDWizardPage.maximumNodeCountMinusButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.SingleZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.minimumNodeCountMinusButton().click();
      CreateOSDWizardPage.wizardBackButton().click();
      CreateOSDWizardPage.selectAvailabilityZone('Multi-zone');
      CreateOSDWizardPage.wizardNextButton().click();

      CreateOSDWizardPage.setMinimumNodeCount('0');
      CreateOSDWizardPage.isTextContainsInPage(machinePoolProperties.MultiZone.LowerLimitError);
      CreateOSDWizardPage.setMinimumNodeCount('200');
      CreateOSDWizardPage.isTextContainsInPage(machinePoolProperties.MultiZone.UpperLimitError);
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.MultiZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.setMinimumNodeCount(isCCSCluster === true ? '2' : '3');
      CreateOSDWizardPage.setMaximumNodeCount('200');
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.MultiZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.setMaximumNodeCount('0');
      CreateOSDWizardPage.isTextContainsInPage(machinePoolProperties.MultiZone.LowerLimitError);
      CreateOSDWizardPage.setMaximumNodeCount(isCCSCluster === true ? '2' : '3');
      CreateOSDWizardPage.minimumNodeCountPlusButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.MultiZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.maximumNodeCountPlusButton().click();
      CreateOSDWizardPage.maximumNodeCountMinusButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        machinePoolProperties.MultiZone.MinAndMaxLimitDependencyError,
      );
      CreateOSDWizardPage.minimumNodeCountMinusButton().click();
    });
    it(`OSD wizard - ${clusterProperties.CloudProvider} -${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType} : Cluster Settings - Machinepool(Labels) field validations`, () => {
      CreateOSDWizardPage.addNodeLabelLink().click();
      CreateOSDWizardPage.addNodeLabelKeyAndValue(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].UpperCharacterLimitValue,
        'test',
        0,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].KeyError,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].LabelError,
        false,
      );
      CreateOSDWizardPage.addNodeLabelKeyAndValue(
        'test',
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].UpperCharacterLimitValue,
        0,
      );

      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].KeyError,
        false,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].LabelError,
      );

      CreateOSDWizardPage.addNodeLabelKeyAndValue('test-t_123.com', 'test-t_123.com', 0);
      cy.contains('Node labels (optional)').click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].KeyError,
        false,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].LabelError,
        false,
      );

      CreateOSDWizardPage.addNodeLabelKeyAndValue(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[1].InvalidValue,
        'test',
        0,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[1].KeyError,
      );
      CreateOSDWizardPage.addNodeLabelKeyAndValue(
        'testing',
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[1].InvalidValue,
        0,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[1].LabelError,
      );
      CreateOSDWizardPage.addNodeLabelKeyAndValue(
        'test',
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[2].InvalidValue,
        0,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[2].KeyError,
      );
      CreateOSDWizardPage.addNodeLabelKeyAndValue(
        'example12-ing.com/MyName',
        'test-ing_123.com',
        0,
      );
      cy.contains('Node labels (optional)').click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[0].KeyError,
        false,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[1].KeyError,
        false,
      );
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.ClusterSettings.Machinepool.Common.NodeLabel[2].KeyError,
        false,
      );
      CreateOSDWizardPage.wizardNextButton().click();
    });
    it(`OSD wizard - ${clusterProperties.CloudProvider} -${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType}  : Networking configuration - field validations`, () => {
      if (clusterProperties.CloudProvider.includes('GCP') && !isCCSCluster) {
        cy.log(
          `Cloud provider : ${clusterProperties.CloudProvider} -${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType} with CCS cluster=${isCCSCluster} not supported Networking configuration > Cluster privacy`,
        );
      } else {
        CreateOSDWizardPage.isNetworkingScreen();
        if (isCCSCluster) {
          CreateOSDWizardPage.applicationIngressCustomSettingsRadio().check();
          CreateOSDWizardPage.applicationIngressRouterSelectorsInput()
            .clear()
            .type(
              ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
                .RouteSelector[0].UpperCharacterLimitValue,
            );
          cy.contains('Route selector').click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .RouteSelector[0].Error,
          );
          CreateOSDWizardPage.applicationIngressRouterSelectorsInput()
            .clear()
            .type(
              ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
                .RouteSelector[1].InvalidValue,
            );
          cy.contains('Route selector').click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .RouteSelector[1].Error,
          );
          CreateOSDWizardPage.applicationIngressRouterSelectorsInput()
            .clear()
            .type(
              ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
                .RouteSelector[2].InvalidValue,
            );
          cy.contains('Route selector').click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .RouteSelector[2].Error,
          );
          CreateOSDWizardPage.applicationIngressRouterSelectorsInput()
            .clear()
            .type(
              ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
                .RouteSelector[3].InvalidValue,
            );
          cy.contains('Route selector').click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .RouteSelector[3].Error,
          );
          CreateOSDWizardPage.applicationIngressRouterSelectorsInput()
            .clear()
            .type('valid123-k.com/Hello_world2');
          cy.contains('Route selector').click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .RouteSelector[0].Error,
            false,
          );
          CreateOSDWizardPage.applicationIngressExcludedNamespacesInput()
            .clear()
            .type(
              ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
                .ExcludedNamespaces[0].UpperCharacterLimitValue,
            );
          cy.contains('Route selector').click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .ExcludedNamespaces[0].Error,
          );
          CreateOSDWizardPage.applicationIngressExcludedNamespacesInput()
            .clear()
            .type(
              ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
                .ExcludedNamespaces[1].InvalidValue,
            );
          cy.contains('Route selector').click();
          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .ExcludedNamespaces[1].Error,
          );
          CreateOSDWizardPage.applicationIngressExcludedNamespacesInput().clear().type('abc-123');
          cy.contains('Route selector').click();

          CreateOSDWizardPage.isTextContainsInPage(
            ClustersValidation.Networking.Configuration.Common.IngressSettings.CustomSettings
              .ExcludedNamespaces[1].Error,
            false,
          );
        }
        CreateOSDWizardPage.wizardNextButton().click();
      }
    });
    it(`OSD wizard - ${clusterProperties.CloudProvider} -${clusterProperties.SubscriptionType}-${clusterProperties.InfrastructureType}  : Networking configuration - CIDR field validations`, () => {
      CreateOSDWizardPage.isCIDRScreen();
      CreateOSDWizardPage.useCIDRDefaultValues(false);
      CreateOSDWizardPage.machineCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[0].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[0].Error,
      );
      CreateOSDWizardPage.machineCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[1].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[1].Error,
      );
      CreateOSDWizardPage.machineCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Error,
      );
      CreateOSDWizardPage.machineCIDRInput().clear().type('10.0.0.0/16');
      cy.contains('Machine CIDR').click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Error,
        false,
      );
      CreateOSDWizardPage.serviceCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[0].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[0].Error,
      );
      CreateOSDWizardPage.serviceCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[1].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[1].Error,
      );
      CreateOSDWizardPage.serviceCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Error,
      );
      CreateOSDWizardPage.serviceCIDRInput().clear().type('172.30.0.0/16');
      cy.contains('Service CIDR').click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Error,
        false,
      );
      CreateOSDWizardPage.podCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[0].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[0].Error,
      );
      CreateOSDWizardPage.podCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[1].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[1].Error,
      );
      CreateOSDWizardPage.podCIDRInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Error,
      );
      CreateOSDWizardPage.podCIDRInput().clear().type('10.128.0.0/14');
      cy.contains('Pod CIDR').click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.CIDR[2].Error,
        false,
      );
      CreateOSDWizardPage.hostPrefixInput().clear();
      cy.contains('Pod CIDR').click();
      cy.get('div').contains('Field is required').should('be.visible');
      CreateOSDWizardPage.hostPrefixInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.HostPrefix[0].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.HostPrefix[0].Error,
      );
      CreateOSDWizardPage.hostPrefixInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.HostPrefix[1].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.HostPrefix[1].Error,
      );
      CreateOSDWizardPage.hostPrefixInput()
        .clear()
        .type(ClustersValidation.Networking.CIDRRanges.Common.HostPrefix[2].Value);
      CreateOSDWizardPage.wizardNextButton().click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.HostPrefix[2].Error,
      );
      CreateOSDWizardPage.hostPrefixInput().clear().type('/23');
      cy.contains('Pod CIDR').click();
      CreateOSDWizardPage.isTextContainsInPage(
        ClustersValidation.Networking.CIDRRanges.Common.HostPrefix[2].Error,
        false,
      );
      CreateOSDWizardPage.useCIDRDefaultValues(true);
      CreateOSDWizardPage.wizardNextButton().click();
    });
  });
});
