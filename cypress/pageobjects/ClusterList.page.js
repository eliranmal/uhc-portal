import get from 'lodash/get';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ClusterList extends Page {

  isClusterListPage() {
    cy.url().should('match', /openshift\/$/);
  }

  isReady() {
    cy.get('div[data-ready="true"]').should('exist');
  }
}

export default new ClusterList();
