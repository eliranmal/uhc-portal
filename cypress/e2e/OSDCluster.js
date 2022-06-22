import LoginPage from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import CreateClusterPage from '../pageobjects/CreateCluster.page';
import CreateOSDWizardPage from '../pageobjects/CreateOSDWizard.page';
import GlobalNav from '../pageobjects/GlobalNav.page';
import LeaveCreateClusterPrompt from '../pageobjects/LeaveCreateClusterPrompt';

const clusterName = `test-${Math.random().toString(36).substr(2, 10)}`;

describe('OSD cluster tests', () => {
  before(() => {
    // visiting '/' will goto baseUrl defined in package.json
    // baseUrl ends in '.../openshift/'.  To goto sub-pages you
    // only need to specify relative path to baseUrl.
    // Ex: cy.visit('/create/osd');
    cy.visit('/');
    LoginPage.isLoginPage();
    LoginPage.login();

    ClusterListPage.isClusterListPage();
    ClusterListPage.isReady();
    // cy.getByTestId('foo') finds any elements with 'data-test-id' attribute === 'foo',
    // if none, tries 'data-testid' attribute
    cy.getByTestId('create_cluster_btn').should('be.visible');
  });

  describe('Create OSD cluster on AWS flow', () => {
    it('navigates to create OSD cluster', () => {
      cy.getByTestId('create_cluster_btn').click();
      CreateClusterPage.isCreateClusterPage();
      cy.getByTestId('create_osd_cluster_btn').click({ force: true }); // need force=true to get past 'element detached from dom' error
      CreateOSDWizardPage.isCreateOSDPage();
      // append the fake=true query param
      cy.url().then(url => cy.visit(`${url}?fake=true`));
      CreateOSDWizardPage.showsFakeClusterBanner();
    });

    it('shows an error with invalid and empty names', () => {
      CreateOSDWizardPage.isBillingModelScreen();
      cy.get(CreateOSDWizardPage.primaryButton).click();
      cy.getByTestId('aws-provider-card').click();
      cy.get(CreateOSDWizardPage.primaryButton).click();

      CreateOSDWizardPage.isClusterDetailsScreen();
      cy.get(CreateOSDWizardPage.clusterNameInput).type('aaaaaaaaaaaaaaaa');
      cy.get(CreateOSDWizardPage.clusterNameInputError).contains('1 - 15 characters');
      cy.get(CreateOSDWizardPage.clusterNameInput).clear();
      cy.get(CreateOSDWizardPage.clusterNameInputError).should('have.length', 4);
      cy.get(CreateOSDWizardPage.clusterNameInput).clear().type('a*a');
      cy.get(CreateOSDWizardPage.clusterNameInputError).contains('Consist of lower-case alphanumeric');
      cy.get(CreateOSDWizardPage.clusterNameInput).clear().type('9a');
      cy.get(CreateOSDWizardPage.clusterNameInputError).contains('Start with a lower-case alphabetic');
      cy.get(CreateOSDWizardPage.clusterNameInput).clear().type('a*');
      cy.get(CreateOSDWizardPage.clusterNameInputError).last().contains('End with a lower-case alphanumeric');
    });

    it('fills OSD wizard but does not really create an OSD cluster', () => {
      cy.get(CreateOSDWizardPage.clusterNameInput).clear().type(clusterName);
      cy.get(CreateOSDWizardPage.clusterNameInputError).should('have.length', 0);

      // click "next" until the cluster is created :)
      cy.get(CreateOSDWizardPage.primaryButton).click();
      CreateOSDWizardPage.isMachinePoolScreen();
      cy.get(CreateOSDWizardPage.primaryButton).click();
      CreateOSDWizardPage.isNetworkingScreen();
      cy.get(CreateOSDWizardPage.primaryButton).click();
      CreateOSDWizardPage.isCIDRScreen();
      cy.get(CreateOSDWizardPage.primaryButton).click();
      CreateOSDWizardPage.isUpdatesScreen();
      cy.get(CreateOSDWizardPage.primaryButton).click();
      CreateOSDWizardPage.isReviewScreen();
    });
  });
});

describe('OSD Trial cluster tests', () => {
  describe('View Create OSD Trial cluster page', () => {
    it('navigates to create OSD Trial cluster and CCS is selected', () => {
      GlobalNav.navigateTo('Clusters');

      LeaveCreateClusterPrompt.submit();

      ClusterListPage.isReady();

      cy.getByTestId('create_cluster_btn').click();
      CreateClusterPage.isCreateClusterPage();
      cy.getByTestId('create_osd_trial-cluster_btn').click({ force: true });
      CreateOSDWizardPage.isCreateOSDTrialPage();
      cy.get(CreateOSDWizardPage.CCSSSelected).should('exist');
      cy.get(CreateOSDWizardPage.TrialSelected).should('exist');
    });
  });
});
