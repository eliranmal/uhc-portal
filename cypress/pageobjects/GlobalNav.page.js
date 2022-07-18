import Page from './page';

class GlobalNav extends Page {
  navigateTo(text) {
    cy.get('body').then(($body) => {
      if (!$body.find('#chr-c-sidebar').is(':visible')) {
        cy.get('#nav-toggle').click();
      }
      cy.contains('a.pf-c-nav__link', text)
        .click();
    });
  }

  closeSideBarNav() {
    cy.get('body').then(($body) => {
      if ($body.find('#chr-c-sidebar').is(':visible')) {
        cy.get('#nav-toggle').click();
      }
    });
  }
}

export default new GlobalNav();
