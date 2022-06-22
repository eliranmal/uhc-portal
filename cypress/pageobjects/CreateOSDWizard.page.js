import Page from './page';

class CreateOSDCluster extends Page {
  isCreateOSDPage() {
    cy.url().should('match', /openshift\/create\/osd$/);
  }

  isCreateOSDTrialPage() {
    cy.url().should('match', /openshift\/create\/osdtrial\?trial=osd$/);
  }

  isBillingModelScreen() {
    cy.contains('h2', 'Welcome to Red Hat OpenShift Dedicated');
  }

  isCloudProviderSelectionScreen() {
    cy.contains('h3', 'Select a cloud provider');
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

  showsFakeClusterBanner = () => cy.contains('On submit, a fake OSD cluster will be created.');

  get clusterNameInput() { return 'input#name'; }

  get clusterNameInputError() { return 'ul#redux-rich-input-popover-name li.pf-c-helper-text__item.pf-m-error.pf-m-dynamic'; }

  get primaryButton() { return '.osd-wizard button.pf-c-button.pf-m-primary'; }

  get CCSSSelected() { return 'input:checked[name="byoc"][value="true"]'; }

  get TrialSelected() { return 'input:checked[name="billing_model"][value="standard-trial"]'; }
}

export default new CreateOSDCluster();
