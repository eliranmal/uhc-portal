import Page from './page';

class GlobalNav extends Page {
  navigateTo(text) {
    cy.get('body').then(($body) => {
      if (!$body.find('#chr-c-sidebar').is(':visible')) {
        cy.get('#nav-toggle').click();
      }
      cy.get('.pf-c-nav__item')
        .contains(text)
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
