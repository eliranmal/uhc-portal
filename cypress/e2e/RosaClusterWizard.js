import Login from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import CreateClusterPage from '../pageobjects/CreateCluster.page';
import CreateRosaWizardPage from '../pageobjects/CreateRosaWizard.page';

const associatedAccountsSelector = '**/api/accounts_mgmt/v1/organizations/*/labels';
const ARNsSelector = '**/api.openshift.com/api/clusters_mgmt/v1/aws_inquiries/sts_account_roles';
const userRoleSelector = '**/api/accounts_mgmt/v1/accounts/*/labels/sts_user_role';

const interceptAndReturnMockAssociatedAccounts = mockFile => cy.intercept({ method: 'GET', url: associatedAccountsSelector },
  { fixture: mockFile }).as('getMockAssociatedAccounts');
const interceptAndReturnMockARNs = mockFile => cy.intercept({ method: 'POST', url: ARNsSelector },
  { fixture: mockFile }).as('getMockARNs');

describe('Rosa cluster tests', () => {
  before(() => {
    cy.visit('/');
    Login.isLoginPageUrl();
    Login.login();

    ClusterListPage.isClusterListUrl();
    ClusterListPage.isReady();
    cy.getByTestId('create_cluster_btn').should('be.visible');
  });

  describe('Create Rosa cluster', () => {
    it('navigates to create Rosa cluster wizard', () => {
      interceptAndReturnMockAssociatedAccounts('rosa/rosa_no_associated_account.json');

      cy.getByTestId('create_cluster_btn').click();
      CreateClusterPage.isCreateClusterPage();
      cy.getByTestId('create_rosa_cluster_btn').click({ force: true }); // need force=true to get past 'element detached from dom' error
      CreateRosaWizardPage.isCreateRosaPage();
      // append rosa query params
      cy.url().then(url => cy.visit(`${url}?env=production&fake=true`));
      cy.wait('@getMockAssociatedAccounts');

      CreateRosaWizardPage.showsFakeClusterBanner();
      CreateRosaWizardPage.isAccountsAndRolesScreen();
    });

    describe('test the Accounts and roles step', () => {
      it('tests for no associated accounts', () => {
        cy.get(CreateRosaWizardPage.associatedAccountsDropdown).click();
        CreateRosaWizardPage.showsNoAssociatedAccounts();
      });

      // the double load of the assoc. aws accounts dialog is causing issues with cypress
      it.skip('test associate aws account dialog', () => {
        cy.getByTestId('launch-associate-account-btn').click();
        CreateRosaWizardPage.isAssociateAccountsDialog();
      });

      it('tests for an associated account, no ARNs alert', () => {
        interceptAndReturnMockAssociatedAccounts('rosa/rosa_one_associated_account.json');
        interceptAndReturnMockARNs('rosa/rosa_no_arns.json');

        CreateRosaWizardPage.cancelAndRestartWizard();

        cy.wait('@getMockAssociatedAccounts', { timeout: 9000 });
        cy.wait('@getMockARNs', { timeout: 9000 });

        CreateRosaWizardPage.isAccountsAndRolesScreen();
        cy.get(CreateRosaWizardPage.associatedAccountsDropdown).click();
        cy.get(CreateRosaWizardPage.accountIdMenuItem).should('have.length', 1);
        CreateRosaWizardPage.showsNoARNsDetectedAlert();
        cy.get(CreateRosaWizardPage.ARNFieldRequiredMsg).should('have.length', 4); // all 4 ARN fields are empty
      });

      it('tests for all ARNs', () => {
        interceptAndReturnMockARNs('rosa/rosa_all_arns.json');

        cy.getByTestId('refresh_arns_btn').click();
        cy.wait('@getMockARNs');
        cy.get(CreateRosaWizardPage.ARNFieldRequiredMsg).should('have.length', 0); // no ARN validation alerts
      });

      it('tests preventing Next if prerequisites not acknowledged', () => {
        // click "next"
        cy.get(CreateRosaWizardPage.primaryButton).click();
        CreateRosaWizardPage.isAccountsAndRolesScreen();
      });

      it('tests preventing Next if no user role, shows alert', () => {
        cy.intercept({ method: 'GET', url: userRoleSelector },
          {
            statusCode: 404,
            body: '404 Not Found!',
            headers: {
              'x-not-found': 'true',
            },
          }).as('noUserRole');

        cy.get(CreateRosaWizardPage.acknowledgePrerequisitesCheckbox).click();
        cy.get(CreateRosaWizardPage.primaryButton).click({ force: true });
        cy.wait('@noUserRole');

        CreateRosaWizardPage.isAccountsAndRolesScreen();
        CreateRosaWizardPage.showsNoUserRoleAlert();
      });

      it('tests if no ocm role, shows alert', () => {
        interceptAndReturnMockAssociatedAccounts('rosa/rosa_one_associated_account.json');

        cy.intercept({ method: 'POST', url: ARNsSelector },
          {
            statusCode: 400,
            body: {
              kind: 'Error',
              id: '400',
              href: '/api/clusters_mgmt/v1/errors/400',
              code: 'CLUSTERS-MGMT-400',
              reason: "Add 'arn:aws:iam::8888:role/RH-Managed-OpenShift-Installer' to the trust policy on IAM role 'ManagedOpenShift-OCM-Role-151515'",
              details: [
                {
                  Error_Key: 'NoTrustedRelationshipOnClusterRole',
                },
              ],
              operation_id: 'f15efc24-e3c6-436f-be01-7e8be1009265',
            },
          }).as('noOcmRole');

        CreateRosaWizardPage.cancelAndRestartWizard();

        cy.wait('@getMockAssociatedAccounts');
        cy.wait('@noOcmRole');

        CreateRosaWizardPage.isAccountsAndRolesScreen();
        CreateRosaWizardPage.showsNoOcmRoleAlert();
      });

      it('tests Next goes to next step if no validation errors', () => {
        interceptAndReturnMockAssociatedAccounts('rosa/rosa_one_associated_account.json');
        interceptAndReturnMockARNs('rosa/rosa_all_arns.json');

        cy.intercept({ method: 'GET', url: userRoleSelector },
          { fixture: 'rosa/rosa_user_role.json' }).as('getMockUserRole');

        cy.intercept({ method: 'GET', url: '**/api.openshift.com/api/clusters_mgmt/v1/versions/**' },
          { fixture: 'rosa/rosa_installable_cluster_versions.json' }).as('getMockVersions');

        CreateRosaWizardPage.cancelAndRestartWizard();
        cy.wait('@getMockAssociatedAccounts');
        cy.wait('@getMockARNs');

        cy.get(CreateRosaWizardPage.acknowledgePrerequisitesCheckbox).click();
        cy.get(CreateRosaWizardPage.primaryButton).click({ force: true });
        cy.wait('@getMockUserRole');
        cy.wait('@getMockVersions');

        CreateRosaWizardPage.isClusterDetailsScreen();
      });
    });

    describe('test the Cluster details step', () => {
      it('tests for default version based on previous step', () => {
        CreateRosaWizardPage.isClusterDetailsScreen();
        cy.get(CreateRosaWizardPage.versionsDropdown).click();
        CreateRosaWizardPage.isSelectedVersion('4.10.18');
      });
    });
  });
});
