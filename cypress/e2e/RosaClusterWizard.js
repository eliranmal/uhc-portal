import LoginPage from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import CreateClusterPage from '../pageobjects/CreateCluster.page';
import CreateRosaWizardPage from '../pageobjects/CreateRosaWizard.page';

describe('Rosa cluster tests', () => {
  before(() => {
    cy.visit('/');
    LoginPage.isLoginPage();
    LoginPage.login();

    ClusterListPage.isClusterListPage();
    ClusterListPage.isReady();
    cy.getByTestId('create_cluster_btn').should('be.visible');
  });

  describe('Create Rosa cluster', () => {
    before(() => {
      cy.intercept({ method: 'GET', url: '**/api/accounts_mgmt/v1/organizations/*/labels' },
        { fixture: 'rosa/rosa_no_associated_account.json' }).as('noAssociatedAWSAccount');
    });

    it('navigates to create Rosa cluster wizard', () => {
      cy.getByTestId('create_cluster_btn').click();
      CreateClusterPage.isCreateClusterPage();
      cy.getByTestId('create_rosa_cluster_btn').click({ force: true }); // need force=true to get past 'element detached from dom' error
      CreateRosaWizardPage.isCreateRosaPage();
      // append rosa query params
      cy.url().then(url => cy.visit(`${url}?env=production&fake=true`));
      cy.wait('@noAssociatedAWSAccount');

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
        // I have this defined in ../support/e2e.js to trap all uncaught exceptions,
        // but it doesn't seem to be working from there
        // eslint-disable-next-line no-unused-vars
        cy.on('uncaught:exception', (err, runnable) => {
          // return false to prevent the error from failing this test
          console.error(`uncaught:exception in Cypress: ${err.message}`);
          return false;
        });

        cy.intercept({ method: 'GET', url: '**/api/accounts_mgmt/v1/organizations/*/labels' },
          { fixture: 'rosa/rosa_one_associated_account.json' }).as('getOneAssociatedAWSAccount');

        cy.intercept({ method: 'POST', url: '**/api.openshift.com/api/clusters_mgmt/v1/aws_inquiries/sts_account_roles' },
          { fixture: 'rosa/rosa_no_arns.json' }).as('noARNs');

        CreateRosaWizardPage.cancelAndRestartWizard();

        cy.wait('@getOneAssociatedAWSAccount', { timeout: 9000 });
        cy.wait('@noARNs', { timeout: 9000 });

        CreateRosaWizardPage.isAccountsAndRolesScreen();
        cy.get(CreateRosaWizardPage.associatedAccountsDropdown).click();
        cy.get(CreateRosaWizardPage.accountIdMenuItem).should('have.length', 1);
        CreateRosaWizardPage.showsNoARNsDetectedAlert();
        cy.get(CreateRosaWizardPage.ARNFieldRequiredMsg).should('have.length', 4); // all 4 ARN fields are empty
      });

      it('tests for all ARNs', () => {
        cy.intercept({ method: 'POST', url: '**/api.openshift.com/api/clusters_mgmt/v1/aws_inquiries/sts_account_roles' },
          { fixture: 'rosa/rosa_all_arns.json' }).as('allARNs');

        cy.getByTestId('refresh_arns_btn').click();
        cy.wait('@allARNs');
        cy.get(CreateRosaWizardPage.ARNFieldRequiredMsg).should('have.length', 0); // no ARN validation alerts
      });

      it('tests preventing Next if prerequisites not acknowledged', () => {
        // click "next"
        cy.get(CreateRosaWizardPage.primaryButton).click();
        CreateRosaWizardPage.isAccountsAndRolesScreen();

        cy.get(CreateRosaWizardPage.acknowledgePrerequisitesCheckbox).click();
        cy.get(CreateRosaWizardPage.primaryButton).click();
      });

      it('tests preventing Next if no user role, shows alert', () => {
        cy.intercept({ method: 'GET', url: '**/api/accounts_mgmt/v1/accounts/*/labels/sts_user_role' },
          {
            statusCode: 404,
            body: '404 Not Found!',
            headers: {
              'x-not-found': 'true',
            },
          }).as('noUserRole');

        // eslint-disable-next-line no-unused-vars
        cy.on('uncaught:exception', (err, runnable) => {
          // return false to prevent the error from failing this test
          console.error(`uncaught:exception in Cypress: ${err.message}`);
          return false;
        });

        cy.get(CreateRosaWizardPage.primaryButton).click({ force: true });
        cy.wait('@noUserRole');

        CreateRosaWizardPage.isAccountsAndRolesScreen();
        CreateRosaWizardPage.showsNoUserRoleAlert();
      });

      it('tests if no ocm role, shows alert', () => {
        cy.intercept({ method: 'GET', url: '**/api/accounts_mgmt/v1/organizations/*/labels' },
          { fixture: 'rosa/rosa_one_associated_account.json' }).as('getOneAssociatedAWSAccount');

        cy.intercept({ method: 'POST', url: '**/api.openshift.com/api/clusters_mgmt/v1/aws_inquiries/sts_account_roles' },
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

        // eslint-disable-next-line no-unused-vars
        cy.on('uncaught:exception', (err, runnable) => {
          // return false to prevent the error from failing this test
          console.error(`uncaught:exception in Cypress: ${err.message}`);
          return false;
        });

        CreateRosaWizardPage.cancelAndRestartWizard();

        cy.wait('@getOneAssociatedAWSAccount');
        cy.wait('@noOcmRole');

        CreateRosaWizardPage.isAccountsAndRolesScreen();
        CreateRosaWizardPage.showsNoOcmRoleAlert();
      });

      it('tests Next goes to next step if no validation errors', () => {
        cy.intercept({ method: 'GET', url: '**/api/accounts_mgmt/v1/organizations/*/labels' },
          { fixture: 'rosa/rosa_one_associated_account.json' }).as('getOneAssociatedAWSAccount');

        cy.intercept({ method: 'GET', url: '**/api/accounts_mgmt/v1/accounts/*/labels/sts_user_role' },
          { fixture: 'rosa/rosa_user_role.json' }).as('getUserRole');

        cy.intercept({ method: 'POST', url: '**/api.openshift.com/api/clusters_mgmt/v1/aws_inquiries/sts_account_roles' },
          { fixture: 'rosa/rosa_all_arns.json' }).as('allARNs');

        cy.intercept({ method: 'GET', url: '**/api.openshift.com/api/clusters_mgmt/v1/versions/**' },
          { fixture: 'rosa/rosa_installable_cluster_versions.json' }).as('getInstallableVersions');

        CreateRosaWizardPage.cancelAndRestartWizard();
        cy.wait('@allARNs');

        cy.get(CreateRosaWizardPage.acknowledgePrerequisitesCheckbox).click();
        cy.get(CreateRosaWizardPage.primaryButton).click({ force: true });
        cy.wait('@getUserRole');
        cy.wait('@getInstallableVersions');

        CreateRosaWizardPage.isClusterDetailsScreen();
      });
    });

    describe('test the Cluster details step', () => {
      it('tests for default version based on previous step', () => {
        CreateRosaWizardPage.isClusterDetailsScreen();
        cy.get(CreateRosaWizardPage.versionsDropdown).click();
        CreateRosaWizardPage.isSelectedVersion('4.9.38');
      });
    });
  });
});
