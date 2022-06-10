import Page from './page';

class CreateCluster extends Page {
  isCreateClusterPage() {
    cy.url().should('match', /openshift\/create$/);
  }
}

export default new CreateCluster();
