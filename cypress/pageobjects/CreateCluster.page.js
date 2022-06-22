import Page from './page';

class CreateCluster extends Page {
  isCreateClusterPage() {
    cy.url().should('match', /openshift\/create$/);
  }

  get createOSDTrialClusterBtn() { return $("//button[contains(text(),'Create trial cluster')]"); }
}

export default new CreateCluster();
