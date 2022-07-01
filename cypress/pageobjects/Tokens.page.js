import Page from './page';
import GlobalNav from './GlobalNav.page';

class TokenPages extends Page {
  navigateToOCMToken() {
    GlobalNav.navigateTo('Downloads');
    cy.getByTestId('view-api-token-btn').click();
  }

  navigateToROSAToken() {
    cy.visit('/token/rosa');
  }
}

export default new TokenPages();
