import Page from './page';
import LeaveCreateClusterPrompt from './LeaveCreateClusterPrompt';
import ClusterListPage from './ClusterList.page';
import CreateClusterPage from './CreateCluster.page';

class CreateRosaCluster extends Page {
  isCreateRosaPage() {
    cy.url().should('match', /openshift\/create\/rosa\/wizard$/);
  }

  isAccountsAndRolesScreen() {
    cy.contains('h2', 'Welcome to Red Hat OpenShift Service on AWS (ROSA)');
  }

  isAssociateAccountsDialog() {
    cy.contains('h2', 'Associate AWS Account');
  }

  cancelWizard() {
    cy.contains('button', 'Cancel').click();
  }

  isClusterDetailsScreen() {
    cy.contains('h3', 'Cluster details');
  }

  isMachinePoolScreen() {
    cy.contains('h3', 'Default machine pool');
  }

  isNetworkingScreen() {
    cy.contains('h3', 'Networking configuration');
  }

  isCIDRScreen() {
    cy.contains('h3', 'CIDR ranges');
  }

  isUpdatesScreen() {
    cy.contains('h3', 'Cluster update strategy');
  }

  isReviewScreen() {
    cy.contains('h2', 'Review your dedicated cluster');
  }

  showsNoARNsDetectedAlert() {
    cy.contains('h4', 'Some account roles ARNs were not detected');
  }

  showsNoUserRoleAlert() {
    cy.contains('h4', 'A user-role could not be detected');
  }

  showsNoOcmRoleAlert() {
    cy.contains('h4', 'Cannot detect an OCM role');
  }

  showsFakeClusterBanner = () => cy.contains('On submit, a fake ROSA cluster will be created.');

  showsNoAssociatedAccounts = () => cy.getByTestId('no_associated_accounts').should('be.visible');

  isSelectedVersion = (testVersion) => {
    cy.get('button.pf-c-select__menu-item.pf-m-selected').scrollIntoView().invoke('text').should('eq', testVersion);
  }

  cancelAndRestartWizard = () => {
    cy.log('cancel and restart wizard');
    this.cancelWizard();
    LeaveCreateClusterPrompt.submit();
    ClusterListPage.isReady();
    cy.getByTestId('create_cluster_btn')
      .click();
    CreateClusterPage.isCreateClusterPage();
    cy.getByTestId('create_rosa_cluster_btn')
      .click({ force: true });
  };

  get accountIdMenuItem() { return '.pf-c-select__menu-item'; }

  get associatedAccountsDropdown() { return 'button.pf-c-select__toggle'; }

  get versionsDropdown() { return 'div[name="cluster_version"] button.pf-c-select__toggle'; }

  get ARNFieldRequiredMsg() { return '.pf-c-expandable-section.pf-m-expanded .pf-c-form__helper-text.pf-m-error'; }

  get acknowledgePrerequisitesCheckbox() { return '#acknowledge_prerequisites'; }

  get clusterNameInput() { return 'input#name'; }

  get clusterNameInputError() { return 'ul#redux-rich-input-popover-name li.pf-c-helper-text__item.pf-m-error.pf-m-dynamic'; }

  get primaryButton() { return '.rosa-wizard button.pf-c-button.pf-m-primary'; }
}

export default new CreateRosaCluster();
