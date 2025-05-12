import Page from './page';

class ClusterHistoryDetails extends Page {
  expandClusterHistoryRowEntry(row) {
    cy.contains('td', row).parent().find('button[aria-label="Details"]').click();
  }

  refreshSpinner() {
    cy.get('button[aria-label="Refresh"]').click();
  }

  isRowContainsText(rowEntry) {
    cy.contains('div[class="markdown"] p', rowEntry).should('be.visible');
  }
}

export default new ClusterHistoryDetails();
